import Joi from "joi";

const createUserValidation = Joi.object({
    name: Joi.string().min(4).max(191).required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com"] } })
        .max(191)
        .required()
        .messages({
            "string.email": `Email harus dalam format yang benar.`,
            "any.required": `Email wajib diisi`,
        }),
    password: Joi.string().min(4).max(25).required(),
    roleAs: Joi.string().required(),
    nomorInduk: Joi.string()
        .min(5)
        .max(25)
        .when("roleAs", {
            is: Joi.valid("admin", "dosen"),
            then: Joi.optional(),
            otherwise: Joi.required(),
        }),
    fakultasId: Joi.number()
        .integer()
        .when("roleAs", {
            is: Joi.valid("admin", "dosen"),
            then: Joi.optional(),
            otherwise: Joi.required(),
        }),
    programStudiId: Joi.number()
        .integer()
        .when("roleAs", {
            is: Joi.valid("admin", "dosen"),
            then: Joi.optional(),
            otherwise: Joi.required(),
        }),
});

const updatePasswordValidation = Joi.object({
    oldPassword: Joi.string().min(4).max(25).required(),
    newPassword: Joi.string().min(4).max(25).required(),
    confirmPassword: Joi.string().min(4).max(25).required(),
});

const updateProfileValidation = Joi.object({
    name: Joi.string().min(4).max(191).optional(),
});

const updateProfileByAdminValidation = Joi.object({
    name: Joi.string().min(4).max(191).optional(),
    nomorInduk: Joi.string().min(5).max(25).optional(),
    fakultasId: Joi.number().integer().optional(),
    programStudiId: Joi.number().integer().optional(),
    roleAs: Joi.string().optional(),
});

export {
    createUserValidation,
    updatePasswordValidation,
    updateProfileValidation,
    updateProfileByAdminValidation,
};
