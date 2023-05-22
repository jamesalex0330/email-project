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
      if(user) {
        res.status(HttpStatus.OK).json({
          success: true,
          data: { 'token': user },
        });
        
      }
      res.status('403').json({
        success: false,
        data: null,
        messsage: "Invalid email or password"
        
      });
      
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



}


