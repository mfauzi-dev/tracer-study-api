import { logger } from "../config/logger.js";
import { ResponseError } from "../middleware/error.middleware.js";
import Kota from "../models/Kota.js";
import Provinsi from "../models/Provinsi.js";
import axios from "axios";

export const createKota = async (req, res) => {
    try {
        const provinsiList = await Provinsi.findAll();
        let allKota = [];

        for (const prov of provinsiList) {
            const response = await axios.get(
                `https://wilayah.id/api/regencies/${prov.id}.json`
            );
            const kotaList = response.data.data;

            for (const kt of kotaList) {
                const kotaId = kt.code;
                const provId = parseInt(prov.id);

                await Kota.findOrCreate({
                    where: {
                        id: kotaId,
                        provinsi_id: provId,
                    },
                    defaults: {
                        name: kt.name,
                    },
                });

                allKota.push({
                    id: kotaId,
                    provinsi_id: provId,
                    name: kt.name,
                });
            }
        }

        logger.info(`${allKota.length} kota berhasil disimpan`);
        return res.status(201).json({
            success: true,
            message: "Kota berhasil dibuat",
            total: allKota.length,
            data: allKota,
        });
    } catch (error) {
        logger.error("Create kota failed", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getKotaByProvinsi = async (req, res) => {
    try {
        const { provinsi_id } = req.query;

        if (!provinsi_id) {
            throw new ResponseError(400, "Provinsi harus dipilih.");
        }

        const kota = await Kota.findAll({
            where: {
                provinsi_id: provinsi_id,
            },

            attributes: ["id", "name"],
            orderBy: [["name", "asc"]],
        });

        logger.info(`${kota.length} kota berhasil didapatkan.`);
        return res.status(201).json({
            success: true,
            message: "Kota berhasil didapatkan.",
            data: kota,
        });
    } catch (error) {
        logger.error("Get kota failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
