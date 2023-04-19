import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';
import multerStorageService from '../services/multerStorage'
const { mediaRepository } = repositories;
import path from 'path';
export default {
  async uploadMedia(req, res, next) {
    try {
      const { params } = req;
      const { mediaFor } = params;
      const multerStorage = await multerStorageService.getStorage('local');
      // eslint-disable-next-line consistent-return
      multerStorage.single('file')(req, res, async (error) => {
        // this.error = error;
        // if (error instanceof multer.MulterError) {
        //   return next(error);
        // }
        if (error) {
          return next(error);
        }

        // Crop images
        const fileDir = path.join(
          path.resolve(),
          `/public/uploads/${mediaFor}/thumb/`,
        );
        const fileName = req?.file?.path.split(`${mediaFor}`);
        next();
      });
    } catch (error) {
      next(error);
    }
  },
  async saveMedia(req, res, next) {
    try {
      const result = await mediaRepository.create(req);
      res.json({
        success: true,
        data: result,
        message: '',
      });
    } catch (error) {
      next(error);
    }
  },
}