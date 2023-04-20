import models from "../models";
const { MediaTemp,UserLead } = models;
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

        let bodyData = {
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
          numberofInstallments: index['Number of Installments'],
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
        await UserLead.create(bodyData);
      });
      await Promise.all(insertResult)
      return true;
    } catch (error) {
      // loggers.error(`Media file create error: ${error}, user id: ${req?.user?.id} `);
      throw Error(error);
    }
  },
}
