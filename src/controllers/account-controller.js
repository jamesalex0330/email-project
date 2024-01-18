import HttpStatus from "http-status";
import repositories from "../repositories";
import models from "../models";
import { error } from "winston";

const { accountRepository, attachmentRepository } = repositories;


export default {
  /**
   * User signup
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async signup(req, res, next) {

    try {

      let result = await accountRepository.signup(req);
      if (result) {
        res.status(HttpStatus.OK).json({
          success: true,
          data: [],

        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: null,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  /**
 * User login
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
  async userAccountLogin(req, res, next) {
    try {
      let user = await accountRepository.checkUserAccountLogin(req);
      if (user) {
        res.status(HttpStatus.OK).json({
          success: true,
          data: user,
        });

      } else {
        res.status('403').json({
          success: false,
          data: {},
          messsage: "Invalid email or password"

        });
      }


    } catch (error) {
      res.status('403').json({
        success: false,
        data: {},
      });
    }
  },

  async getAuthorizationCode(req, res, next) {
    try {
      console.log(232323);
      let user = await attachmentRepository.getAuthorizationCode(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status('403').json({
        success: false,
        data: {},
      });
    }
  },

  /**
 * Logout User
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
  async logout(req, res, next) {
    try {
      let result = await accountRepository.logout(req);
      if (result) {
        res.status(HttpStatus.OK).json({
          success: true,
          data: null,
          message: "User logout successfully"
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: null,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  
  async sendOtp(req, res, next) {
    try {
      let result = await accountRepository.sendOtp(req);
      if (result) {
        res.status(HttpStatus.OK).json({
          success: true,
          data: null,
          message: "Otp send successfully!"
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: null,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  async verifyOtp(req, res, next) {
    try {
      let result = await accountRepository.verifyOtp(req);
      if (result) {
        res.status(HttpStatus.OK).json({
          success: true,
          data: null,
          message: "Password changed successfully!"
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: null,
        });
      }
    } catch (error) {
      next(error);
    }
  }



}


