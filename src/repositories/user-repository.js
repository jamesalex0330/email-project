import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import models from "../models";
import config from "../config";
import jwt from "../services/jwt";
import httpStatus from "http-status";
const { Sequelize } = models.sequelize;
const { user, cdsHold, txnResponseTransactionRsp } = models
export default {

  async dashboard(req, t) {
    try {
      let data = {};
      const { query } = req;
      const queryData = query;
      let userId = req.user.id;
      let investedData = {};
      const leadData = await txnResponseTransactionRsp.findOne(
        {
          where: { userId: userId },
          attributes: {
            include: [
              [Sequelize.fn('ROUND', Sequelize.fn('SUM', Sequelize.col('amount')), 2), 'sum_amount']
            ]
          },
          group: ["id"],
          raw: true
        }
      );
      
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
      let canNumber = null;
      if(leadData?.canNumber){
        canNumber = leadData?.canNumber;
      }
      console.log(canNumber,"canNumber");
      let fundData = await cdsHold.findAll(
        {
          attributes: {
            exclude: ["id", "canName", "fundCode", "schemeCode", "schemeName", "folioNumber", "folioCheckDigit", "navDate", 'createdAt', 'updatedAt'],
          },
          where: { 'can': canNumber },
          limit: parseInt(queryData.limit || 10),
          offset: parseInt(queryData.offset || 0)
        },
      );
      data.userId = userId;
      data.name = req.user.firstName + ' ' + req.user.lastName;
      data.investedData = investedData;
      data.investedData.fundData = fundData
      return data;
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
  }
}