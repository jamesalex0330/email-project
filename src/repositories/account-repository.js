import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import models from "../models";
import config from "../config";
import jwt from "../services/jwt";
import httpStatus from "http-status";
const { Sequelize } = models.sequelize;
const { User } = models
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
      console.log(req.body);

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
      let { email, password } = req.body;
      const user = await User.findOne({ where: { email: req.body.email } });
      if (user) {
        const isPasswordMatch = await this.compareUserPassword(password, user.password);
        if (!isPasswordMatch) {
          res.json({
            success: true,
            data: 'incorrect PASSWORD'
          })
        }
        console.log(password);
        console.log(user.password);
        console.log(isPasswordMatch);
        var userdata = { id: user.id, email: user.email, userRole: user.userRole }
        console.log(userdata);
        if (isPasswordMatch) {
          const token = jwt.createToken(userdata);
          console.log(token);
        };

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
        if (!whereObj.status) {
          whereObj.status = { [Op.ne]: "deleted" };
        }
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