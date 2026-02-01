import Joi from "joi";

const createFakultasValidation = Joi.object({
    name: Joi.string().min(4).max(191).required(),
});

const updateFakultasValidation = Joi.object({
    name: Joi.string().min(4).max(191).optional(),
});

export { createFakultasValidation, updateFakultasValidation };
