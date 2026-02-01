import Joi from "joi";

const createLokasiPekerjaanValidation = Joi.object({
    provinsi_id: Joi.number().integer().required().messages({
        "number.empty": "Provinsi wajib diisi",
    }),

    kota_id: Joi.string().required().messages({
        "string.empty": "Kota wajib diisi",
    }),

    company_name: Joi.string().min(3).max(191).required().messages({
        "string.empty": "Nama perusahaan wajib diisi",
    }),

    company_address: Joi.string().min(3).max(191).required().messages({
        "string.empty": "Alamat perusahaan wajib diisi",
    }),

    job_title: Joi.string().min(3).max(191).required().messages({
        "string.empty": "Jabatan perusahaan wajib diisi",
    }),

    domisili_address: Joi.string().min(3).max(250).required().messages({
        "string.empty": "Alamat perusahaan wajib diisi",
    }),

    longitude: Joi.string().min(3),

    latitude: Joi.string().min(3),
});

const updateLokasiPekerjaanValidation = Joi.object({
    provinsi_id: Joi.number().integer().optional(),

    kota_id: Joi.string().optional(),

    company_name: Joi.string().min(3).max(191).optional(),

    company_address: Joi.string().min(3).max(191).optional(),

    job_title: Joi.string().min(3).max(191).optional(),

    domisili_address: Joi.string().min(3).max(250).optional(),

    longitude: Joi.string().min(3),

    latitude: Joi.string().min(3),
});

export { createLokasiPekerjaanValidation, updateLokasiPekerjaanValidation };
