const Joi = require("joi");

const gameScoreSchema = Joi.object({
  score: Joi.number().integer().min(0).required(),
});

module.exports = { gameScoreSchema };
