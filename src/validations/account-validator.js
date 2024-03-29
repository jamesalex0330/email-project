import BaseJoi from "@hapi/joi";
import Extension from "@hapi/joi-date";
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
  panCard: Joi.string().required().regex(/([A-Z]){5}([0-9]){4}([A-Z]){1}$/).max(10).label("Pan Card").error(() => 'Pan card is invalid.'),
});
const userAccountLoginSchema = Joi.object({
  email: Joi.string().label("Email").required(),
  password: Joi.string().required(),
  deviceType: Joi.string().required()
});

const sendOtpSchema = Joi.object({
  email: Joi.string().required()
});
const verifyOtpSchema = Joi.object({
  email: Joi.string().required(),
  otp: Joi.string().length(4).required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).label("Confirm password").error(() => 'password and Confirm password not same.'),
});
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).label("Confirm password").error(()=>'password and Confirm password not same.')
});
export default {
  userAccountSignupSchema,
  userAccountLoginSchema,
  changePasswordSchema,
  sendOtpSchema,
  verifyOtpSchema
}