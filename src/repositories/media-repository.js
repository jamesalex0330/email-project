import models from "../models";
const { userLead, userCanRegistration, user, masterInc, thresholdInc, cdsHold} = models;
import multer from "multer";
import xlsx from 'xlsx';
import path from 'path';

/**
 * MULTER SETUP FOR IMAG3E UPLOAD
 */
const storages = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public`)

  },
  filename: (req, file, cb) => {
    const dateTimeStamp = Date.now();
    const fileName = file.originalname.replace(/[^A-Z0-9.]/gi, "-");
    const fileArray = fileName.split(".");
    const ext = fileArray.pop();
    const data = `${fileArray.join("-")}-${dateTimeStamp}.${ext}`
    cb(null, data);
  }
});

export default {
  async create({
    params, file, headers, req,
  }) {
    try {
      let result = '';
      const mediaType = params.mediaType;

      const imageDir = path.join(__dirname, `../../${file.path}`);
      // const ext = path.extname(file.originalname).split('.').pop();
      const HTTPs = 'https';
      // if (config.app.mediaStorage === 's3' && params.mediaType === 'image') {
      //   const originalFileObj = file.transforms.findIndex((data) => data.id === 'original');
      //   if (originalFileObj >= 0) {
      //     // eslint-disable-next-line no-param-reassign
      //     file.key = file.transforms[originalFileObj].key;
      //   }
      // }

      //Praven
      // const mediaData = {
      //   name: file.filename || file.originalname,
      //   basePath: file.path || file.key,
      //   imagePath: imageDir,
      //   baseUrl: `${HTTPs}://${headers.host}/${file.path}`,
      //   mediaType,
      //   mediaFor: params.mediaFor,
      //   isThumbImage: false,
      //   status: 'pending',
      // };
      const basePath = file.path || file.key;
      const workbook = xlsx.readFile(basePath, { cellDates: true });
      const sheetNames = workbook.SheetNames;
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
      if (params.mediaFor == "transaction") {
        const insertResult = data.map(async (index) => {
          var formd = '';
          if (index['Value Date']) {
            let currentDate = new Date(index['Value Date']);
            formd = currentDate.toDateString();
          }
          var orderTime = '';
          if (index['Order Timestamp']) {
            let orderTimeDate = new Date(index['Order Timestamp']);
            orderTime = orderTimeDate.toDateString();
          }
          let userId = null;
          let userCanData = await userCanRegistration.findOne({
            where: { CAN: index['CAN Number'] }
          });

          if(userCanData){
            let userData = await user.findOne({
              where: { panCard: userCanData.firstHolderPan }
            });

            if(userData){
              userId = userData.id;
            }
          }
          
          let bodyData = {
            userId: userId,
            orderNumber: index['Order Number'],
            orderSequenceNumber: index['Order Sequence Number'],
            transactionTypeCode: index['Transaction Type Code'],
            utrn: index['UTRN'],
            canNumber: index['CAN Number'],
            primaryHolderName: index['Primary Holder Name'],
            orderMode: index['Order Mode'],
            orderTimestamp: orderTime,
            fundCode: index['Fund Code'],
            fundName: index['Fund Name'],
            rtaSchemeCode: index['RTA Scheme Code'],
            rtaSchemeName: index['RTA Scheme Name'],
            reInvestmentTag: index['Re-Investment Tag'],
            arnCode: index['ARN Code'],
            withdrawalOption: index['Withdrawal Option'],
            amount: index['Amount'],
            units: index['Units'],
            frequency: index['Frequency'],
            instalmentDay: index['Instalment Day'],
            numberOfInstallments: index['Number of Installments'],
            startDate: index['Start Date'],
            endDate: index['End Date'],
            originalOrderNumber: index['Original Order Number'],
            transactionStatus: index['Transaction Status'],
            price: index['Price'],
            responseAmount: index['Response Amount'],
            responseUnits: index['Response Units'],
            valueDate: formd,
            addColumn: index['Addl. Column 1']
          }
          await userLead.create(bodyData);
        });
        await Promise.all(insertResult);
      } else if (params.mediaFor == "can") {
        const insertResult = data.map(async (index) => {
          var formd = '';
          if (index['CAN Reg Date']) {
            let currentDate = new Date(index['CAN Reg Date']);
            formd = currentDate.toDateString();
          }

          let bodyData = {
            arnCode: index['ARN/RIA Code'],
            EUIN: index['EUIN'],
            CAN: index['CAN'],
            CANRegDate: formd,
            CANRegMode: index['CAN Reg Mode'],
            canStatus: index['CAN Status'],
            firstHolderPan: index['First Holder PAN'],
            firstHolderName: index['First Holder Name'],
            firstHolderKraStatus: index['First Holder KRA Status'],
            eventRemark: index['Event Remarks'],
            docProof: index['DOC PROOF']
          }
          await userCanRegistration.create(bodyData);
        });
        await Promise.all(insertResult);
      }  else if (params.mediaFor == "master") {
        
        const insertResult = data.map(async (index) => {
          var allotDate = '';
          var reopenDate = '';
          var maturityDate= '';
          var nfoStart = '';
          var nfoEnd = '';
          if (index['allot_date']) {
            allotDate = new Date(index['allot_date']);
            allotDate = allotDate.toDateString();
          }
          
          if (index['reopen_date']) {
            reopenDate = new Date(index['reopen_date']);
            reopenDate = reopenDate.toDateString();
          }

          if (index['maturityDate']) {
            maturityDate = new Date(index['maturityDate']);
            maturityDate = reopenDate.toDateString();
          }

          if (index['nfo_start']) {
            nfoStart = new Date(index['nfo_start']);
            nfoStart = nfoStart.toDateString();
          }

          if (index['nfo_end']) {
            nfoEnd = new Date(index['nfo_end']);
            nfoEnd = nfoEnd.toDateString();
          }
          
          let bodyData = {
            schemeCode: index['scheme_code'],
            fundCode: index['fund_code'],
            planName: index['plan_name'],
            schemeType:  index['scheme_type'],
            planType: index['plan_type'],
            planOpt: index['plan_opt'],
            divOpt: index['div_opt'],
            amfiId: index['amfi_id'],
            priIsin: index['pri_isin'],
            secIsin: index['sec_isin'],
            nfoStart: nfoStart,
            nfoEnd: nfoEnd,
            allotDate: allotDate,
            reopenDate: reopenDate,
            maturityDate: maturityDate,
            entryLoad: index['entry_load'],
            exitLoad: index['exit_load'],
            purAllowed: index['pur_allowed'],
            nfoAllowed: index['nfo_allowed'],
            redeemAllowed: index['redeem_allowed'],
            sipAllowed: index['sip_allowed'],
            switchOutAllowed: index['switch_out_allowed'],
            switchInAllowed: index['Switch_In_Allowed'],
            stpOutAllowed: index['stp_out_allowed'],
            stpInAllowed: index['stp_in_allowed'],
            swpAllowed: index['swp_allowed'],
            dematAllowed: index['Demat_Allowed'],
            catgID: index['Catg ID'],
            subCatgID: index['Sub-Catg ID'],
            schemeFlag: index['Scheme Flag']          

          }
          await masterInc.create(bodyData);
        });

      } else if (params.mediaFor == "thersold") {
        const insertResult = data.map(async (index) => {
          var startDate = '';
          var endDate = '';

          if (index['start_date']) {
            startDate = new Date(index['start_date']);
            startDate = startDate.toDateString();
          }

          if (index['end_date']) {
            endDate = new Date(index['end_date']);
            endDate = endDate.toDateString();
          }
          
          
          let thersold = await thresholdInc.findOne({
            where: { schemeCode: index['scheme_code'], fundCode: index['fund_code']}
          });
          var masterIncId = null;
          if(thersold) {
            masterIncId = thersold.id;
          }

          let bodyData = {
            masterIncId:masterIncId,
            schemeCode: index['scheme_code'],
            fundCode: index['fund_code'],
            txnType: index['txn_type'],
            sysFreq:  index['sys_freq'],
            sysFreqOpt: index['sys_freq_opt'],
            sysDates: index['sys_dates'],
            minAmt: index['min_amt'],
            maxAmt: index['max_amt'],
            multipleAmt: index['multiple_amt'],
            minUnits: index['min_units'],
            multipleUnits: index['multiple_units'],
            minInst: index['min_inst'],            
            maxInst: index['max_inst'],
            sysPerpetual: index['sys_perpetual'],
            minCumAmt: index['min_cum_amt'],
            startDate: startDate,
            endDate: endDate,                   

          }
          await thresholdInc.create(bodyData);
        });
      } else if(params.mediaFor == "cds-hold") {
        const insertResult = data.map(async (index) => {
          var navDate = '';
        
          if (index['NAV Date']) {
            navDate = new Date(index['NAV Date']);
            navDate = navDate.toDateString();
          }
          
          
          let bodyData = {            
            can: index['CAN'],
            canName: index['CAN Name'],
            fundCode:  index['Fund Code'],
            fundName: index['Fund Name'],
            schemeCode: index['Scheme Code'],
            schemeName: index['Scheme Name'],
            folioNumber: index['Folio Number'],
            folioCheckDigit: index['Folio Check Digit'],
            unitHolding: index['Unit Holding'],
            currentValue: index['Current Value'],
            nav: index['NAV'],           
            navDate: navDate
          }
          await cdsHold.create(bodyData);
        });
      }

      return true;
    } catch (error) {
      // loggers.error(`Media file create error: ${error}, user id: ${req?.user?.id} `);
      throw Error(error);
    }
  },
}
