const joi = require("joi");

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const registerSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  username: joi.string().required(),
});

const changePasswordSchema = joi.object({
  oldPassword: joi.string().min(8).required(),
  newPassword: joi.string().min(8).required,
});

module.exports = { loginSchema, registerSchema, changePasswordSchema };
