import Joi from "joi";

const createPertanyaanValidation = Joi.object({
    name: Joi.string().min(4).max(500).required(),
    tahun_akademik: Joi.string().min(4).max(191).required().messages({
        "string.empty": "Tahun Akademik wajib diisi",
        "string.min": "Tahun Akademik minimal 4 karakter, contohnya: 2024/2025",
        "string.max":
            "Tahun Akademik maksimal 10 karakter contohnya: 2024/2025",
    }),
    status: Joi.number().valid(0, 1).default(0),
});

const updatePertanyaanValidation = Joi.object({
    name: Joi.string().min(4).max(500).optional(),
    tahun_akademik: Joi.string().min(4).max(191).optional().messages({
        "string.min": "Tahun Akademik minimal 4 karakter, contohnya: 2024/2025",
        "string.max":
            "Tahun Akademik maksimal 10 karakter contohnya: 2024/2025",
    }),
    status: Joi.number().valid(0, 1).optional(),
});

export { createPertanyaanValidation, updatePertanyaanValidation };
