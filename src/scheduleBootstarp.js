import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import methodOverride from 'method-override';
import helmet from 'helmet';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import routes from './routes';
import models from './models';
import config from './config';
import loggers from './services/logger';
import appVersionMiddleware from './middlewares/app-version-middleware'
import path from 'path';
import scheduleJob from './services/schedule-job'
import schedule from 'node-schedule';
/**
 * Application startup class
 *
 * @export
 * @class Bootstrap
 */
export default class Bootstrap {
    /**
     * Creates an instance of Bootstrap.
     * @param {object} app
     *
     * @memberOf Bootstrap
     */
    constructor(app) {
        this.app = app;
        this.startScheduler();
    }

    /**
     * Start express server
     * @memberOf Bootstrap
     */
    startScheduler() {
        this.scheduleJob();
    }

    /**
     * Execute schedule job
     * @memberOf Bootstrap
     */
    scheduleJob() {
        schedule.scheduleJob('* */1 * * *', scheduleJob.deleteMedia);
        schedule.scheduleJob('* */1 * * *', scheduleJob.getUnreadEmails);
    }
}