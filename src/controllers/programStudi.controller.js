import { logger } from "../config/logger.js";
import { ResponseError } from "../middleware/error.middleware.js";
import Fakultas from "../models/Fakultas.js";
import ProgramStudi from "../models/ProgramStudi.js";
import {
    createProgramStudiValidation,
    updateProgramStudiValidation,
} from "../validations/programStudi.validation.js";
import { validate } from "../validations/validation.js";

export const createProgramStudi = async (req, res) => {
    try {
        const programStudiRequest = validate(
            createProgramStudiValidation,
            req.body
        );

        const fakultas = await Fakultas.findOne({
            where: {
                id: programStudiRequest.fakultasId,
            },
        });

        if (!fakultas) {
            throw new ResponseError(404, "Fakultas tidak ditemukan");
        }

        const programStudi = await ProgramStudi.findOne({
            where: {
                name: programStudiRequest.name,
                fakultasId: programStudiRequest.fakultasId,
            },
        });

        if (programStudi) {
            throw new ResponseError(
                404,
                "Program Studi sudah ada di Fakultas ini."
            );
        }

        const data = await ProgramStudi.create({
            name: programStudiRequest.name,
            fakultasId: programStudiRequest.fakultasId,
        });

        logger.info("Create program studi successfully");
        return res.status(200).json({
            success: true,
            message: "Program Studi berhasil ditambahkan.",
            data,
        });
    } catch (error) {
        logger.error("Create program studi failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getProgramStudi = async (req, res) => {
    try {
        const data = await ProgramStudi.findAll({
            include: [
                {
                    model: Fakultas,
                    as: "fakultas",
                    attributes: ["id", "name"],
                },
            ],
            order: [["fakultasId", "DESC"]],
        });

        logger.info("Get program studi successfully");
        return res.status(200).json({
            success: true,
            message: "Program Studi berhasil ditampilkan",
            data,
        });
    } catch (error) {
        logger.error("Get program studi failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const detailProgramStudi = async (req, res) => {
    try {
        const { id } = req.params;

        const programStudi = await ProgramStudi.findByPk(id);

        if (!programStudi) {
            throw new ResponseError(
                404,
                "Program Studi tidak ditemukan di Fakultas ini."
            );
        }

        logger.info("Get detail ProgramStudi successfully");
        res.status(200).json({
            success: true,
            message: "Program Studi berhasil didapatkan",
            data: programStudi,
        });
    } catch (error) {
        logger.error("Get detail program studi failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateProgramStudi = async (req, res) => {
    try {
        const { id } = req.params;

        const programStudiRequest = validate(
            updateProgramStudiValidation,
            req.body
        );

        const programStudi = await ProgramStudi.findByPk(id);

        if (!programStudi) {
            throw new ResponseError(
                404,
                "Program Studi tidak ditemukan di Fakultas ini."
            );
        }

        if (
            programStudiRequest.name &&
            programStudiRequest.name !== programStudi.name
        ) {
            const duplicate = await ProgramStudi.findOne({
                where: {
                    name: programStudiRequest.name,
                },
            });

            if (duplicate) {
                throw new ResponseError(
                    404,
                    "Program Studi sudah ada di Fakultas ini."
                );
            }
        }

        programStudi.name = programStudiRequest.name ?? programStudi.name;

        await programStudi.save();

        logger.info("Update ProgramStudi successfully");
        res.status(200).json({
            success: true,
            message: "Program Studi berhasil diupdate",
            data: programStudi,
        });
    } catch (error) {
        logger.error("Update program studi failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteProgramStudi = async (req, res) => {
    try {
        const { id } = req.params;

        const programStudi = await ProgramStudi.findByPk(id);

        if (!programStudi) {
            throw new ResponseError(
                404,
                "Program Studi tidak ditemukan di Fakultas ini."
            );
        }

        await programStudi.destroy();

        return res.status(200).json({
            success: true,
            message: "Fakultas berhasil dihapus",
            data: programStudi,
        });
    } catch (error) {
        logger.error("Delete Fakultas Failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
