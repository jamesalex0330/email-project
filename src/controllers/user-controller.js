import HttpStatus from "http-status";
import repositories from "../repositories";
import models from "../models";
import { error } from "winston";

const { accountRepository, userRepository } = repositories;


export default {
  /**
   * User signup
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async dashboard(req, res, next) {

    try {

      let result = await userRepository.dashboard(req);
      if (result) {
        res.status(HttpStatus.OK).json({
          success: true,
          data: result,

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
   * Delete User
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async removeUser(req, res, next) {
    try {
      let result = await userRepository.removeUser(req);
      if (result) {
        res.status(HttpStatus.OK).json({
          success: true,
          data: result,
          message:"User deleted successfully"
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