import BaseJoi from "@hapi/joi";
import Extension from "@hapi/joi-date";
import utility from "../services/utility";

const Joi = BaseJoi.extend(Extension);

const userAccountSignupSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().min(6).max(100).required(),
    phoneNumber: Joi.string().required(),
    password: Joi.string().required(),
    confirmpassword: Joi.string()
        .required()
        .valid(Joi.ref("password")),
    userRole: Joi.string().valid("user", "admin").required(),
    panCard: Joi.string().required(),
  });
const userAccountLoginSchema = Joi.object({
    email: Joi.string().label("Email").required(),
    password: Joi.string().required()
  });

export default {
    userAccountSignupSchema,
    userAccountLoginSchema
}