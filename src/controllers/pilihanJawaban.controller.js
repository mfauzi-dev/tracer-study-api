import sequelize from "../config/database.js";
import { logger } from "../config/logger.js";
import { ResponseError } from "../middleware/error.middleware.js";
import Pertanyaan from "../models/Pertanyaan.js";
import PilihanJawaban from "../models/PilihanJawaban.js";
import {
    createPilihanJawabanValidation,
    updatePilihanJawabanValidation,
} from "../validations/pilihanJawaban.validation.js";
import { validate } from "../validations/validation.js";

export const createPilihanJawaban = async (req, res) => {
    try {
        const pilihanJawabanRequest = validate(
            createPilihanJawabanValidation,
            req.body
        );
        const pertanyaan = await Pertanyaan.findOne({
            where: {
                id: pilihanJawabanRequest.pertanyaanId,
            },
        });

        if (!pertanyaan) {
            throw new ResponseError(404, "Pertanyaan tidak ditemukan");
        }

        const data = await PilihanJawaban.create({
            pertanyaanId: pertanyaan.id,
            name: pilihanJawabanRequest.name,
        });

        logger.info("Create pilihan jawaban successfully");
        return res.status(200).json({
            success: true,
            message: "Pilihan Jawaban berhasil ditambahkan",
            data,
        });
    } catch (error) {
        logger.error("Create pilihan jawaban failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllPilihanJawaban = async (req, res) => {
    try {
        const {
            tahun_akademik = "",
            pertanyaan = "",
            search = "",
            page = 1,
            perPage = 10,
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(perPage);

        const limit = parseInt(perPage);

        const tahunAkademikFilter = tahun_akademik || null;
        const pertanyaanFilter = pertanyaan ? parseInt(pertanyaan) : null;
        const searchQuery = `%${search || ""}%`;

        const data = await sequelize.query(
            `
            SELECT p.id, p.name, 
                t.name as pertanyaan_name, t.tahun_akademik as tahun_akademik
            FROM pilihan_jawaban p
            JOIN pertanyaan t ON t.id = p.pertanyaanId
            WHERE ( :tahunAkademikFilter IS NULL OR t.tahun_akademik = :tahunAkademikFilter )
                AND ( :pertanyaanFilter IS NULL OR p.pertanyaanId = :pertanyaanFilter )
                AND ( p.name LIKE :searchQuery OR t.name LIKE :searchQuery )
            ORDER BY p.id DESC
            LIMIT :limit OFFSET :offset
            `,
            {
                replacements: {
                    tahunAkademikFilter,
                    pertanyaanFilter,
                    searchQuery,
                    limit,
                    offset,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const [countResult] = await sequelize.query(
            `
            SELECT COUNT(*) AS total
            FROM pilihan_jawaban p
            JOIN pertanyaan t ON t.id = p.pertanyaanId
            WHERE ( :tahunAkademikFilter IS NULL OR t.tahun_akademik = :tahunAkademikFilter )
                AND ( :pertanyaanFilter IS NULL OR p.pertanyaanId = :pertanyaanFilter )
                AND ( p.name LIKE :searchQuery OR t.name LIKE :searchQuery )
            `,
            {
                replacements: {
                    tahunAkademikFilter,
                    pertanyaanFilter,
                    searchQuery,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const total = Number(countResult.total || 0);

        logger.info("Get all pilihan jawaban successfully");
        return res.status(200).json({
            success: true,
            message: "Semua pilihan jawaban berhasil didapatkan.",
            currentPage: parseInt(page),
            perPage: limit,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data,
        });
    } catch (error) {
        logger.error("Get all pilihan jawaban failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const detailPilihanJawaban = async (req, res) => {
    try {
        const { id } = req.params;

        const pilihanJawaban = await PilihanJawaban.findByPk(id);

        if (!pilihanJawaban) {
            throw new ResponseError(404, "Pilihan jawaban tidak ditemukan");
        }

        logger.info("Get pilihan jawaban successfully");
        res.status(200).json({
            success: true,
            message: "pilihan jawaban berhasil didapatkan",
            data: pilihanJawaban,
        });
    } catch (error) {
        logger.error("Get pilihan jawaban failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updatePilihanJawaban = async (req, res) => {
    try {
        const { id } = req.params;
        const pilihanJawabanRequest = validate(
            updatePilihanJawabanValidation,
            req.body
        );

        const pilihanJawaban = await PilihanJawaban.findByPk(id);

        if (!pilihanJawaban) {
            throw new ResponseError(404, "Pilihan jawaban tidak ditemukan");
        }

        pilihanJawaban.name = pilihanJawabanRequest.name ?? pilihanJawaban.name;

        await pilihanJawaban.save();

        logger.info("Update pilihan jawaban successfully");
        res.status(200).json({
            success: true,
            message: "pilihan jawaban berhasil diupdate",
            data: pilihanJawaban,
        });
    } catch (error) {
        logger.error("Update pilihan jawaban failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const deletePilihanJawaban = async (req, res) => {
    try {
        const { id } = req.params;
        const pilihanJawaban = await PilihanJawaban.findByPk(id);

        if (!pilihanJawaban) {
            throw new ResponseError(404, "Pilihan jawaban tidak ditemukan");
        }

        await pilihanJawaban.destroy();

        logger.info("Delete pilihan jawaban successfully");
        res.status(200).json({
            success: true,
            message: "pilihan jawaban berhasil dihapus",
            data: pilihanJawaban,
        });
    } catch (error) {
        logger.error("Delete pilihan jawaban failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
