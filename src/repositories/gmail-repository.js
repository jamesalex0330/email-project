import { Op } from "sequelize";
import xlsx from 'xlsx';
import models from "../models";
import gmailService from "../services/gmail";
import path from "path";
const fs = require('fs');
const { Sequelize } = models.sequelize;
const { UserLead, UserCan, User, MasterInc, ThresoldInc, CdsHold } = models;
export default {
    async getUnreadEmails() {
        let email = 'mf.manishshah@gmail.com';
        let messageList = await gmailService.messageList(email);
        if (messageList.messages) {
            let messages = messageList.messages;

            let transactionSubject = "Transaction Response Feed".toLowerCase();
            let canSubject = "CAN Registration Feed".toLowerCase();
            let CSDSubject = "Daily CDS Feed".toLowerCase();
            let masterSubject = "MF Utility-Incremental Scheme".toLowerCase();
            for await (const message of messages) {
                let messageId = message.id;
                let messageDetails = await gmailService.readMail(email, messageId);
                if (messageDetails) {
                    let headerArray = messageDetails.payload.headers;
                    let arrayData = headerArray.find(item => item.name.toLowerCase() === "subject");
                    let subject = arrayData['value'].toLowerCase();
                    if (subject.search(transactionSubject) >= 0 || subject.search(canSubject) >= 0 || subject.search(CSDSubject) >= 0 || subject.search(masterSubject) >= 0) {
                        console.log(subject);
                        if (messageDetails.payload.parts[1] && messageDetails.payload.parts[1].body.attachmentId) {
                            let attachmentId = messageDetails.payload.parts[1].body.attachmentId;
                            let result = await gmailService.getAttachment(email, messageId, attachmentId);
                            const data = result.data;
                            var outputPath = path.join(__dirname, `../../public/uploads/subject-${Date.now()}.xlsx`);
                            const fileData = Buffer.from(data, 'base64');
                            fs.writeFileSync(outputPath, Buffer.from(fileData));
                            await this.importMails(outputPath, subject);
                        }
                        // await gmailService.markAsRead(email, messageId)
                    }

                }
            }
            return messageList;
        }
    },
    async importMails(File, subject) {
        try {

            let transactionSubject = "Transaction Response Feed".toLowerCase();
            let canSubject = "CAN Registration Feed".toLowerCase();
            let CSDSubject = "Daily CDS Feed".toLowerCase();
            let masterSubject = "MF Utility-Incremental Scheme".toLowerCase();
            const workbook = xlsx.readFile(File, { cellDates: true });
            const sheetNames = workbook.SheetNames;
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
            for await (const row of data) {
                if (subject.search(transactionSubject) > 0) {
                    const insertResult = data.map(async (index) => {
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
                        let userCanData = await UserCan.findOne({
                            where: { CAN: row['CAN Number'] }
                        });

                        if (userCanData) {
                            let userData = await User.findOne({
                                where: { panCard: userCanData.firstHolderPan }
                            });

                            if (userData) {
                                userId = userData.id;
                            }
                        }

                        let bodyData = {
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
                        console.log(bodyData);
                        await UserLead.create(bodyData);
                    });
                    await Promise.all(insertResult);
                } else if (subject.search(canSubject)) {
                    const insertResult = data.map(async (index) => {
                        var formd = '';
                        if (row['CAN Reg Date']) {
                            let currentDate = new Date(row['CAN Reg Date']);
                            formd = currentDate.toDateString();
                        }

                        let bodyData = {
                            arnCode: row['ARN/RIA Code'],
                            EUIN: row['EUIN'],
                            CAN: row['CAN'],
                            CANRegDate: formd,
                            CANRegMode: row['CAN Reg Mode'],
                            canStatus: row['CAN Status'],
                            firstHolderPan: row['First Holder PAN'],
                            firstHolderName: row['First Holder Name'],
                            firstHolderKraStatus: row['First Holder KRA Status'],
                            eventRemark: row['Event Remarks'],
                            docProof: row['DOC PROOF']
                        }
                        await UserCan.create(bodyData);
                    });
                    await Promise.all(insertResult);
                } else if (subject.search(masterSubject)) {

                    const insertResult = data.map(async (index) => {
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

                        let bodyData = {
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
                        await MasterInc.create(bodyData);
                    });

                } else if (subject.search(canSubject)) {
                    const insertResult = data.map(async (index) => {
                        var navDate = '';

                        if (row['NAV Date']) {
                            navDate = new Date(row['NAV Date']);
                            navDate = navDate.toDateString();
                        }


                        let bodyData = {
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
                        await CdsHold.create(bodyData);
                    });
                }
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
    }
} 