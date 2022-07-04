const joi = require('joi');

const addMedicationSchema = joi.object({
  title: joi.string().lowercase().trim().required(),
  description: joi.string().trim().required(),
  dosage: joi.number().integer().required(),
  units: joi.string().required(),
  time: joi.string().required(),
});

const searchMedicationSchema = joi.object({
  input: joi.string().lowercase().trim(),
});

module.exports = { addMedicationSchema, searchMedicationSchema };
