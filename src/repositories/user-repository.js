import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import models from "../models";
import config from "../config";
import jwt from "../services/jwt";
import httpStatus from "http-status";
const { Sequelize } = models.sequelize;
const { User, CdsHold, UserLead } = models
export default {

  async dashboard(req, t) {
    try {
      let data = {};
      const { query } = req;
      const queryData = query;
      let userId = req.user.id;
      let investedData = {};
      const leadData = await UserLead.findOne(
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
      const csdData = await CdsHold.findOne(
        {
          attributes: {
            include: [
              [Sequelize.fn('ROUND', Sequelize.fn('SUM', Sequelize.col('currentValue')), 2), 'currentValue']
            ]
          },
          group: ["id"],
          raw: true
        }
      );
      investedData.invested = leadData.sum_amount;
      investedData.current = csdData.currentValue;
      let fundData = await CdsHold.findAndCountAll(
        {
          attributes: {
            exclude: ["id", "canName", "fundCode", "schemeCode", "schemeName", "folioNumber", "folioCheckDigit", "navDate", 'createdAt', 'updatedAt'],
          },
          where: { 'can': leadData.canNumber },
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
      return await User.findOne({
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