import { Op } from "sequelize";
import xlsx from 'xlsx';
import models from "../models";
import gmailService from "../services/gmail";
import path from "path";
const unZipper = require("unzipper");
const fs = require('fs');
const { Sequelize } = models.sequelize;
const { userLead, userCan, user, masterInc, thresholdInc, cdsHold, readMail } = models;
export default {
    async getUnreadEmails() {
        try {
            let email = process.env.EMAIL;
            let messageList = await gmailService.messageList(email);
            if (messageList.messages) {
                let messages = messageList.messages;
                for await (const message of messages) {
                    let messageId = message.id;
                    let messageDetails = await gmailService.readMail(email, messageId);
                    if (messageDetails) {
                        let headerArray = messageDetails.payload.headers;
                        let arrayData = headerArray.find(item => item.name.toLowerCase() === "subject");
                        let subject = arrayData['value'].toLowerCase();
                        var getSubject = this.getSubject(subject);
                        console.log(messageId, "messageId");
                        console.log(getSubject, "getSubject");
                        if (getSubject && messageDetails.payload.parts) {
                            await this.getAttachmentData(messageDetails.payload.parts, email, messageId, getSubject, subject)
                        } else {
                            await gmailService.markAsRead(email, messageId);
                        }
                    }
                }
                return messageList;
            }
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
                    if (mailPart.body.attachmentId) {
                        let attachmentId = mailPart.body.attachmentId;
                        let result = await gmailService.getAttachment(email, messageId, attachmentId);
                        var attachmentData = result.data;
                        if (attachmentData) {
                            let getFileName = (mailPart.filename).split('.');
                            let getFileExt = getFileName.slice(-1);
                            if (getFileExt == "zip") {
                                var outputPathZip = path.join(__dirname, `../../Public/uploads/${Date.now()}-${getSubject}.zip`);
                                const zipFileData = Buffer.from(attachmentData, 'base64');
                                fs.writeFileSync(outputPathZip, Buffer.from(zipFileData));
                                const directory = await unZipper.Open.file(outputPathZip);
                                const extract = await directory.files[0].buffer('40071D');          // 40071D is password for zip file.
                                const fileData = Buffer.from(extract, 'base64');
                                var outputPath = path.join(__dirname, `../../Public/uploads/${Date.now()}-${getSubject}.dat`);
                                fs.writeFileSync(outputPath, Buffer.from(fileData));
                                // for delete zip
                                fs.unlink(outputPathZip, (error) => {
                                    if (error) {
                                        console.error(`Error deleting file ${outputPathZip}:`, error);
                                    }
                                });
                            } else {
                                var outputPath = path.join(__dirname, `../../public/uploads/${Date.now()}-${getSubject}.dat`);
                                const fileData = Buffer.from(attachmentData, 'base64');
                                fs.writeFileSync(outputPath, Buffer.from(fileData));
                            }
                            await this.importEmailData(outputPath, getSubject, transaction);
                        }
                    }
                }
                await readMail.create({ 'messageId': messageId, 'subject': subject }, transaction);
                await transaction.commit();
                await gmailService.markAsRead(email, messageId);
                return true;
            }
        } catch (error) {
            await transaction.rollback();
            throw Error(error);
        }
    },
    async importEmailData(File, subject, transaction) {
        try {
            let transactionSubject = "Transaction Response Feed".toLowerCase();
            let canSubject = "CAN Registration Feed".toLowerCase();
            let CDSSubject = "Daily CDS Feed".toLowerCase();
            let masterSubject = "MF Utility-Incremental Scheme".toLowerCase();
            let thersoldSubject = "thersold".toLowerCase();
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
                    if (subject === transactionSubject) {
                        var formd = '';
                        if (row['Value Date']) {
                            let currentDate = new Date(row['Value Date']);
                            formd = currentDate.toDateString();
                        }
                        var orderTime = '';
                        if (row['Order Timestamp']) {
                            let orderTimeDate = new Date(row['Order Timestamp']);
                            orderTime = orderTimeDate.toDateString();
                        }
                        let userId = null;
                        if (row['CAN Number']) {
                            let userCanData = await userCan.findOne({
                                where: { can: row['CAN Number'] }
                            });

                            if (userCanData) {
                                let userData = await User.findOne({
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
                            transactionTypeCode: row['Transaction Type Code'],
                            utrn: row['UTRN'],
                            canNumber: row['CAN Number'],
                            primaryHolderName: row['Primary Holder Name'],
                            orderMode: row['Order Mode'],
                            orderTimestamp: orderTime,
                            fundCode: row['Fund Code'],
                            fundName: row['Fund Name'],
                            rtaSchemeCode: row['RTA Scheme Code'],
                            rtaSchemeName: row['RTA Scheme Name'],
                            reInvestmentTag: row['Re-Investment Tag'],
                            arnCode: row['ARN Code'],
                            withdrawalOption: row['Withdrawal Option'],
                            amount: row['Amount'],
                            units: row['Units'],
                            frequency: row['Frequency'],
                            instalmentDay: row['Instalment Day'],
                            numberofInstallments: row['Number of Installments'],
                            startDate: row['Start Date'],
                            endDate: row['End Date'],
                            originalOrderNumber: row['Original Order Number'],
                            transactionStatus: row['Transaction Status'],
                            price: row['Price'],
                            responseAmount: row['Response Amount'],
                            responseUnits: row['Response Units'],
                            valueDate: formd,
                            addColumn: row['Addl. Column 1']
                        }
                        subjectType = transactionSubject
                        dataArray.push(bodyData);
                        // await UserLead.create(bodyData, { transaction: transaction });
                    } else if (subject === canSubject) {
                        var formd = '';
                        if (row['CAN Reg Date']) {
                            let currentDate = new Date(row['CAN Reg Date']);
                            formd = currentDate.toDateString();
                        }

                        bodyData = {
                            arnCode: row['ARN/RIA Code'],
                            EUIN: row['EUIN'],
                            can: row['CAN'],
                            canRegDate: formd,
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
                        // await UserCan.create(bodyData, { transaction: transaction });
                    } else if (subject === masterSubject) {

                        var allotDate = '';
                        var reopenDate = '';
                        var maturityDate = '';
                        var nfoStart = '';
                        var nfoEnd = '';
                        if (row['allot_date']) {
                            allotDate = new Date(row['allot_date']);
                            allotDate = allotDate.toDateString();
                        }

                        if (row['reopen_date']) {
                            reopenDate = new Date(row['reopen_date']);
                            reopenDate = reopenDate.toDateString();
                        }

                        if (row['maturityDate']) {
                            maturityDate = new Date(row['maturityDate']);
                            maturityDate = reopenDate.toDateString();
                        }

                        if (row['nfo_start']) {
                            nfoStart = new Date(row['nfo_start']);
                            nfoStart = nfoStart.toDateString();
                        }

                        if (row['nfo_end']) {
                            nfoEnd = new Date(row['nfo_end']);
                            nfoEnd = nfoEnd.toDateString();
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
                        // await MasterInc.create(bodyData, { transaction: transaction });

                    } else if (subject === thersoldSubject) {
                        var startDate = '';
                        var endDate = '';

                        if (row['start_date']) {
                            startDate = new Date(row['start_date']);
                            startDate = startDate.toDateString();
                        }

                        if (row['end_date']) {
                            endDate = new Date(row['end_date']);
                            endDate = endDate.toDateString();
                        }


                        let thersold = await thresholdInc.findOne({
                            where: { schemeCode: row['scheme_code'], fundCode: row['fund_code'] }
                        });
                        var masterIncId = null;
                        if (thersold) {
                            masterIncId = thersold.id;
                        }

                        bodyData = {
                            masterIncId: masterIncId,
                            schemeCode: row['scheme_code'],
                            fundCode: row['fund_code'],
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
                        // await thresholdInc.create(bodyData, { transaction: transaction });
                    } else if (subject === CDSSubject) {
                        var navDate = '';
                        if (row['NAV Date']) {
                            navDate = new Date(row['NAV Date']);
                            navDate = navDate.toDateString();
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
                        // await CdsHold.create(bodyData, { transaction: transaction });
                    }
                }
                i++;
            }
            if (subjectType === transactionSubject) {
                await userLead.bulkCreate(dataArray, { transaction: transaction });
            } else if (subjectType === canSubject) {
                await userCan.bulkCreate(dataArray, { transaction: transaction });
            } else if (subjectType === masterSubject) {
                await masterInc.bulkCreate(dataArray, { transaction: transaction });
            } else if (subjectType === thersoldSubject) {
                await thresholdInc.bulkCreate(dataArray, { transaction: transaction });
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
        let thersoldSubject = "thersold".toLowerCase();
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
        if (subject.search(thersoldSubject) >= 0) {
            returnData = thersoldSubject;
        }
        return returnData;
    }
} 