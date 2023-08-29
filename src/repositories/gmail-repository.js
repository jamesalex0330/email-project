import { Op } from "sequelize";
import xlsx from 'xlsx';
import models from "../models";
import gmailService from "../services/gmail";
import path from "path";
const unZipper = require("unzipper");
const fs = require('fs');
const { Sequelize } = models.sequelize;
const { txnResponseSystematicRsp, txnResponseTransactionRsp, userCanRegistration, user, schemeMasterInc, schemeThresholdInc, cdsHold, readMail } = models;
export default {
    async getUnreadEmails() {
        try {
            let email = process.env.EMAIL;
            let messageList = await gmailService.messageList(email);
            if (messageList?.messages) {
                let messages = messageList.messages;
                for await (const message of messages) {
                    let messageId = message.id;
                    let messageDetails = await gmailService.readMail(email, messageId);
                    if (messageDetails) {
                        if (messageDetails?.payload?.headers) {
                            let headerArray = messageDetails?.payload?.headers;
                            let arrayData = headerArray.find(item => item?.name.toLowerCase() === "subject");
                            let subject = arrayData['value'].toLowerCase();
                            var getSubject = this.getSubject(subject);
                            if (getSubject && messageDetails?.payload?.parts) {
                                await this.getAttachmentData(messageDetails.payload.parts, email, messageId, getSubject, subject)
                            } else {
                                await gmailService.markAsRead(email, messageId);
                            }
                        }
                    }
                }
            }
            return messageList;
        } catch (error) {
            console.log(error, "error");
            throw Error(error);
        }
    },
    async getAttachmentData(messageDetails, email, messageId, getSubject, subject) {
        const transaction = await models.sequelize.transaction();
        try {
            var checkMessageExist = await readMail.findOne({ where: { messageId: messageId } });
            if (!checkMessageExist) {
                for await (const mailPart of messageDetails) {
                    if (mailPart?.body?.attachmentId) {
                        let attachmentId = mailPart.body.attachmentId;
                        let result = await gmailService.getAttachment(email, messageId, attachmentId);
                        var attachmentData = result.data;
                        if (attachmentData) {
                            let getFileName = (mailPart.filename).split('.');
                            let getFileExt = getFileName.slice(-1);
                            let transactionSubject = "Transaction Response Feed".toLowerCase();
                            let masterSubject = "MF Utility-Incremental Scheme".toLowerCase();
                            let mfuSystematicRsp = "mfu_systematic_rsp".toLowerCase();
                            let mfuTransactionRsp = "mfu_transaction_rsp".toLowerCase();
                            let schemeMasterFile = "scheme_master_inc".toLowerCase();
                            let schemeThresholdIncFile = "scheme_threshold_inc".toLowerCase();
                            let fileName = getFileName[0].toLowerCase() || "";
                            let isThresHold = null;
                            if (getSubject == masterSubject && fileName && fileName.search(schemeMasterFile) >= 0) {
                                isThresHold = schemeMasterFile;
                            }
                            if (getSubject == masterSubject && fileName && fileName.search(schemeThresholdIncFile) >= 0) {
                                isThresHold = schemeThresholdIncFile;
                            }
                            if (getSubject == transactionSubject && fileName && fileName.search(mfuTransactionRsp) >= 0) {
                                isThresHold = mfuTransactionRsp;
                            }
                            if (getSubject == transactionSubject && fileName && fileName.search(mfuSystematicRsp) >= 0) {
                                isThresHold = mfuSystematicRsp;
                            }
                            if (getFileExt == "zip") {
                                var outputPathZip = path.join(__dirname, `../../Public/uploads/${messageId}-${getSubject}-${fileName}-${Date.now()}.zip`);
                                const zipFileData = Buffer.from(attachmentData, 'base64');
                                fs.writeFileSync(outputPathZip, Buffer.from(zipFileData));
                                const directory = await unZipper.Open.file(outputPathZip);
                                const extract = await directory.files[0].buffer('40071D');          // 40071D is password for zip file.
                                const fileData = Buffer.from(extract, 'base64');
                                var outputPath = path.join(__dirname, `../../Public/uploads/${messageId}-${getSubject}-${fileName}-${Date.now()}.dat`);
                                fs.writeFileSync(outputPath, Buffer.from(fileData));
                                // for delete zip
                                fs.unlink(outputPathZip, (error) => {
                                    if (error) {
                                        console.error(`Error deleting file ${outputPathZip}:`, error);
                                    }
                                });
                            } else {
                                var outputPath = path.join(__dirname, `../../public/uploads/${messageId}-${getSubject}-${fileName}-${Date.now()}.dat`);
                                const fileData = Buffer.from(attachmentData, 'base64');
                                fs.writeFileSync(outputPath, Buffer.from(fileData));
                            }
                            await this.importEmailData(outputPath, getSubject, transaction, isThresHold);
                        }
                    }
                }
                await readMail.create({ 'messageId': messageId, 'subject': subject }, transaction);
                await transaction.commit();
                await gmailService.markAsRead(email, messageId);
            } else {
                await gmailService.markAsRead(email, messageId);
                console.log(messageId, "message already exist in DB.");
            }
            return true;
        } catch (error) {
            await transaction.rollback();
            await gmailService.markAsRead(email, messageId);
            await readMail.create({ 'messageId': messageId, 'subject': subject, mail_error: JSON.stringify(error) }, transaction);
            throw Error(error);
        } finally {
            await transaction.cleanup();
        }
    },
    async importEmailData(File, subject, transaction, isThresHold = null) {
        try {
            let transactionSubject = "Transaction Response Feed".toLowerCase();
            let canSubject = "CAN Registration Feed".toLowerCase();
            let CDSSubject = "Daily CDS Feed".toLowerCase();
            let masterSubject = "MF Utility-Incremental Scheme".toLowerCase();
            let mfuSystematicRsp = "mfu_systematic_rsp".toLowerCase();
            let mfuTransactionRsp = "mfu_transaction_rsp".toLowerCase();
            let schemeMasterIncFile = "scheme_master_inc".toLowerCase();
            let schemeThresholdIncFile = "scheme_threshold_inc".toLowerCase();
            const workbook = xlsx.readFile(File, { cellDates: true });
            const sheetNames = workbook.SheetNames;
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
            if (data) {
                console.log(subject);
                var bodyData = {};
                var dataArray = [];
                var i = 1;
                var subjectType = null;
                for await (const row of data) {
                    var bodyData = {};
                    if (subject === transactionSubject && isThresHold == mfuSystematicRsp) {
                        let valueDate = null;
                        if (row['Value Date']) {
                            valueDate = new Date(row['Value Date']).toISOString();
                        }
                        let userId = null;
                        if (row['CAN Number']) {
                            let userCanData = await userCanRegistration.findOne({
                                where: { can: row['CAN Number'] }
                            });
                            if (userCanData) {
                                let userData = await user.findOne({
                                    where: { panCard: userCanData.firstHolderPan }
                                });
                                if (userData) {
                                    userId = userData.id;
                                }
                            }
                        }
                        bodyData = {
                            userId: userId,
                            orderNumber: row['Order Number'],
                            orderSequenceNumber: row['Order Sequence Number'],
                            instalmentNumber: row['Instalment Number'],
                            transactionTypeCode: row['Transaction Type Code'],
                            utrn: row['UTRN'],
                            fundCode: row['Fund Code'],
                            rtaSchemeCode: row['RTA Scheme Code'],
                            folioNumber: row['Folio Number'],
                            paymentStatus: row['Payment Status'],
                            transactionStatus: row['Transaction Status'],
                            price: row['Price'],
                            responseAmount: row['Response Amount'],
                            responseUnits: row['Response Units'],
                            valueDate: valueDate,
                            rtaRemarks: row['RTA Remarks'],
                            AddlColumnOne: row['Addl. Column 1'],
                            AddlColumnTwo: row['Addl. Column 2'],
                            AddlColumnThree: row['Addl. Column 3']
                        }
                        subjectType = transactionSubject
                        dataArray.push(bodyData);
                    } else if (subject === transactionSubject && isThresHold == mfuTransactionRsp) {
                        let valueDate = null;
                        if (row['Value Date']) {
                            valueDate = new Date(row['Value Date']).toISOString();
                        }
                        let orderTimestamp = null;
                        if (row['Order Timestamp']) {
                            orderTimestamp = new Date(row['Order Timestamp']).toISOString();
                        }
                        let userId = null;
                        if (row['CAN Number']) {
                            let userCanData = await userCanRegistration.findOne({
                                where: { can: row['CAN Number'] }
                            });
                            if (userCanData) {
                                let userData = await user.findOne({
                                    where: { panCard: userCanData.firstHolderPan }
                                });
                                if (userData) {
                                    userId = userData.id;
                                }
                            }
                        }
                        let startDate = null;
                        let endDate = null;

                        if (row['start_date']) {
                            startDate = new Date(row['start_date']).toISOString();
                        }
                        if (row['start_date']) {
                            endDate = new Date(row['End Date']).toISOString();
                        }
                        bodyData = {
                            userId: userId,
                            orderNumber: row['Order Number'],
                            orderSequenceNumber: row['Order Sequence Number'],
                            transactionTypeCode: row['Transaction Type Code'],
                            utrn: row['UTRN'],
                            canNumber: row['CAN Number'],
                            FolioNumber: row['Folio Number'],
                            primaryHolderName: row['Primary Holder Name'],
                            orderMode: row['Order Mode'],
                            ApplicationNumber: row['Application Number'],
                            orderTimestamp: orderTimestamp,
                            fundCode: row['Fund Code'],
                            fundName: row['Fund Name'],
                            rtaSchemeCode: row['RTA Scheme Code'],
                            rtaSchemeName: row['RTA Scheme Name'],
                            reInvestmentTag: row['Re-Investment Tag'],
                            riaCode: row['RIA Code'],
                            arnCode: row['ARN Code'],
                            subBrokerCode: row['Sub-Broker Code'],
                            euinCode: row['EUIN Code'],
                            rmCode: row['RM Code'],
                            withdrawalOption: row['Withdrawal Option'],
                            amount: row['Amount'],
                            units: row['Units'],
                            paymentMode: row['Payment Mode'],
                            bankName: row['Bank Name'],
                            bankAccountNo: row['Bank Account No'],
                            paymentReferenceNo: row['Payment Reference No'],
                            paymentStatus: row['Payment Status'],
                            subseqPaymentBankName: row['Subseq. Payment Bank Name'],
                            subseqPaymentAccountNo: row['Subseq. Payment Account No'],
                            subseqPaymentReferenceNo: row['Subseq. Payment Reference No'],
                            frequency: row['Frequency'],
                            instalmentDay: row['Instalment Day'],
                            numberOfInstallments: row['Number of Installments'],
                            startDate: startDate,
                            endDate: endDate,
                            originalOrderNumber: row['Original Order Number'],
                            currentInstallmentNumber: row['Current Instalment Number'],
                            transactionStatus: row['Transaction Status'],
                            registrationStatus: row['Registration Status'],
                            price: row['Price'],
                            responseAmount: row['Response Amount'],
                            responseUnits: row['Response Units'],
                            valueDate: valueDate,
                            rtaRemarks: row['RTA Remarks'],
                            AddlColumnOne: row['Addl. Column 1'],
                            AddlColumnTwo: row['Addl. Column 2'],
                            AddlColumnThree: row['Addl. Column 3']
                        }
                        subjectType = transactionSubject
                        dataArray.push(bodyData);
                    } else if (subject === canSubject) {
                        let canRegDate = null;
                        if (row['CAN Reg Date']) {
                            canRegDate = new Date(row['CAN Reg Date']).toISOString();
                        }
                        bodyData = {
                            arnCode: row['ARN/RIA Code'],
                            EUIN: row['EUIN'],
                            can: row['CAN'],
                            canRegDate: canRegDate,
                            canRegMode: row['CAN Reg Mode'],
                            canStatus: row['CAN Status'],
                            firstHolderPan: row['First Holder PAN'],
                            firstHolderName: row['First Holder Name'],
                            firstHolderKraStatus: row['First Holder KRA Status'],
                            eventRemark: row['Event Remarks'],
                            docProof: row['DOC PROOF'],
                            secondHolderPan: row['Second Holder PAN'],
                            secondHolderKraStatus: row['Second Holder KRA status'],
                            thirdHolderPan: row['Third holder PAN'],
                            thirdHolderKraStatus: row['Third Holder KRA status'],
                            guardianPan: row['Guardian PAN'],
                            guardianKraStatus: row['Guardian KRA status'],
                            remarks: row['Remarks'],
                            rejectReason: row['RejectReason'],
                        }
                        subjectType = subject
                        dataArray.push(bodyData);
                    } else if (subject === masterSubject && isThresHold == schemeMasterIncFile) {
                        let allotDate = null;
                        let reopenDate = null;
                        let maturityDate = null;
                        let nfoStart = null;
                        let nfoEnd = null;
                        if (row['allot_date']) {
                            allotDate = new Date(row['allot_date']).toISOString();
                        }
                        if (row['reopen_date']) {
                            reopenDate = new Date(row['reopen_date']).toISOString();
                        }
                        if (row['maturity_date']) {
                            maturityDate = new Date(row['maturity_date']).toISOString();
                        }
                        if (row['nfo_start']) {
                            nfoStart = new Date(row['nfo_start']).toISOString();
                        }
                        if (row['nfo_end']) {
                            nfoEnd = new Date(row['nfo_end']).toISOString();
                        }
                        bodyData = {
                            schemeCode: row['scheme_code'],
                            fundCode: row['fund_code'],
                            planName: row['plan_name'],
                            schemeType: row['scheme_type'],
                            planType: row['plan_type'],
                            planOpt: row['plan_opt'],
                            divOpt: row['div_opt'],
                            amfiId: row['amfi_id'],
                            priIsin: row['pri_isin'],
                            secIsin: row['sec_isin'],
                            nfoStart: nfoStart,
                            nfoEnd: nfoEnd,
                            allotDate: allotDate,
                            reopenDate: reopenDate,
                            maturityDate: maturityDate,
                            entryLoad: row['entry_load'],
                            exitLoad: row['exit_load'],
                            purAllowed: row['pur_allowed'],
                            nfoAllowed: row['nfo_allowed'],
                            redeemAllowed: row['redeem_allowed'],
                            sipAllowed: row['sip_allowed'],
                            switchOutAllowed: row['switch_out_allowed'],
                            switchInAllowed: row['Switch_In_Allowed'],
                            stpOutAllowed: row['stp_out_allowed'],
                            stpInAllowed: row['stp_in_allowed'],
                            swpAllowed: row['swp_allowed'],
                            dematAllowed: row['Demat_Allowed'],
                            catgID: row['Catg ID'],
                            subCatgID: row['Sub-Catg ID'],
                            schemeFlag: row['Scheme Flag']
                        }
                        subjectType = subject
                        dataArray.push(bodyData);
                    } else if (subject === masterSubject && isThresHold == schemeThresholdIncFile) {
                        let startDate = null;
                        let endDate = null;
                        if (row['start_date']) {
                            startDate = new Date(row['start_date']).toISOString();
                        }
                        if (row['end_date']) {
                            endDate = new Date(row['end_date']).toISOString();
                        }
                        let thresholdInc = await schemeMasterInc.findOne({
                            where: { schemeCode: row['scheme_code'].toString(), fundCode: row['fund_code'].toString() }
                        });
                        let schemeMasterIncId = null;
                        if (thresholdInc) {
                            schemeMasterIncId = thresholdInc.id;
                        }
                        bodyData = {
                            schemeMasterIncId: schemeMasterIncId,
                            fundCode: row['fund_code'],
                            schemeCode: row['scheme_code'],
                            txnType: row['txn_type'],
                            sysFreq: row['sys_freq'],
                            sysFreqOpt: row['sys_freq_opt'],
                            sysDates: row['sys_dates'],
                            minAmt: row['min_amt'],
                            maxAmt: row['max_amt'],
                            multipleAmt: row['multiple_amt'],
                            minUnits: row['min_units'],
                            multipleUnits: row['multiple_units'],
                            minInst: row['min_inst'],
                            maxInst: row['max_inst'],
                            sysPerpetual: row['sys_perpetual'],
                            minCumAmt: row['min_cum_amt'],
                            startDate: startDate,
                            endDate: endDate,
                        }
                        subjectType = subject
                        dataArray.push(bodyData);
                    } else if (subject === CDSSubject) {
                        let navDate = null;
                        if (row['NAV Date']) {
                            navDate = new Date(row['NAV Date']).toISOString();
                        }
                        bodyData = {
                            can: row['CAN'],
                            canName: row['CAN Name'],
                            fundCode: row['Fund Code'],
                            fundName: row['Fund Name'],
                            schemeCode: row['Scheme Code'],
                            schemeName: row['Scheme Name'],
                            folioNumber: row['Folio Number'],
                            folioCheckDigit: row['Folio Check Digit'],
                            unitHolding: row['Unit Holding'],
                            currentValue: row['Current Value'],
                            nav: row['NAV'],
                            navDate: navDate
                        }
                        subjectType = subject
                        dataArray.push(bodyData);
                    }
                }
                i++;
            }
            if (subjectType === transactionSubject && isThresHold == mfuSystematicRsp) {
                await txnResponseSystematicRsp.bulkCreate(dataArray, { transaction: transaction });
            } else if (subjectType === transactionSubject && isThresHold == mfuTransactionRsp) {
                await txnResponseTransactionRsp.bulkCreate(dataArray, { transaction: transaction });
            } else if (subjectType === canSubject) {
                await userCanRegistration.bulkCreate(dataArray, { transaction: transaction });
            } else if (subjectType === masterSubject && isThresHold == schemeMasterIncFile) {
                await schemeMasterInc.bulkCreate(dataArray, { transaction: transaction });
            } else if (subjectType === masterSubject && isThresHold == schemeThresholdIncFile) {
                await schemeThresholdInc.bulkCreate(dataArray, { transaction: transaction });
            } else if (subjectType === CDSSubject) {
                await cdsHold.bulkCreate(dataArray, { transaction: transaction });
            }
            fs.unlink(File, (error) => {
                if (error) {
                    console.error(`Error deleting file ${File}:`, error);
                }
            });
            return true;
        } catch (error) {
            throw Error(error);
        }
    },
    getSubject(subject) {
        let returnData = null;
        let transactionSubject = "Transaction Response Feed".toLowerCase();
        let canSubject = "CAN Registration Feed".toLowerCase();
        let CDSSubject = "Daily CDS Feed".toLowerCase();
        let masterSubject = "MF Utility-Incremental Scheme".toLowerCase();
        let thresHoldSubject = "threshold".toLowerCase();
        if (subject.search(transactionSubject) >= 0) {
            returnData = transactionSubject;
        }
        if (subject.search(canSubject) >= 0) {
            returnData = canSubject;
        }
        if (subject.search(CDSSubject) >= 0) {
            returnData = CDSSubject;
        }
        if (subject.search(masterSubject) >= 0) {
            returnData = masterSubject;
        }
        if (subject.search(thresHoldSubject) >= 0) {
            returnData = thresHoldSubject;
        }
        return returnData;
    }
} 