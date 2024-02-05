import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import models from "../models";
import config from "../config";
import jwt from "../services/jwt";
import httpStatus from "http-status";
import helpers from "../helpers/sqlQuery";
import commonHelper from "../helpers/commonHelper";
const { Sequelize } = models.sequelize;
const { user, userCanRegistration, cdsHold, txnResponseTransactionRsp, txnResponseSystematicRsp } = models
import moment from "moment-timezone";
import utility from "../services/utility";
export default {

  async dashboard(req, t) {
    try {
      let userId = req.user.id;

      let userData = await user.findOne({
        where: { id: userId }
      });
      if (userData) {
        let fundData = await txnResponseTransactionRsp.findAll(
          {
            attributes: {
              exclude: ['updatedAt']
            },
            where: {
              'userId': userData.id,
              valueDate: { [Op.gte]: moment().subtract(1, 'days').startOf('day'), [Op.lte]: moment().subtract(1, 'days').endOf('day') }
            },
          },
        );
        return await this.dashboardMainArray(fundData);

      }
    } catch (error) {
      throw Error(error);
    }
  },

  /**
 * Find user detail
 * @param {Object} whereObj
 */
  async findOne(whereObj) {
    try {
      return await user.findOne({
        where: whereObj,
        attributes: {
          exclude: ["password", "verifyToken"],
        },
      });
    } catch (error) {
      throw Error(error);
    }
  },

  async dashboardMainArray(data) {
    let returnData = {
      "invested": 0.00,
      "current": 0.00,
      "absReturns": 0.00,
      "totalReturns": 0.00,
      "todaysReturn": 0.00,
      "xirr": 0.00,
      "fundData": [],
    };
    if (data) {
      for await (const row of data) {
        let navValue = 0.00;
        if (row?.rtaSchemeCode) {
          let schemeData = await commonHelper.getSchemeData(row?.rtaSchemeCode);
          if (schemeData.length > 0) {
            navValue = schemeData[0]?.nav ?? navValue;
          }
        }

        let cdsDataWhere = {};
        cdsDataWhere.canNumber = row.canNumber;
        cdsDataWhere.FolioNumber = row?.FolioNumber;
        let todayDayCurrentAmount = await this.getTodayReturn(cdsDataWhere, "today");
        let yesterdayDayCurrentAmount = await this.getTodayReturn(cdsDataWhere, "yesterday");
        let txnResponseData = {
          "canNumber": row.canNumber,
          "folio_number": null,
          "utrn": "'0'",
          "payment_status": ["'CR'", "'IR'", "'DG'", "'DA'", "'PC'", "'PD'"],
          "transaction_status": ["'OA'", "'RA'", "'RP'"],
          "transaction_type_code": ["'A'", "'B'", "'N'", "'V'"],
        }
        let subQuery = helpers.dashboardQuery(txnResponseData);
        let leadData = await models.sequelize.query(subQuery, {
          type: models.sequelize.QueryTypes.SELECT,
        });
        let invested = 0.00;
        let current = row?.responseAmount ?? 0.00;
        if (leadData[0]) {
          invested = commonHelper.roundNumber((parseFloat(leadData[0]?.sum_amount) * parseFloat(navValue)));
        }
        let arrayData = {
          "id": row?.id,
          "folioNumber": row?.folioNumber,
          "fundName": row?.fundName,
          "schemeName": row?.rtaSchemeName,
          "invested": invested,
          "current": commonHelper.roundNumber(current),
          "absReturns": (current > 0 && invested > 0) ? commonHelper.roundNumber((parseFloat(current) - parseFloat(invested) / parseFloat(invested))) : 0.00,
          "totalReturns": commonHelper.roundNumber((parseFloat(current) - parseFloat(invested))),
          "todaysReturn": (todayDayCurrentAmount > 0 && yesterdayDayCurrentAmount > 0) ? commonHelper.roundNumber((parseFloat(todayDayCurrentAmount) - parseFloat(yesterdayDayCurrentAmount)) / parseFloat(yesterdayDayCurrentAmount) * 100) : 0.00,
          "units": leadData?.units ?? 0.00,
          "sinceDate": utility.changeDateFormat(row?.startDate) ?? "",
          "currentNAV": commonHelper.roundNumber(navValue),
          "createdAt": utility.changeDateFormat(row.createdAt, "YYYY-MM-DD HH:mm:ss"),
          "canNumber": row.canNumber,
        };
        returnData['invested'] = commonHelper.roundNumber(parseFloat(returnData['invested']) + parseFloat(invested));
        returnData['current'] = commonHelper.roundNumber((parseFloat(returnData['current']) + parseFloat(current)));
        returnData['absReturns'] = commonHelper.roundNumber(parseFloat(returnData['absReturns']) + parseFloat(arrayData.absReturns));
        returnData['totalReturns'] = commonHelper.roundNumber(parseFloat(returnData['totalReturns']) + parseFloat(arrayData.totalReturns));
        returnData['todaysReturn'] = commonHelper.roundNumber(parseFloat(returnData['todaysReturn']) + parseFloat(arrayData.todaysReturn));
        returnData['fundData'].push(arrayData);
      }
    }
    return returnData;
  },
  async getTodayReturn(cdsDataWhere, type = "today") {
    let returnTotalCurrent = 0.00;
    cdsDataWhere.valueDate = { [Op.gte]: moment().subtract(2, 'days').startOf('day'), [Op.lte]: moment().subtract(2, 'days').endOf('day') }
    if (type == "today") {
      cdsDataWhere.valueDate = { [Op.gte]: moment().subtract(1, 'days').startOf('day'), [Op.lte]: moment().subtract(1, 'days').endOf('day') };
    }
    let result = await txnResponseTransactionRsp.findOne(
      {
        attributes: [
          [Sequelize.fn('ROUND', Sequelize.fn('SUM', Sequelize.col('response_units')), 2), 'totalCurrent']
        ],
        where: cdsDataWhere,
        raw: true,
        group: ['id']
      }
    );
    if (result) {
      returnTotalCurrent = result?.totalCurrent ?? 0.00;
    }
    return returnTotalCurrent;
  },

  async removeUser(req) {
    try {
      let userId = req.user.id;
      let isUserExist = this.findOne({ id: userId });
      if (isUserExist == null || isUserExist == "") {
        throw ("Something went wrong");
      }
      let isDeleted = await user.destroy({ where: { id: userId } });
      if (!isDeleted) {
        throw ("Account not deleted.");
      }
      await user.destroy({ where: { id: userId } });
      return true;
    } catch (error) {
      throw Error(error);
    }
  }
}