import sequelize from "../config/database.js";
import { logger } from "../config/logger.js";
import { ResponseError } from "../middleware/error.middleware.js";
import Biodata from "../models/Biodata.js";
import User from "../models/User.js";
import {
    createBiodataValidation,
    updateBiodataValidation,
} from "../validations/biodata.validation.js";
import { validate } from "../validations/validation.js";
import fs from "fs";
import path from "path";

export const createBiodata = async (req, res) => {
    try {
        const userId = req.user.id;

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

        const biodataExists = await Biodata.count({
            where: { userId: userId },
        });

        if (biodataExists > 0) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: "Biodata sudah dibuat untuk user ini",
            });
        }

        const biodata = validate(createBiodataValidation, req.body);

        if (!req.file) {
            throw new ResponseError(404, "Gambar wajib diunggah.");
        }

        const imagePath = req.file.filename;

        const result = await Biodata.create({
            userId: user.id,
            fakultasId: parseInt(user.fakultasId),
            programStudiId: parseInt(user.programStudiId),
            npm: user.nomor_induk,
            name: user.name,
            tempatLahir: biodata.tempatLahir,
            tanggalLahir: new Date(biodata.tanggalLahir),
            alamat: biodata.alamat,
            telepon: biodata.telepon,
            jenisKelamin: biodata.jenisKelamin,
            namaGelar: biodata.namaGelar,
            ipk: biodata.ipk,
            angkatan: biodata.angkatan,
            image: imagePath,
        });

        logger.info("Biodata created successfully");
        return res.status(201).json({
            success: true,
            message: "Biodata berhasil dibuat.",
            data: result,
        });
    } catch (error) {
        logger.error("Create biodata failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateBiodata = async (req, res) => {
    try {
        const userId = req.user.id;

        const biodata = await Biodata.findOne({
            where: {
                userId,
            },
        });

        if (!biodata) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({
                success: false,
                message: "Biodata tidak ditemukan",
            });
        }

        const biodataRequest = validate(updateBiodataValidation, req.body);

        // Jika ada gambar baru, hapus gambar lama
        let image = biodata.image;
        if (req.file) {
            if (image) {
                const oldPath = path.join("uploads", image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            image = req.file.filename;
        }

        biodata.tempatLahir = biodataRequest.tempatLahir ?? biodata.tempatLahir;
        biodata.tanggalLahir = biodataRequest.tanggalLahir
            ? new Date(biodataRequest.tanggalLahir)
            : biodata.tanggalLahir;
        biodata.alamat = biodataRequest.alamat ?? biodata.alamat;
        biodata.telepon = biodataRequest.telepon ?? biodata.telepon;
        biodata.jenisKelamin =
            biodataRequest.jenisKelamin ?? biodata.jenisKelamin;
        biodata.namaGelar = biodataRequest.namaGelar ?? biodata.namaGelar;
        biodata.ipk = biodataRequest.ipk ?? biodata.ipk;
        biodata.angkatan = biodataRequest.angkatan ?? biodata.angkatan;
        biodata.image = image;

        await biodata.save();

        logger.info("Biodata updated successfully");
        return res.status(201).json({
            success: true,
            message: "Biodata berhasil diupdate",
            data: biodata,
        });
    } catch (error) {
        logger.error("Update biodata failed", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteBiodata = async (req, res) => {
    try {
        const { id } = req.params;

        const biodata = await Biodata.findByPk(id);

        if (!biodata) {
            return res.status(404).json({
                success: false,
                message: "Biodata tidak ditemukan.",
            });
        }

        // Hapus gambar jika ada
        if (biodata.image) {
            const imagePath = path.join("uploads", biodata.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await biodata.destroy();

        logger.info("Delete Biodata successfully");
        return res.status(200).json({
            success: true,
            message: "Biodata berhasil dihapus.",
            data: biodata,
        });
    } catch (error) {
        logger.error("Delete biodata failed", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMyBiodata = async (req, res) => {
    try {
        const userId = req.user.id;

        const biodata = await Biodata.findOne({
            where: {
                userId,
            },
            raw: true,
        });

        if (!biodata) {
            return res.status(404).json({
                success: false,
                redirectTo: "/create-biodata",
                message: "Biodata belum dibuat",
            });
        }

        const fotoUrl = biodata.image
            ? `http://localhost:${process.env.APP_PORT}/uploads/${biodata.image}`
            : null;

        logger.info("Get My Biodata successfully");
        return res.status(201).json({
            success: true,
            message: "Ini adalah biodata anda.",
            data: {
                ...biodata,
                fotoUrl,
            },
        });
    } catch (error) {
        logger.error("Get My biodata failed", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getUserBiodata = async (req, res) => {
    try {
        const { id } = req.params;

        const biodata = await Biodata.findOne({
            where: {
                id,
            },
            raw: true,
        });

        if (!biodata) {
            throw new ResponseError(404, "Biodata tidak ditemukan");
        }

        const fotoUrl = biodata.image
            ? `http://localhost:${process.env.APP_PORT}/uploads/${biodata.image}`
            : null;

        logger.info("Get User Biodata successfully");
        return res.status(201).json({
            success: true,
            message: "User Biodata berhasil didapatkan",
            data: {
                ...biodata,
                fotoUrl,
            },
        });
    } catch (error) {
        logger.error("Get User Biodata failed", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllBiodata = async (req, res) => {
    try {
        const {
            fakultasId = "",
            programStudiId = "",
            jenisKelamin = "",
            search = "",
            page = 1,
            perPage = 10,
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(perPage);

        const limit = parseInt(perPage);

        const fakultasFilter = fakultasId ? parseInt(fakultasId) : null;
        const programStudiFilter = programStudiId
            ? parseInt(programStudiId)
            : null;
        const jenisKelaminFilter = jenisKelamin || null;
        const searchQuery = `%${search || ""}%`;

        // get user data
        const data = await sequelize.query(
            `
            SELECT b.id, b.name, b.npm, b.image, b.telepon, b.jenisKelamin, 
                f.name as fakultas_name, p.name as program_studi_name,
            CASE 
                WHEN b.image IS NOT NULL THEN CONCAT('http://localhost:${process.env.APP_PORT}/uploads/', b.image)
                ELSE NULL
            END AS fotoUrl
            FROM biodata b
            LEFT JOIN fakultas f ON f.id = b.fakultasId
            LEFT JOIN programstudi p ON p.id = b.programStudiId
            WHERE ( :fakultasFilter IS NULL OR b.fakultasId = :fakultasFilter )
                AND ( :programStudiFilter IS NULL OR b.programStudiId = :programStudiFilter )
                AND ( :jenisKelaminFilter IS NULL OR b.jenisKelamin = :jenisKelaminFilter )
                AND ( b.name LIKE :searchQuery OR b.npm LIKE :searchQuery )
            ORDER BY b.id ASC
            LIMIT :limit OFFSET :offset
            `,
            {
                replacements: {
                    fakultasFilter,
                    programStudiFilter,
                    jenisKelaminFilter,
                    searchQuery,
                    limit,
                    offset,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        // total
        const [countResult] = await sequelize.query(
            `
            SELECT COUNT(*) AS total
            FROM biodata b
            LEFT JOIN fakultas f ON f.id = b.fakultasId
            LEFT JOIN programStudi p ON p.id = b.programStudiId
            WHERE ( :fakultasFilter IS NULL OR b.fakultasId= :fakultasFilter )
                AND ( :programStudiFilter IS NULL OR b.programStudiId = :programStudiFilter )
                AND (  :jenisKelaminFilter IS NULL OR b.jenisKelamin = :jenisKelaminFilter )
                AND ( b.name LIKE :searchQuery OR b.npm LIKE :searchQuery )
            `,
            {
                replacements: {
                    fakultasFilter,
                    programStudiFilter,
                    jenisKelaminFilter,
                    searchQuery,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const total = Number(countResult.total || 0);

        logger.info("Get all biodata successfully");
        return res.status(200).json({
            success: true,
            message: "Semua biodata berhasil didapatkan.",
            currentPage: parseInt(page),
            perPage: limit,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data,
        });
    } catch (error) {
        logger.error("Get all biodata failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
