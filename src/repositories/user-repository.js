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
      let userId = req.user.id;
      let investedData = {};
      const leadData = await UserLead.findOne({
        where : {userId:userId},
        attributes: [Sequelize.fn("SUM", Sequelize.col("amount"))],
        raw: true
      });
      const csdData = await CdsHold.findOne({
        attributes: [Sequelize.fn("SUM", Sequelize.col("currentValue"))],
        raw: true
      });
      investedData.invested = leadData.sum;
      investedData.current = csdData.sum;
      let fundData = await CdsHold.findAll({
        attributes: {
          exclude: ["id", "can", "canName", "fundCode", "schemeCode", "schemeName", "folioNumber", "folioCheckDigit", "navDate",'createdAt','updatedAt'],
        },
      });
      data.userId = userId;
      data.name = req.user.firstName+' '+req.user.lastName;
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