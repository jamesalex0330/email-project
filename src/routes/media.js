import { Router } from 'express';
import controllers from '../controllers';


const router = Router();
const { mediaController } = controllers;

router.post(
  '/media/upload/:mediaFor/:mediaType',
  (req, res, next) => {
    const { params, body } = req;
    params.apiName = 'media';
    Object.assign(body, params);
    next();
  },
  mediaController.uploadMedia,
  mediaController.saveMedia,
);
export default router;