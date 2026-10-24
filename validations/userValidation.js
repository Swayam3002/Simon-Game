const Joi = require("joi");

const signupSchema = Joi.object({
  username: Joi.string().trim().lowercase().min(3).max(30).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).required(),
});

module.exports = { signupSchema };
