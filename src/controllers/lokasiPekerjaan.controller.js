import { logger } from "../config/logger.js";
import Provinsi from "../models/Provinsi.js";
import axios from "axios";
import User from "../models/User.js";
import { validate } from "../validations/validation.js";
import {
    createLokasiPekerjaanValidation,
    updateLokasiPekerjaanValidation,
} from "../validations/lokasiPekerjaan.validation.js";
import LokasiPekerjaan from "../models/LokasiPekerjaan.js";
import { ResponseError } from "../middleware/error.middleware.js";
import Kota from "../models/Kota.js";
import Fakultas from "../models/Fakultas.js";
import ProgramStudi from "../models/ProgramStudi.js";
import sequelize from "../config/database.js";

export const createLokasiPekerjaan = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findOne({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new ResponseError(404, "User tidak ditemukan.");
        }

        const pekerjaan = validate(createLokasiPekerjaanValidation, req.body);

        const result = await LokasiPekerjaan.create({
            user_id: user.id,
            fakultas_id: user.fakultasId,
            program_studi_id: user.programStudiId,
            provinsi_id: pekerjaan.provinsi_id,
            kota_id: pekerjaan.kota_id,
            company_name: pekerjaan.company_name,
            company_address: pekerjaan.company_address,
            job_title: pekerjaan.job_title,
            domisili_address: pekerjaan.domisili_address,
            longitude: pekerjaan.longitude,
            latitude: pekerjaan.latitude,
        });

        logger.info("lokasi pekerjaan created successfully");
        return res.status(200).json({
            success: true,
            message: "lokasi pekerjaan berhasil dibuat",
            data: result,
        });
    } catch (error) {
        logger.error("Create lokasi pekerjaan failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getUserLokasiPekerjaan = async (req, res) => {
    try {
        const userId = req.user.id;

        const { page = 1, perPage = 10 } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(perPage);

        const limit = parseInt(perPage);

        const data = await sequelize.query(
            `
            SELECT lp.id, lp.company_name, lp.company_address, lp.job_title, lp.domisili_address,
                u.id AS user_id, u.name AS user_name,
                p.id AS provinsi_id, p.name AS provinsi_name,
                k.id AS kota_id, k.name AS kota_name,
                fk.id AS fakultas_id, fk.name AS fakultas_name,
                ps.id AS program_studi_id, ps.name AS program_studi_name
            FROM lokasi_pekerjaan lp
            LEFT JOIN user u ON lp.user_id = u.id
            LEFT JOIN provinsi p ON lp.provinsi_id = p.id
            LEFT JOIN kota k ON lp.kota_id = k.id
            LEFT JOIN fakultas fk ON lp.fakultas_id = fk.id
            LEFT JOIN programstudi ps ON lp.program_studi_id = ps.id
            WHERE ( lp.user_id = :userId )
            ORDER BY lp.id DESC
            LIMIT :limit OFFSET :offset
            `,
            {
                replacements: {
                    userId,
                    limit,
                    offset,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const [countResult] = await sequelize.query(
            `
            SELECT COUNT(*) AS total
            FROM lokasi_pekerjaan lp
            LEFT JOIN user u ON lp.user_id = u.id
            LEFT JOIN provinsi p ON lp.provinsi_id = p.id
            LEFT JOIN kota k ON lp.kota_id = k.id
            LEFT JOIN fakultas fk ON lp.fakultas_id = fk.id
            LEFT JOIN programstudi ps ON lp.program_studi_id = ps.id
            WHERE ( lp.user_id = :userId )
            `,
            {
                replacements: {
                    userId,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const total = Number(countResult.total || 0);

        logger.info("Get user lokasi pekerjaan successfully");
        return res.status(200).json({
            success: true,
            message: "Daftar lokasi pekerjaan alumni berhasil didapatkan",
            currentPage: parseInt(page),
            perPage: limit,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data,
        });
    } catch (error) {
        logger.error("Get user lokasi pekerjaan failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const detailLokasiPekerjaan = async (req, res) => {
    try {
        const userId = req.user.id;

        const { id } = req.params;

        const pekerjaan = await LokasiPekerjaan.findOne({
            where: {
                user_id: userId,
                id: id,
            },
        });

        if (!pekerjaan) {
            throw new ResponseError(404, "Pekerjaan tidak ditemukan");
        }

        logger.info("lokasi pekerjaan updated successfully");
        return res.status(200).json({
            success: true,
            message: "lokasi pekerjaan berhasil diupdate",
            data: pekerjaan,
        });
    } catch (error) {
        logger.error("Update lokasi pekerjaan failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateLokasiPekerjaan = async (req, res) => {
    try {
        const userId = req.user.id;

        const { id } = req.params;

        const pekerjaan = await LokasiPekerjaan.findOne({
            where: {
                user_id: userId,
                id: id,
            },
        });

        if (!pekerjaan) {
            throw new ResponseError(404, "Pekerjaan tidak ditemukan");
        }

        const pekerjaanRequest = validate(
            updateLokasiPekerjaanValidation,
            req.body
        );

        await pekerjaan.update(pekerjaanRequest);

        logger.info("lokasi pekerjaan updated successfully");
        return res.status(200).json({
            success: true,
            message: "lokasi pekerjaan berhasil diupdate",
            data: pekerjaan,
        });
    } catch (error) {
        logger.error("Update lokasi pekerjaan failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteUserLokasiPekerjaan = async (req, res) => {
    try {
        const userId = req.user.id;

        const { id } = req.params;

        const pekerjaan = await LokasiPekerjaan.findOne({
            where: {
                user_id: userId,
                id: id,
            },
        });

        if (!pekerjaan) {
            throw new ResponseError(404, "Pekerjaan tidak ditemukan");
        }

        await pekerjaan.destroy();

        logger.info("lokasi pekerjaan deleted successfully");
        return res.status(200).json({
            success: true,
            message: "lokasi pekerjaan berhasil dihapus",
            data: pekerjaan,
        });
    } catch (error) {
        logger.error("Delete lokasi pekerjaan failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteLokasiPekerjaan = async (req, res) => {
    try {
        const { id } = req.params;

        const pekerjaan = await LokasiPekerjaan.findOne({
            where: {
                id: id,
            },
        });

        if (!pekerjaan) {
            throw new ResponseError(404, "Pekerjaan tidak ditemukan");
        }

        await pekerjaan.destroy();

        logger.info("lokasi pekerjaan deleted successfully");
        return res.status(200).json({
            success: true,
            message: "lokasi pekerjaan berhasil dihapus",
            data: pekerjaan,
        });
    } catch (error) {
        logger.error("Delete lokasi pekerjaan failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllLokasiPekerjaan = async (req, res) => {
    try {
        const {
            fakultas_id = "",
            program_studi_id = "",
            provinsi_id = "",
            kota_id = "",
            search = "",
            page = 1,
            perPage = 10,
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(perPage);

        const limit = parseInt(perPage);

        const fakultasFilter = fakultas_id ? parseInt(fakultas_id) : null;
        const programStudiFilter = program_studi_id
            ? parseInt(program_studi_id)
            : null;
        const provinsiFilter = provinsi_id ? parseInt(provinsi_id) : null;
        const kotaFilter = kota_id || null;
        const searchQuery = `%${search || ""}%`;

        const data = await sequelize.query(
            `
            SELECT lp.id, lp.company_name, lp.company_address, lp.job_title, lp.domisili_address,
                u.id AS user_id, u.name AS user_name,
                p.id AS provinsi_id, p.name AS provinsi_name,
                k.id AS kota_id, k.name AS kota_name,
                fk.id AS fakultas_id, fk.name AS fakultas_name,
                ps.id AS program_studi_id, ps.name AS program_studi_name
            FROM lokasi_pekerjaan lp
            LEFT JOIN user u ON lp.user_id = u.id
            LEFT JOIN provinsi p ON lp.provinsi_id = p.id
            LEFT JOIN kota k ON lp.kota_id = k.id
            LEFT JOIN fakultas fk ON lp.fakultas_id = fk.id
            LEFT JOIN programstudi ps ON lp.program_studi_id = ps.id
             WHERE ( :fakultasFilter IS NULL OR lp.fakultas_id = :fakultasFilter )
                AND ( :programStudiFilter IS NULL OR lp.program_studi_id = :programStudiFilter )
                AND ( :provinsiFilter IS NULL OR lp.provinsi_id = :provinsiFilter )
                AND ( :kotaFilter IS NULL OR lp.kota_id = :kotaFilter )
                AND ( u.name LIKE :searchQuery 
                    OR p.name LIKE :searchQuery 
                    OR k.name LIKE :searchQuery 
                    OR fk.name LIKE :searchQuery 
                    OR ps.name LIKE :searchQuery )
            ORDER BY lp.id DESC
            LIMIT :limit OFFSET :offset
            `,
            {
                replacements: {
                    fakultasFilter,
                    programStudiFilter,
                    provinsiFilter,
                    kotaFilter,
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
            FROM lokasi_pekerjaan lp
            LEFT JOIN user u ON lp.user_id = u.id
            LEFT JOIN provinsi p ON lp.provinsi_id = p.id
            LEFT JOIN kota k ON lp.kota_id = k.id
            LEFT JOIN fakultas fk ON lp.fakultas_id = fk.id
            LEFT JOIN programstudi ps ON lp.program_studi_id = ps.id
            WHERE ( :fakultasFilter IS NULL OR lp.fakultas_id = :fakultasFilter )
                AND ( :programStudiFilter IS NULL OR lp.program_studi_id = :programStudiFilter )
                AND ( :provinsiFilter IS NULL OR lp.provinsi_id = :provinsiFilter )
                AND ( :kotaFilter IS NULL OR lp.kota_id = :kotaFilter )
                AND ( u.name LIKE :searchQuery 
                    OR p.name LIKE :searchQuery 
                    OR k.name LIKE :searchQuery 
                    OR fk.name LIKE :searchQuery 
                    OR ps.name LIKE :searchQuery )
            `,
            {
                replacements: {
                    fakultasFilter,
                    programStudiFilter,
                    provinsiFilter,
                    kotaFilter,
                    searchQuery,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const total = Number(countResult.total || 0);

        logger.info("Get user lokasi pekerjaan successfully");
        return res.status(200).json({
            success: true,
            message: "Daftar lokasi pekerjaan alumni berhasil didapatkan",
            currentPage: parseInt(page),
            perPage: limit,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data,
        });
    } catch (error) {
        logger.error("Get user lokasi pekerjaan failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
