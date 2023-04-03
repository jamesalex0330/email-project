import HttpStatus from "http-status";
import repositories from "../repositories";
import models from "../models";
import { error } from "winston";

const { accountRepository } = repositories;


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
      res.status(HttpStatus.OK).json({
        success: true,
        data: {'token': user},
      });
    } catch (error) {
      res.status('403').json({
        success: false,
        data: {},
      });
    }
  }
}

