import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import models from "../models";
import config from "../config";
import jwt from "../services/jwt";
import httpStatus from "http-status";
const { Sequelize } = models.sequelize;
const { User, UserToken, UserDevice } = models
export default {
  async createHashPassword(password) {
    try {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      return hashPassword;
    } catch (error) {
      throw Error(error);
    }
  },
  async signup(req, t) {
    try {
      let bodyData = req.body;
      let hashPassword = await this.createHashPassword(bodyData.password);
      bodyData.password = hashPassword;
      let userData = await User.create(bodyData);


      if (userData) {
        return userData;
      } else {
        return false;
      }
    } catch (error) {
      throw Error(error);
    }
  },
  async compareUserPassword(password, hashPassword) {

    try {
      if (password && hashPassword) {
        const isPasswordMatch = await bcrypt.compare(password, hashPassword);
        if (isPasswordMatch) {
          return true;
        }
      }
      // return false;
    } catch (error) {
      next(error)
    }
  },
  async checkUserAccountLogin(req, res, next) {

    try {
      let { email, password, deviceType } = req.body;
      const user = await User.findOne({ where: { email: req.body.email } });
      if (user) {
        const isPasswordMatch = await this.compareUserPassword(password, user.password);
        if (!isPasswordMatch) {
          res.json({
            success: true,
            data: 'incorrect PASSWORD'
          })
        }
        // var userdata = { id: user.id, email: user.email, userRole: user.userRole }
        if (isPasswordMatch) {
          const { password, ...userData } = user.get();
          const token = jwt.createToken(userData);
          let userAccessToken = await token.then(e=>e);
          const deviceData = {
            userId: userData.id,
            deviceType,
            accessToken: userAccessToken
          };
          await this.addUpdateUserDevice(deviceData);
          return token;
        };
        return false;

      }
    } catch (error) {
      console.log(error);

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
  },

  /**
 * Add or update user device
 * @param {Object} data
 */
  async addUpdateUserDevice(data) {
    try {
      const userDeviceToken = await this.getUserDeviceToken(data.userId);
      const { userId, deviceType, accessToken } =
        data;
      
      if (userDeviceToken) {
        const newData = {
          accessToken,
          deviceType,
        };
        await this.updateUserDevice(userDeviceToken, newData);
      } else {
        const updateData = {
          userId,
          deviceType,
          accessToken
        };
        await this.addUserDevice(updateData);
      }

    } catch (error) {
      throw Error(error);
    }
  },

  /**
 * Get user device token from user id
 * @param {Number} userId
 */
  async getUserDeviceToken(userId) {
    try {
      let userToken = await UserToken.findOne({
        where: { userId },
      });
      return userToken;
    } catch (error) {
      throw Error(error);
    }
  },

  /**
* Update user device
* @param {Object} userDeviceObject
* @param {Object} data
*/
  async updateUserDevice(userDeviceObject, data) {
    try {
      const response = await userDeviceObject.update(data);
      return response;
    } catch (error) {
      throw Error(error);
    }
  },

    /**
   * Add user device
   * @param {Object} data
   */
    async addUserDevice(data) {
      try {
        return await UserToken.create(data);
      } catch (error) {
        throw Error(error);
      }
    },

    /**
   * Get device etail by token
   * @param {String} token
   */
  async getDeviceDetailByToken(token) {
    try {
      const where = {
        access_token: token,
      };
      return await UserToken.findOne({
        where,
      });
    } catch (error) {
      throw Error(error);
    }
  },
}