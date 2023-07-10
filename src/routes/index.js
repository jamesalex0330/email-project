import { Router } from 'express';
import HttpStatus from 'http-status';
import path from 'path';
import loggers from '../services/logger';
import account from './account';
import media from './media'
import attachment from './attachment'
import user from './user'
import gmail from './gmail'
const router = Router();
const register = (app) => {
  app.use(router);

  app.get('/*', (req, res) => {
    if (!req.path.includes('/api')) {
      res.sendFile(path.join(`${__dirname}/../../build/index.html`));
    }
  });

  router.use('/api', [
    account,
    media,
    attachment,
    user,
    gmail
  ]);


  app.use((error, req, res, next) => {
    if (!error.status || error.status == HttpStatus.INTERNAL_SERVER_ERROR) {
      loggers.errorLogger.error(`internal error ${new Date()} ${error}`);
      console.log('internal error', `${new Date()}`, error.status, error);
    }
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      error,
      message: (error.status == HttpStatus.INTERNAL_SERVER_ERROR) ? 'Internal Server Error' : error.message
    });
  });


  app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = HttpStatus.NOT_FOUND;
    res.status(error.status).json({
      success: false,
      data: null,
      error,
      message: error.message,
    });
  });
};
export default register;