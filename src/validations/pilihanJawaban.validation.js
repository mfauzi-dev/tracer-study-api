import Joi from "joi";

const createPilihanJawabanValidation = Joi.object({
    pertanyaanId: Joi.number().integer().required(),
    name: Joi.string().min(2).max(250).required(),
});

const updatePilihanJawabanValidation = Joi.object({
    name: Joi.string().min(2).max(250).optional(),
});

export { createPilihanJawabanValidation, updatePilihanJawabanValidation };
