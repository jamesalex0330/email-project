import bcrypt from "bcryptjs";
import models from "../models";

const { Sequelize } = models.sequelize;

export default {
  async getAttachment(req) {
    try {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      return hashPassword;
    } catch (error) {
      throw Error(error);
    }
  },
  
}