import sequelize from "../config/database.js";
import { logger } from "../config/logger.js";
import { ResponseError } from "../middleware/error.middleware.js";

export const getTahunAkademik = async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `
            SELECT DISTINCT tahun_akademik
            FROM Pertanyaan
            ORDER BY tahun_akademik ASC
            `
        );

        logger.info("Get tahun akademik successfully");
        res.status(200).json({
            success: true,
            message: "Tahun akademik berhasil didapatkan.",
            data: result,
        });
    } catch (error) {
        logger.error("Get tahun akademik failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getPertanyaanByTahunAkademik = async (req, res) => {
    try {
        const { tahun_akademik } = req.query;

        if (!tahun_akademik) {
            return res.status(200).json({
                success: true,
                message: "Tidak ada pertanyaan untuk tahun ini",
                data: [],
            });
        }

        const data = await sequelize.query(
            `
            SELECT p.id, p.name, p.tahun_akademik
            FROM pertanyaan p
            WHERE ( p.tahun_akademik = :tahun_akademik )
            ORDER BY p.id ASC
            `,
            {
                replacements: {
                    tahun_akademik,
                },

                type: sequelize.QueryTypes.SELECT,
            }
        );
        logger.info("Get pertanyaan by tahun akademik successfully");
        res.status(200).json({
            success: true,
            message: "Semua pertanyaan berhasil didapatkan.",
            data,
        });
    } catch (error) {
        logger.error("Get pertanyaan by tahun akademik failed", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getPertanyaanByStatus = async (req, res) => {
    try {
        let { page = 1, perPage = 10 } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(perPage);

        const limit = parseInt(perPage);

        const data = await sequelize.query(
            `
            SELECT p.id, p.name, p.tahun_akademik, p.status
            FROM pertanyaan p
            WHERE ( p.status = 1)
            ORDER BY p.tahun_akademik ASC
            LIMIT :limit OFFSET :offset
            `,
            {
                replacements: {
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
            WHERE ( p.status = 1)
            `,
            {
                type: sequelize.QueryTypes.SELECT,
            }
        );
        const total = Number(countResult.total || 0);

        logger.info("Get pertanyaan by status successfully");
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
        logger.error("Get pertanyaan by status failed", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
