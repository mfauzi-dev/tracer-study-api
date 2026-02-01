import Joi from "joi";

const createJawabanKuesionerValidation = Joi.object({
    pilihanJawabanId: Joi.number().integer(),
    jawaban_teks: Joi.string().min(2).max(250),
})
    .xor("pilihanJawabanId", "jawaban_teks")
    .messages({
        "object.missing":
            "Harus pilih salah satu: pilihan atau jawaban lainnya",
        "object.xor": "Tidak boleh isi pilihan dan jawaban lainnya bersamaan",
    });

const updateJawabanKuesionerValidation = Joi.object({
    pilihanJawabanId: Joi.number().integer().optional(),
    jawaban_teks: Joi.string().min(2).max(250).optional(),
})
    .xor("pilihanJawabanId", "jawaban_teks")
    .messages({
        "object.missing":
            "Harus pilih salah satu: pilihan atau jawaban lainnya",
        "object.xor": "Tidak boleh isi pilihan dan jawaban lainnya bersamaan",
    });

export { createJawabanKuesionerValidation, updateJawabanKuesionerValidation };
