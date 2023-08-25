
import models from "../models";
import config from "../config";
import xlsx from 'xlsx';
const { userLead } = models


export default {
  /**
 * Read CSV
 */
  async uploadCsv(req) {
    try {
      const { body: { path } } = req;
      const workbook = xlsx.readFile(path, { cellDates: true });
      const sheetNames = workbook.SheetNames;
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
      const result = data.map(async(index)=>{
      var formd = '';
      if(index['Value Date']) {
          let currentDate = new Date(index['Value Date']);
          formd = currentDate.toDateString();   
      }     
      var orderTime = '';
      if(index['Order Timestamp']) {
        let orderTimeDate = new Date(index['Order Timestamp']);
          orderTime = orderTimeDate.toDateString(); 
      }

        let bodyData = {
          orderNumber : index['Order Number'],
          orderSequenceNumber : index['Order Sequence Number'],
          transactionTypeCode : index['Transaction Type Code'],
          utrn : index['UTRN'],
          canNumber : index['CAN Number'],
          primaryHolderName : index['Primary Holder Name'],
          orderMode : index['Order Mode'],          
          orderTimestamp : orderTime,
          fundCode : index['Fund Code'],
          fundName : index['Fund Name'],
          rtaSchemeCode : index['RTA Scheme Code'],
          rtaSchemeName : index['RTA Scheme Name'],
          reInvestmentTag : index['Re-Investment Tag'],
          arnCode : index['ARN Code'],
          withdrawalOption : index['Withdrawal Option'],
          amount : index['Amount'],
          units : index['Units'],
          frequency : index['Frequency'],
          instalmentDay : index['Instalment Day'],
          numberOfInstallments : index['Number of Installments'],
          startDate : index['Start Date'],
          endDate : index['End Date'],
          originalOrderNumber : index['Original Order Number'],
          transactionStatus : index['Transaction Status'],
          price : index['Price'],
          responseAmount : index['Response Amount'],
          responseUnits : index['Response Units'],         
          valueDate : formd,
          addColumn : index['Addl. Column 1'] 
        }
         await userLead.create(bodyData);
      });
      await  Promise.all(result)
      return true;
    } catch (error) {
      console.log(error);
      throw Error(error);
    }
  },


}