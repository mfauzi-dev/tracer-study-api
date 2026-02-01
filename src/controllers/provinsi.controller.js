import { logger } from "../config/logger.js";
import Provinsi from "../models/Provinsi.js";
import axios from "axios";

export const createProvinsi = async (req, res) => {
    try {
        const response = await axios.get(
            "https://wilayah.id/api/provinces.json"
        );
        const provinsi = response.data.data;

        for (const prov of provinsi) {
            await Provinsi.create({
                id: parseInt(prov.code),
                name: prov.name,
            });
        }

        logger.info(`${provinsi.length} provinsi berhasil disimpan`);
        return res.status(201).json({
            success: true,
            message: "Provinsi berhasil dibuat.",
            data: provinsi,
        });
    } catch (error) {
        logger.error("Create provinsi failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllProvinsi = async (req, res) => {
    try {
        const provinsi = await Provinsi.findAll();

        logger.info(`${provinsi.length} provinsi berhasil didapatkan.`);
        return res.status(201).json({
            success: true,
            message: "Provinsi berhasil didapatkan.",
            data: provinsi,
        });
    } catch (error) {
        logger.error("Get provinsi failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
