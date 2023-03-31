import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { DateTime } from 'luxon';
import moment from 'moment';
import momentTimeZone from 'moment-timezone';
import config from '../config';
import models from '../models';
const { Course, CourseSession, Transaction, Booking,VehicleType } = models;
export default {

  /**
  * get fullname  
  * @param {Number} length
  */
  async getFullName(data) {
    return `${data.firstName} ${data.lastName}`;
  },
  /**
   * Generate random string
   * @param {Number} length
   */
  generateRandomString: (length) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let output = '';

    for (let x = 0; x < length; x++) {
      const i = Math.floor(Math.random() * 62);
      output += chars.charAt(i);
    }
    return output;
  },
  /**
   * Generate random integer
   */
  generateRandomInteger: (length = 8) => {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
  },
  /**
   * Generate otp
   */
  generateOtp() {
    return config.app.environment == 'development' ? 4444 : this.generateRandomInteger(4);
  },
  /**
   * Generate randon password
   */
  generateRandomPassword() {
    return this.generateRandomString(8);
  },
  /**
   * Generate hash password
   * @param {String} dataString
   */
  async generateHashPassword(dataString) {
    try {
      const salt = await bcrypt.genSalt();
      return await bcrypt.hash(dataString, salt);
    } catch (error) {
      throw new Error(error);
    }
  },

  async getOrderId(id){
    let order = "order_rcptid_"+id+"_"+`${Date.now()}`;
    return order;
  },

  /**
   * Get current timestamp
   */
  getCurrentTimeInUnix() {
    return moment().unix()
  },

  /**
   * Get current year
   */
  convertDateFromTimezone(date, timezone, format) {
    date = date || new Date();
    let dateObj = '';
    if (timezone) {
      dateObj = moment.tz(date, timezone).format(format);
    } else {
      dateObj = moment.utc(date).format(format);
    }
    return dateObj;
  },

  /**
  * Get current year
  */
  getUTCDateTimeFromTimezone(date, timezone, format) {
    date = date || new Date();
    date = moment.tz(date, timezone).format(format);
    let dateObject = momentTimeZone.utc(date);
    return dateObject;
  },
  /**
  * Change Date format
  */
  changeDateFormat(date, format = 'YYYY-MM-DD') {
    date = date || new Date();
    let dateStr = '';
    dateStr = moment.utc(date).format(format);
    return dateStr;
  },

  /**
   * 
   * @param {*} dateObject 
   * @returns 
   * Convert time according to timezone
   */
  convertToTz(date,timeZone){
      var format = 'YYYY-MM-DD HH:mm:ss';
      return moment(date, format).tz(timeZone).format(format);
  },
  /**
   * Get date from datetime
   */
  getDateFromDateTime(dateObject) {
    const date = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    return `${year}-${month}-${date}`;
  },
  /**
   *
   * @param {Date} date
   * @param {String} interval
   * @param {Number} units
   */
  dateAdd(date, interval, units) {
    let ret = new Date(date);
    const checkRollover = function () {
      if (ret.getDate() != date.getDate()) ret.setDate(0);
    };
    switch (interval.toLowerCase()) {
      case 'year':
        ret.setFullYear(ret.getFullYear() + units);
        checkRollover();
        break;
      case 'quarter':
        ret.setMonth(ret.getMonth() + 3 * units);
        checkRollover();
        break;
      case 'month':
        ret.setMonth(ret.getMonth() + units);
        checkRollover();
        break;
      case 'week':
        ret.setDate(ret.getDate() + 7 * units);
        break;
      case 'day':
        ret.setDate(ret.getDate() + units);
        break;
      case 'hour':
        ret.setTime(ret.getTime() + units * 3600000);
        break;
      case 'minute':
        ret.setTime(ret.getTime() + units * 60000);
        break;
      case 'second':
        ret.setTime(ret.getTime() + units * 1000);
        break;
      default:
        ret = undefined;
        break;
    }
    return ret;
  },
  /**
   *
   * @param {Date} date
   * @param {String} interval
   * @param {Number} units
   */
  dateMinus(date, interval, units) {
    let ret = new Date(date);
    const checkRollover = function () {
      if (ret.getDate() != date.getDate()) ret.setDate(0);
    };
    switch (interval.toLowerCase()) {
      case 'year':
        ret.setFullYear(ret.getFullYear() - units);
        checkRollover();
        break;
      case 'quarter':
        ret.setMonth(ret.getMonth() - 3 * units);
        checkRollover();
        break;
      case 'month':
        ret.setMonth(ret.getMonth() - units);
        checkRollover();
        break;
      case 'week':
        ret.setDate(ret.getDate() - 7 * units);
        break;
      case 'day':
        ret.setDate(ret.getDate() - units);
        break;
      case 'hour':
        ret.setTime(ret.getTime() - units * 3600000);
        break;
      case 'minute':
        ret.setTime(ret.getTime() - units * 60000);
        break;
      case 'second':
        ret.setTime(ret.getTime() - units * 1000);
        break;
      default:
        ret = undefined;
        break;
    }
    return ret;
  },
  /**
   * Get date difference
   * @param {Date} date
   * @param {String} interval
   * @param {Number} units
   */
  dateDifference(date1, date2) {
    var start_date = moment(date1, 'YYYY-MM-DD HH:mm:ss');
    var end_date = moment(date2, 'YYYY-MM-DD HH:mm:ss');
    var duration = moment.duration(end_date.diff(start_date));
    var hours = duration.asHours();       
    return hours;
  },
  /**
   * Generate 10 digit unique number
   */
  generateUniqueNumber(length = 10) {
    const _sym = '123456789';
    let str = '';
    for (let i = 0; i < length; i++) {
      str += _sym[parseInt(Math.random() * _sym.length)];
    }
    return str;
  },
  /**
   * Convert iso datetime to sql time
   * @param {string} dateTime
   */
  fromIsoToSQLTime(dateTime) {
    const dateTimeObj = DateTime.fromISO(dateTime, { zone: 'utc' });
    return (dateTimeObj && dateTimeObj.toSQLTime({ includeOffset: false })) || null;
  },
  /**
   * Convert sql time to iso datetime
   * @param {string} time
   */
  fromSQLTimeToIso(time, date) {
    if (time) {
      const [hour, minute, second] = time.split(':');
      const fromObject = {
        hour,
        minute,
        second,
        zone: 'utc',
      };
      if (date) {
        const dt = DateTime.fromJSDate(date, {
          zone: 'utc',
        });
        const { year, month, day } = dt;
        Object.assign(fromObject, {
          year,
          month,
          day,
        });
      }
      return DateTime.fromObject(fromObject);
    }
    return null;
  },
  /**
   * Check file exists
   * @param {string} path
   */
  isFileExist(filePath) {
    const tmpPath = path.join(__dirname, `../../${filePath}`);
    return fs.existsSync(tmpPath) || false;
  },

  /**
   * Remove # from string
   * @param {string} path
   */
  removeHasTag(string) {
    return string.replace(/^#+/i, '');
  },
  /**
  * check valid emai or not
  * @param {string} path
  */
  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },

  formatMoney(number, decPlaces, decSep, thouSep) {
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
      decSep = typeof decSep === "undefined" ? "." : decSep;
    thouSep = typeof thouSep === "undefined" ? "," : thouSep;
    var sign = number < 0 ? "-" : "";
    var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
    var j = (j = i.length) > 3 ? j % 3 : 0;

    return sign +
      (j ? i.substr(0, j) + thouSep : "") +
      i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
      (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
  },

  getDateFormat() {
    return 'YYYY-MM-DD HH:mm:ss';
  },

  setEnvValue(attrName, newVal) {
    var envPath = "./.env";
    var dataArray = fs.readFileSync(envPath, 'utf8').split('\n');

    var replacedArray = dataArray.map((line) => {
      if (line.split('=')[0] == attrName) {
        return attrName + "=" + String(newVal);
      } else {
        return line;
      }
    })

    fs.writeFileSync(envPath, "");
    for (let i = 0; i < replacedArray.length; i++) {
      fs.appendFileSync(envPath, replacedArray[i] + "\n");
    }
  },

  async getPracticalSessonListByBookingId(req,userId){
    try {
      const courseId = req.courseId;
      let orderBy = [["createdAt", "DESC"]];
      let pendingBookings = await Booking.findOne({
        where: { bookingStatus: 'pending', userId: userId, courseId: courseId }, order: orderBy,
        include: [{
          model: CourseSession,
          attributes: [
            'id',
            'session_title',
            'session_duration',
            'description',
            'sortOrder'
          ]
        },
        {
          model: VehicleType,
          attributes: [
            'id',
            'name'
          ]
        }
        ]
      });
      let completedSessionCount = 0;
      let upcommingSessionCount = 0;
      let updatedCompletedSessionCount = 0;
      if (pendingBookings) {
        return pendingBookings;
      } else {
        let completedWhere = { bookingStatus: 'completed', userId: userId, courseId: courseId };
        const completedBookings = await Booking.findAndCountAll({ where: completedWhere });
        completedSessionCount = completedBookings.count;
        updatedCompletedSessionCount = parseInt(completedSessionCount) + parseInt(1);
        upcommingSessionCount = parseInt(updatedCompletedSessionCount) + parseInt(1);
        let courseSession = await CourseSession.findOne({
          where: { sortOrder: updatedCompletedSessionCount, courseId: courseId }
        });
        if (courseSession) {
          courseSession = courseSession.get();
          return  courseSession;
        } else {
          return {};
        }

      }
    } catch (error) {
      throw Error(error);
    }
  },

  async getCourseIdByCourseKey(courseKey){
    try {
      const result = await Course.findOne({
        where:{courseKey:courseKey}
      });
      return result.id;
    } catch (error) {
      
    }
  },
};
