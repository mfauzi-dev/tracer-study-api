import Joi from "joi";

const createProgramStudiValidation = Joi.object({
    fakultasId: Joi.number().integer().required(),
    name: Joi.string().min(4).max(191).required(),
});

const updateProgramStudiValidation = Joi.object({
    name: Joi.string().min(4).max(191).optional(),
});

export { createProgramStudiValidation, updateProgramStudiValidation };
