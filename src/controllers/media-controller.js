import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { mediaRepository } = repositories;

export default {
      /**
   * Upload media Local
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async uploadFile(req, res, next) {
    try {
     const result = await mediaRepository.uploadFile(req, res, next);
     console.log(req);
      res.status(HttpStatus.CREATED).json({
        success: true,
        data: result,
        message: 'upload sucessfull'
      });
    } catch (error) {
      next(error);
    }
  }
}