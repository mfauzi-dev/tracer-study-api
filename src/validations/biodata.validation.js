import Joi from "joi";

const createBiodataValidation = Joi.object({
    tempatLahir: Joi.string().min(3).max(100).required().messages({
        "string.empty": "Tempat lahir wajib diisi",
    }),

    tanggalLahir: Joi.date().iso().required().messages({
        "date.base": "Tanggal lahir tidak valid",
        "any.required": "Tanggal lahir wajib diisi",
    }),

    alamat: Joi.string().min(5).max(255).required().messages({
        "string.empty": "Alamat wajib diisi",
    }),

    telepon: Joi.string().required().min(5).max(15).messages({
        "string.empty": "Nomor telepon wajib diisi",
        "string.min": "Nomor telepon minimal 5 karakter",
        "string.max": "Nomor telepon maksimal 15 karakter",
    }),

    jenisKelamin: Joi.string()
        .valid("laki-laki", "perempuan")
        .required()
        .messages({
            "any.only":
                "Jenis kelamin hanya boleh 'laki-laki' atau 'perempuan'",
            "any.required": "Jenis kelamin wajib diisi",
        }),

    namaGelar: Joi.string().max(50).required().messages({
        "string.empty": "Nama gelar wajib diisi, contoh: S.Kom",
    }),

    ipk: Joi.string().min(0).max(4).required().messages({
        "string.empty": "IPK wajib diisi, contoh: 3.50",
    }),

    angkatan: Joi.string().length(4).required().messages({
        "string.length": "Angkatan harus 4 digit (contoh: 2021)",
        "any.required": "Angkatan wajib diisi",
    }),
});

const updateBiodataValidation = Joi.object({
    tempatLahir: Joi.string().min(3).max(100).optional(),

    tanggalLahir: Joi.date().iso().optional(),

    alamat: Joi.string().min(5).max(255).optional(),

    telepon: Joi.string().optional().min(5).max(15).messages({
        "string.min": "Nomor telepon minimal 5 karakter",
        "string.max": "Nomor telepon maksimal 15 karakter",
    }),

    jenisKelamin: Joi.string()
        .valid("laki-laki", "perempuan")
        .optional()
        .messages({
            "any.only":
                "Jenis kelamin hanya boleh 'laki-laki' atau 'perempuan'",
        }),

    namaGelar: Joi.string().max(50).optional(),

    ipk: Joi.string().min(0).max(4).optional().messages({
        "string.max": "IPK maksimal 4 karakter, contoh: 3.50",
    }),

    angkatan: Joi.string().length(4).optional().messages({
        "string.length": "Angkatan harus 4 digit (contoh: 2021)",
        "any.optional": "Angkatan wajib diisi",
    }),
});

export { createBiodataValidation, updateBiodataValidation };
