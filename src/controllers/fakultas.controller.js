import { logger } from "../config/logger.js";
import { ResponseError } from "../middleware/error.middleware.js";
import Fakultas from "../models/Fakultas.js";
import {
    createFakultasValidation,
    updateFakultasValidation,
} from "../validations/fakultas.validation.js";
import { validate } from "../validations/validation.js";

export const createFakultas = async (req, res) => {
    try {
        const fakultas = validate(createFakultasValidation, req.body);

        const fakultasAlreadyExists = await Fakultas.findOne({
            where: {
                name: fakultas.name,
            },
        });

        if (fakultasAlreadyExists) {
            throw new ResponseError(400, "Fakultas sudah ada.");
        }

        const data = await Fakultas.create({
            name: fakultas.name,
        });

        logger.info("Create fakultas successfully");
        res.status(200).json({
            success: true,
            message: "Fakultas berhasil ditambahkan",
            data,
        });
    } catch (error) {
        logger.error("Create fakultas failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const detailFakultas = async (req, res) => {
    try {
        const fakultas = await Fakultas.findOne({
            where: {
                id: req.params.id,
            },
        });

        if (!fakultas) {
            throw new ResponseError(400, "Fakultas tidak ditemukan.");
        }

        logger.info("Get detail fakultas successfully");
        res.status(200).json({
            success: true,
            message: "Fakultas berhasil didapatkan",
            data: fakultas,
        });
    } catch (error) {
        logger.error("Get detail fakultas failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateFakultas = async (req, res) => {
    try {
        const fakultasRequest = validate(updateFakultasValidation, req.body);

        const fakultas = await Fakultas.findOne({
            where: {
                id: req.params.id,
            },
        });

        if (!fakultas) {
            throw new ResponseError(400, "Fakultas tidak ditemukan.");
        }

        if (fakultasRequest.name && fakultasRequest.name !== fakultas.name) {
            const fakultasAlreadyExists = await Fakultas.findOne({
                where: {
                    name: fakultasRequest.name,
                },
            });

            if (fakultasAlreadyExists) {
                throw new ResponseError(400, "Fakultas sudah ada.");
            }
        }

        fakultas.name = fakultasRequest.name ?? fakultas.name;

        await fakultas.save();

        logger.info("Update fakultas successfully");
        res.status(200).json({
            success: true,
            message: "Fakultas berhasil diupdate",
            data: fakultas,
        });
    } catch (error) {
        logger.error("Update fakultas failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getFakultas = async (req, res) => {
    try {
        const fakultas = await Fakultas.findAll({
            order: [["name", "DESC"]],
        });

        logger.info("Get fakultas successfully");
        res.status(200).json({
            success: true,
            message: "Daftar fakultas berhasil ditampilkan",
            data: fakultas,
        });
    } catch (error) {
        logger.error("Get Fakultas Failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteFakultas = async (req, res) => {
    try {
        const id = req.params.id;

        const fakultas = await Fakultas.findByPk(id);

        if (!fakultas) {
            throw new ResponseError(400, "Fakultas tidak ada.");
        }

        await Fakultas.destroy({
            where: {
                id: fakultas.id,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Fakultas berhasil dihapus",
            data: fakultas,
        });
    } catch (error) {
        logger.error("Delete Fakultas Failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
