import sequelize from "../config/database.js";
import { logger } from "../config/logger.js";
import { ResponseError } from "../middleware/error.middleware.js";
import Pertanyaan from "../models/Pertanyaan.js";
import PilihanJawaban from "../models/PilihanJawaban.js";
import {
    createPertanyaanValidation,
    updatePertanyaanValidation,
} from "../validations/pertanyaan.validation.js";
import { validate } from "../validations/validation.js";
import slugify from "slugify";
import crypto from "crypto";

export const createPertanyaan = async (req, res) => {
    try {
        const pertanyaan = validate(createPertanyaanValidation, req.body);

        const randomId = crypto.randomBytes(3).toString("hex");

        const slug = slugify(pertanyaan.name, {
            lower: true,
            strict: true,
        });

        const data = await Pertanyaan.create({
            name: pertanyaan.name,
            slug: `${slug}-${randomId}`,
            tahun_akademik: pertanyaan.tahun_akademik,
            status: pertanyaan.status ? 1 : 0,
        });

        logger.info("Create pertanyaan successfully");
        res.status(200).json({
            success: true,
            message: "Pertanyaan berhasil ditambahkan",
            data,
        });
    } catch (error) {
        logger.error("Create pertanyaan failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllPertanyaan = async (req, res) => {
    try {
        const {
            tahun_akademik = "",
            status = "",
            search = "",
            page = 1,
            perPage = 10,
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(perPage);

        const limit = parseInt(perPage);

        const tahunAkademikFilter = tahun_akademik || null;
        const statusFilter = status ? parseInt(status) : null;
        const searchQuery = `%${search || ""}%`;

        const data = await sequelize.query(
            `
            SELECT p.id, p.name, p.slug, p.status, p.tahun_akademik
            FROM pertanyaan p
            WHERE ( :tahunAkademikFilter IS NULL OR p.tahun_akademik = :tahunAkademikFilter )
                AND ( :statusFilter IS NULL OR p.status = :statusFilter )
                AND ( p.name LIKE :searchQuery )
            ORDER BY p.id DESC
            LIMIT :limit OFFSET :offset
            `,
            {
                replacements: {
                    tahunAkademikFilter,
                    statusFilter,
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
            FROM pertanyaan p
            WHERE ( :tahunAkademikFilter IS NULL OR p.tahun_akademik = :tahunAkademikFilter )
                AND ( :statusFilter IS NULL OR p.status = :statusFilter )
                AND ( p.name LIKE :searchQuery )
            `,
            {
                replacements: {
                    tahunAkademikFilter,
                    statusFilter,
                    searchQuery,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const total = Number(countResult.total || 0);

        logger.info("Get all pertanyaan successfully");
        return res.status(200).json({
            success: true,
            message: "Semua pertanyaan berhasil didapatkan.",
            currentPage: parseInt(page),
            perPage: limit,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data,
        });
    } catch (error) {
        logger.error("Get all pertanyaan failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updatePertanyaan = async (req, res) => {
    try {
        const { id } = req.params;

        const pertanyaanRequest = validate(
            updatePertanyaanValidation,
            req.body
        );

        const pertanyaan = await Pertanyaan.findByPk(id);

        if (!pertanyaan) {
            throw new ResponseError(404, "Pertanyaan tidak ditemukan");
        }

        pertanyaan.name = pertanyaanRequest.name ?? pertanyaan.name;
        pertanyaan.tahun_akademik =
            pertanyaanRequest.tahun_akademik ?? pertanyaan.tahun_akademik;

        if (pertanyaanRequest.status !== undefined) {
            pertanyaan.status = pertanyaanRequest.status ? 1 : 0;
        }

        if (pertanyaanRequest.name !== undefined) {
            const slug = slugify(pertanyaanRequest.name, {
                lower: true,
                strict: true,
            });

            const randomId = crypto.randomBytes(3).toString("hex");
            pertanyaan.slug = `${slug}-${randomId}`;
        }

        await pertanyaan.save();

        logger.info("Update pertanyaan successfully");
        res.status(200).json({
            success: true,
            message: "Pertanyaan berhasil diupdate",
            data: pertanyaan,
        });
    } catch (error) {
        logger.error("Update pertanyaan failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const deletePertanyaan = async (req, res) => {
    try {
        const { id } = req.params;

        const pertanyaan = await Pertanyaan.findByPk(id);

        if (!pertanyaan) {
            throw new ResponseError(404, "Pertanyaan tidak ditemukan");
        }

        await pertanyaan.destroy();

        logger.info("Delete pertanyaan successfully");
        res.status(200).json({
            success: true,
            message: "Pertanyaan berhasil dihapus.",
            data: pertanyaan,
        });
    } catch (error) {
        logger.error("Delete pertanyaan failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const copyPertanyaanByTahunAkademik = async (req, res) => {
    try {
        const { tahunAkademikAsal, tahunAkademikTujuan } = req.body;

        const data = await Pertanyaan.findAll({
            where: {
                tahun_akademik: tahunAkademikAsal,
            },
            include: {
                model: PilihanJawaban,
                as: "pilihan_jawaban",
            },
        });

        if (!tahunAkademikAsal || !tahunAkademikTujuan) {
            throw new ResponseError(
                404,
                "tahunAkademikAsal dan tahunAkademikTujuan wajib diisi."
            );
        }
        if (!data.length) {
            throw new ResponseError(
                404,
                "Data pertanyaan di tahun akademik asal kosong."
            );
        }

        for (const dt of data) {
            const randomId = crypto.randomBytes(3).toString("hex");
            const slug = slugify(dt.name, {
                lower: true,
                strict: true,
            });

            const newPertanyaan = await Pertanyaan.create({
                slug: `${slug}-${randomId}`,
                tahun_akademik: tahunAkademikTujuan,
                name: dt.name,
                status: 0,
            });

            for (const item of dt.pilihan_jawaban) {
                await PilihanJawaban.create({
                    pertanyaanId: newPertanyaan.id,
                    name: item.name,
                });
            }
        }

        logger.info("Copy pertanyaan successfully");
        res.status(200).json({
            success: true,
            message: "Pertanyaan berhasil dicopy ke tahun akademik tujuan.",
            data: {
                tahunAkademikAsal,
                tahunAkademikTujuan,
                totalPertanyaanDisalin: data.length,
                totalPilihanJawabanDisalin: data.reduce(
                    (acc, dt) => acc + dt.pilihan_jawaban.length,
                    0
                ),
            },
        });
    } catch (error) {
        logger.error("Copy pertanyaan by tahun akademik failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateStatusByTahunAkademik = async (req, res) => {
    try {
        const { tahun_akademik, status } = req.body;

        const data = await Pertanyaan.findAll({
            where: {
                tahun_akademik: tahun_akademik,
            },
        });

        if (!data.length) {
            throw new ResponseError(
                404,
                "Data pertanyaan di tahun akademik asal kosong."
            );
        }

        const [result] = await Pertanyaan.update(
            {
                status: status ? 1 : 0,
            },
            {
                where: {
                    tahun_akademik: tahun_akademik,
                },
            }
        );

        logger.info("Update status pertanyaan successfully");
        res.status(200).json({
            success: true,
            message: "Status Pertanyaan berhasil diupdate",
            data: {
                totalUpdateStatusPertanyaan: result,
            },
        });
    } catch (error) {
        logger.error("Update status pertanyaan failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const detailPertanyaan = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await Pertanyaan.findOne({
            where: {
                id: id,
            },
            include: {
                model: PilihanJawaban,
                as: "pilihan_jawaban",
            },
        });

        if (!data) {
            throw new ResponseError(404, "Pertanyaan tidak ditemukan");
        }

        logger.info("Get detail pertanyaan kuesioner successfully");
        return res.status(200).json({
            success: true,
            message: "Detail pertanyaan kuesioner berhasil didapatkan.",
            data,
        });
    } catch (error) {
        logger.error("Get detail pertanyaan kuesioner failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
