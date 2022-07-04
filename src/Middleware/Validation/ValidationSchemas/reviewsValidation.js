const joi = require('joi');

const reviewsValidationSchema = joi.object({
  text: joi.string().required(),
  rating: joi.number().min(1).max(5).required(),
});

module.exports = { reviewsValidationSchema };
