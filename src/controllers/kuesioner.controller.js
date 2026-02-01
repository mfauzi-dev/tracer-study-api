import sequelize from "../config/database.js";
import { logger } from "../config/logger.js";
import { ResponseError } from "../middleware/error.middleware.js";
import User from "../models/User.js";
import {
    createJawabanKuesionerValidation,
    updateJawabanKuesionerValidation,
} from "../validations/kuesioner.validation.js";
import { validate } from "../validations/validation.js";
import {
    Pertanyaan,
    PilihanJawaban,
    JawabanKuesioner,
} from "../models/index.js";

export const createJawabanKuesioner = async (req, res) => {
    try {
        const userId = req.user.id;

        const { pertanyaanId } = req.params;

        const jawaban = validate(createJawabanKuesionerValidation, req.body);

        // cek user
        const user = await User.findOne({
            where: {
                id: userId,
            },
            attributes: [
                "id",
                "nomor_induk",
                "fakultasId",
                "programStudiId",
                "name",
            ],
        });

        if (!user) {
            throw new ResponseError(404, "User tidak ditemukan.");
        }

        // cek pertanyaan aktif atau tidak
        const pertanyaan = await Pertanyaan.findOne({
            where: {
                id: pertanyaanId,
                status: 1,
            },
        });

        if (!pertanyaan) {
            throw new ResponseError(404, "Pertanyaan tidak ditemukan");
        }

        // cek apakah jawaban sudah ada atau tidak
        const jawabanExists = await JawabanKuesioner.count({
            where: {
                userId: userId,
                pertanyaanId: pertanyaan.id,
            },
        });

        if (jawabanExists > 0) {
            throw new ResponseError(400, "Pertanyaan ini sudah dijawab.");
        }

        // validasi pilihan jawaban jika ada
        if (jawaban.pilihanJawabanId) {
            const pilihan = await PilihanJawaban.findOne({
                where: {
                    id: jawaban.pilihanJawabanId,
                    pertanyaanId: pertanyaan.id,
                },
            });

            if (!pilihan) {
                throw new ResponseError(
                    400,
                    "Pilihan jawaban tidak valid untuk pertanyaan ini."
                );
            }
        }

        const data = await JawabanKuesioner.create({
            userId: user.id,
            pertanyaanId: pertanyaan.id,
            pilihanJawabanId: jawaban.pilihanJawabanId,
            jawaban_teks: jawaban.jawaban_teks,
            tahun_akademik: pertanyaan.tahun_akademik,
        });

        logger.info("Jawaban kuesioner created successfully");
        return res.status(201).json({
            success: true,
            message: "Jawaban kuesioner berhasil dibuat.",
            data,
        });
    } catch (error) {
        logger.error("Create jawaban kuesioner failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const detailPertanyaanKuesioner = async (req, res) => {
    try {
        const userId = req.user.id;

        const { pertanyaanId } = req.params;

        const data = await Pertanyaan.findOne({
            where: {
                id: pertanyaanId,
            },
            include: [
                {
                    model: PilihanJawaban,
                    as: "pilihan_jawaban",
                },
            ],
        });

        if (!data) {
            throw new ResponseError(404, "Pertanyaan tidak ditemukan");
        }

        const jawabanKuesioner = await JawabanKuesioner.findOne({
            where: {
                userId: userId,
                pertanyaanId: pertanyaanId,
            },
        });

        logger.info("Get detail pertanyaan kuesioner successfully");
        return res.status(200).json({
            success: true,
            message: "Detail pertanyaan kuesioner berhasil didapatkan.",
            data,
            jawabanKuesioner,
        });
    } catch (error) {
        logger.error("Get detail pertanyaan kuesioner failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateJawabanKuesioner = async (req, res) => {
    try {
        const userId = req.user.id;

        const { pertanyaanId } = req.params;

        const jawaban = validate(updateJawabanKuesionerValidation, req.body);

        const jawabanKuesioner = await JawabanKuesioner.findOne({
            where: {
                userId: userId,
                pertanyaanId: pertanyaanId,
            },
        });

        if (!jawabanKuesioner) {
            throw new ResponseError(
                404,
                "Jawaban belum ada, tidak bisa diupdate"
            );
        }

        if (jawaban.pilihanJawabanId) {
            const pilihanJawaban = await PilihanJawaban.findOne({
                where: {
                    id: jawaban.pilihanJawabanId,
                    pertanyaanId: pertanyaanId,
                },
            });

            if (!pilihanJawaban) {
                throw new ResponseError(
                    400,
                    "Pilihan jawaban tidak ditemukan untuk pertanyaan ini."
                );
            }

            // jika user ingin update jawaban menjadi pilihan maka teks dikosongkan.
            jawabanKuesioner.pilihanJawabanId = jawaban.pilihanJawabanId;
            jawabanKuesioner.jawaban_teks = null;
        } else if (jawaban.jawaban_teks) {
            // jika user ingin update jawaban menjadi teks maka pilihan dikosongkan.
            jawabanKuesioner.jawaban_teks = jawaban.jawaban_teks;
            jawabanKuesioner.pilihanJawabanId = null;
        } else {
            logger.info("Tidak ada perubahan jawaban");
            return res.status(200).json({
                success: true,
                message: "Tidak ada perubahan jawaban.",
                data: jawabanKuesioner,
            });
        }

        await jawabanKuesioner.save();

        logger.info("Jawaban kuesioner updated successfully");
        return res.status(200).json({
            success: true,
            message: "Jawaban kuesioner berhasil diupdate.",
            data: jawabanKuesioner,
        });
    } catch (error) {
        logger.error("Update jawaban kuesioner failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
