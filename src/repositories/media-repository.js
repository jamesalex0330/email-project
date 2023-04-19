import models from "../models";
const { MediaTemp } = models;
import multer from "multer";

import path from 'path';

/**
 * MULTER SETUP FOR IMAG3E UPLOAD
 */
const storages = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public`)

  },
  filename: (req, file, cb) => {
    const dateTimeStamp = Date.now();
    const fileName = file.originalname.replace(/[^A-Z0-9.]/gi, "-");
    const fileArray = fileName.split(".");
    const ext = fileArray.pop();
    const data = `${fileArray.join("-")}-${dateTimeStamp}.${ext}`
    cb(null, data);
  }
});

export default {
  async create({
    params, file, headers, req,
  }) {
    try {
      let result = '';
      const mediaType = params.mediaType;

      const imageDir = path.join(__dirname, `../../${file.path}`);
      // const ext = path.extname(file.originalname).split('.').pop();
      const HTTPs = 'https';
      // if (config.app.mediaStorage === 's3' && params.mediaType === 'image') {
      //   const originalFileObj = file.transforms.findIndex((data) => data.id === 'original');
      //   if (originalFileObj >= 0) {
      //     // eslint-disable-next-line no-param-reassign
      //     file.key = file.transforms[originalFileObj].key;
      //   }
      // }

      const mediaData = {
        name: file.filename || file.originalname,
        basePath: file.path || file.key,
        imagePath: imageDir,
        baseUrl: `${HTTPs}://${headers.host}/${file.path}`,
        mediaType,
        mediaFor: params.mediaFor,
        isThumbImage: false,
        status: 'pending',
      };
      return mediaData;
      // Upload image on s3

      return result;
    } catch (error) {
      // loggers.error(`Media file create error: ${error}, user id: ${req?.user?.id} `);
      throw Error(error);
    }
  },
}
