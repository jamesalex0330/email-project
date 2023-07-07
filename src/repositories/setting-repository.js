import models from '../models';
import config from '../config';
import utility from '../services/utility';
const { exec } = require('child_process');
const { setting, country, state, city } = models;

export default {

  /**
   * Get all setting
   * @param {Object} req
   */
  async findAll(req) {
    try {
      let settings = {};
      let where = { status: 'active' };
      if (req.query.settingType) {
        where.settingType = req.query.settingType;
      }
      const results = await setting.findAll({
        where: where
      });
      results.forEach((data, index) => {
        let obj = data.toJSON();
        if (['android_force_update', 'ios_force_update'].indexOf(obj.key) != -1) {
          settings[obj.key] = parseInt(obj.value);
        } else {
          settings[obj.key] = obj.value;
        }
      })

      return settings;
    } catch (error) {
      throw Error(error);
    }
  },

  /**
     * update settings
     * @param {Object} data
     */
  async updateSettings(req) {
    try {
      for (const [key, value] of Object.entries(req.body)) {
        await setting.update({ value: value }, { where: { key: key } });
      }
      return true;
    } catch (error) {
      throw Error(error);
    }
  },

  /**
     * update country settings
     * @param {Object} data
     */
  async updateCountrySettings(req) {
    try {
      let res = '';
      let envKey = '';
      let isSetting = await setting.findOne({ where: { key: 'is_country_setting' } });
      if (isSetting.value == 0) {
        for (const [key, value] of Object.entries(req.body)) {
          res = await setting.update({ value: value }, { where: { key: key } });
          utility.setEnvValue(envKey, value);
        }
        if (res) {
          await setting.update({ value: 1 }, { where: { key: 'is_country_setting' } });
          exec(
            `sudo pm2 restart monay-api/index.js`,
            { maxBuffer: 1024 * 2084 }, async (err, stdout, stderr) => {
              if (err) {
                console.error('buffer error', err);
              }
            }
          );
        }
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw Error(error);
    }
  },
  /**
  * Get country list
  * @param {Object} req
  */
  async getCountryList(req) {
    try {
      return await country.findAll();
    } catch (error) {
      throw Error(error);
    }
  },

  /**
   * 
   * @param {*} countryId 
   * @returns State List
   */
  async getStateList(countryId) {
    try {
      let where = {countryId};
      return state.findAll(
        {where:where}
      );
    } catch(error) {
     throw Error(error);
    }
  },

  /**
   * 
   * @param {*} countryId 
   * @returns City List
   */
   async getCityList(stateId) {
    try {
      let where = {stateId};
      return city.findAll(
        {where:where}
      );
    } catch(error) {
     throw Error(error);
    }
  }
};
