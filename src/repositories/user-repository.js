import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import models from "../models";
import config from "../config";
import jwt from "../services/jwt";
import httpStatus from "http-status";
import helpers from "../helpers/sqlQuery";
import commonHelper from "../helpers/commonHelper";
const { Sequelize } = models.sequelize;
const { user, cdsHold, txnResponseTransactionRsp, userCanRegistration } = models
import moment from "moment-timezone";
export default {

  async dashboard(req, t) {
    try {
      let data = {};
      const { query } = req;
      const queryData = query;
      let userId = req.user.id;

      let userData = await user.findOne({
        where: { id: userId }
      });

      let userCanData = await userCanRegistration.findOne({
        where: { firstHolderPan: userData.panCard }
      });

      let investedData = {};

      let txnResponseData = {
        "canNumber": userCanData.can,
        "folio_number": null,
        "utrn": 0,
        "payment_status": ["'CR'", "'IR'", "'DG'", "'DA'", "'PC'", "'PD'"],
        "transaction_status": ["'CR'", "'IR'", "'DG'", "'DA'", "'PC'", "'PD'"],
        "transaction_status": ["'OA'", "'RA'", "'RP'"],
        "transaction_type_code": ["'A'", "'B'", "'N'", "'V'"],
      }
      let subQuery = helpers.dashboardQuery(txnResponseData);
      const leadData = await models.sequelize.query(subQuery, {
        type: models.sequelize.QueryTypes.SELECT,
      });
      const csdData = await cdsHold.findOne(
        {
          attributes: {
            include: [
              [Sequelize.fn('ROUND', Sequelize.fn('SUM', Sequelize.col('current_value')), 2), 'currentValue']
            ]
          },
          group: ["id"],
          raw: true
        }
      );
      investedData.invested = leadData?.sum_amount;
      investedData.current = csdData.currentValue;
      let canNumber = userCanData.can;
      let fundData = await cdsHold.findAll(
        {
          attributes: {
            exclude: ["canName", "fundCode", "folioCheckDigit", 'updatedAt']
          },
          where: { 'can': canNumber },
          limit: parseInt(queryData.limit || 10),
          offset: parseInt(queryData.offset || 0),
        },
      );
      data.userId = userId;
      data.name = req.user.firstName + ' ' + req.user.lastName;
      data.investedData = investedData;
      data.investedData.fundData = fundData;
      return await this.dashboardMaiArray(fundData, canNumber);
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

  async dashboardMaiArray(data, canNumber) {
    let returnData = {
      "invested": 0.00,
      "current": 0.00,
      "absReturns": 0.00,
      "totalReturns": 0.00,
      "todaysReturn": 0.00,
      "fundData": [],
    };
    if (data) {
      let cdsDataWhere = {};
      cdsDataWhere.can = canNumber;
      let todayDayCurrentAmount = await this.getTodayReturn(cdsDataWhere, "today");
      let yesterdayDayCurrentAmount = await this.getTodayReturn(cdsDataWhere, "yesterday");
      if (todayDayCurrentAmount > 0) {
        returnData['todaysReturn'] = commonHelper.roundNumber(((parseFloat(todayDayCurrentAmount) - parseFloat(yesterdayDayCurrentAmount)) / parseFloat(yesterdayDayCurrentAmount) * 100), 2);
      }

      for await (const row of data) {
        cdsDataWhere.folioNumber = row?.folioNumber;
        let todayDayCurrentAmount = await this.getTodayReturn(cdsDataWhere, "today");
        let yesterdayDayCurrentAmount = await this.getTodayReturn(cdsDataWhere, "yesterday");

        let txnResponseData = {
          "canNumber": row.can,
          "folio_number": null,
          "utrn": 0,
          "payment_status": ["'CR'", "'IR'", "'DG'", "'DA'", "'PC'", "'PD'"],
          "transaction_status": ["'CR'", "'IR'", "'DG'", "'DA'", "'PC'", "'PD'"],
          "transaction_status": ["'OA'", "'RA'", "'RP'"],
          "transaction_type_code": ["'A'", "'B'", "'N'", "'V'"],
        }
        let subQuery = helpers.dashboardQuery(txnResponseData);
        const leadData = await models.sequelize.query(subQuery, {
          type: models.sequelize.QueryTypes.SELECT,
        });
        let invested = 0.00;
        let current = row?.currentValue ?? 0.00;
        if (leadData[0]) {
          invested = leadData[0]?.sum_amount;
        }
        let navValue = 0.00;
        if (row?.schemeCode) {
          let schemeData = await commonHelper.getSchemeData(row?.schemeCode);
          if (schemeData.length > 0) {
            navValue = schemeData[0]?.nav ?? navValue;
          }
        }
        let arrayData = {
          "id": row?.id,
          "folioNumber": row?.folioNumber,
          "fundName": row?.fundName,
          "schemeName": row?.schemeName,
          "invested": commonHelper.roundNumber(invested),
          "current": commonHelper.roundNumber(current, 2),
          "absReturns": commonHelper.roundNumber((parseFloat(current) - parseFloat(invested) / parseFloat(invested)), 2),
          "totalReturns": commonHelper.roundNumber((parseFloat(current) - parseFloat(invested)), 2),
          "todaysReturn": (todayDayCurrentAmount > 0) ? commonHelper.roundNumber(((parseFloat(todayDayCurrentAmount) - parseFloat(yesterdayDayCurrentAmount)) / parseFloat(yesterdayDayCurrentAmount) * 100), 2) : 0.00,
          "units": leadData?.units ?? 0.00,
          "sinceDate": row?.navDate ?? "",
          "currentNAV": commonHelper.roundNumber(navValue, 2),
          "createdAt": row.createdAt,
        };
        returnData['invested'] = parseFloat(returnData['invested']) + parseFloat(invested);
        returnData['current'] = commonHelper.roundNumber((parseFloat(returnData['current']) + parseFloat(current)), 2);
        returnData['absReturns'] = commonHelper.roundNumber(parseFloat(returnData['absReturns']) + parseFloat(arrayData.absReturns));
        returnData['totalReturns'] = commonHelper.roundNumber(parseFloat(returnData['totalReturns']) + parseFloat(arrayData.totalReturns));
        returnData['fundData'].push(arrayData);

      }
    }
    return returnData;
  },
  async getTodayReturn(cdsDataWhere, type = "today") {
    let returnTotalCurrent = 0.00;
    cdsDataWhere.createdAt = { [Op.gte]: moment().subtract(2, 'days').startOf('day'), [Op.lte]: moment().subtract(2, 'days').endOf('day') }
    if (type == "today") {
      cdsDataWhere.createdAt = { [Op.gte]: moment().subtract(1, 'days').startOf('day'), [Op.lte]: moment().subtract(1, 'days').endOf('day') };
    }
    let result = await cdsHold.findOne(
      {
        attributes: {
          exclude: ["id", "canName", "fundCode", "schemeCode", "schemeName", "folioNumber", "folioCheckDigit", "navDate", 'createdAt', 'updatedAt', "can", "fundName", "unitHolding"],
          include: [
            [Sequelize.fn('ROUND', Sequelize.fn('SUM', Sequelize.col('current_value')), 2), 'totalCurrent']
          ]
        },
        where: cdsDataWhere,
        raw: true
      }
    );

    if (result) {
      returnTotalCurrent = result?.totalCurrent ?? 0.00;
    }
    return returnTotalCurrent;
  }
}