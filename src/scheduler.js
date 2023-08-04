import models from './models';
import loggers from './services/logger';
import scheduleJob from './services/schedule-job'
import schedule from 'node-schedule';
/**
 * Application startup class
 *
 * @export
 * @class Bootstrap
 */
export default class Schedule {
    /**
     * Creates an instance of Bootstrap.
     * @param {object} app
     *
     * @memberOf Bootstrap
     */
    constructor(app) {
        this.connectDb();
        this.start();
    }

    /**
     * Check database connection
     * @memberOf Bootstrap
     */
    connectDb() {
        const {
            sequelize
        } = models;
        sequelize
            .authenticate()
            .then(async () => {
                console.log("Connected to database");
                loggers.infoLogger.info('Database connected successfully');
                await sequelize
                    .sync()
                    .then(() => {
                        loggers.infoLogger.info('Database sync successfully');
                    })
                    .catch((error) => {
                        console.log(error)
                        loggers.infoLogger.error('Database syncing error %s', error);
                    });
            })
            .catch((error) => {
                loggers.errorLogger.error('Database connection error %s', error);
                console.log(error);
            });
    }

    

    /**
     * Start express server
     * @memberOf Bootstrap
     */
    start() {
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

const schedulerInstance = new Schedule();