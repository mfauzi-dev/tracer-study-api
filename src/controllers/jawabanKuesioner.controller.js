import puppeteer from "puppeteer";
import sequelize from "../config/database.js";
import { logger } from "../config/logger.js";
import JawabanKuesioner from "../models/JawabanKuesioner.js";
import { jawabanKuesionerTemplate } from "../templates/jawabanKuesionerTemplate.js";
import fs from "fs";
import path from "path";

export const getAllJawabanKuesioner = async (req, res) => {
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
                SELECT j.id, j.jawaban_teks, j.tahun_akademik,
                    u.id as user_id, u.name as user_name,
                    p.id as pertanyaan_id, p.name as pertanyaan_name,
                    t.id as pilihan_jawaban_id, t.name as pilihan_jawaban_name
                FROM jawaban_kuesioner j
                JOIN user u ON u.id = j.userId
                JOIN pertanyaan p ON p.id = j.pertanyaanId
                LEFT JOIN pilihan_jawaban t ON t.id = j.pilihanJawabanId
                WHERE ( :tahunAkademikFilter IS NULL OR j.tahun_akademik = :tahunAkademikFilter )
                    AND ( :pertanyaanFilter IS NULL OR p.id = :pertanyaanFilter )
                    AND ( u.name LIKE :searchQuery 
                        OR p.name LIKE :searchQuery 
                        OR t.name LIKE :searchQuery 
                        OR j.jawaban_teks LIKE :searchQuery )
                ORDER BY j.id DESC
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
                FROM jawaban_kuesioner j
                JOIN user u ON u.id = j.userId
                JOIN pertanyaan p ON p.id = j.pertanyaanId
                JOIN pilihan_jawaban t ON t.id = j.pilihanJawabanId
                WHERE ( :tahunAkademikFilter IS NULL OR j.tahun_akademik = :tahunAkademikFilter )
                    AND ( :pertanyaanFilter IS NULL OR p.id = :pertanyaanFilter )
                    AND ( u.name LIKE :searchQuery 
                        OR p.name LIKE :searchQuery 
                        OR t.name LIKE :searchQuery 
                        OR j.jawaban_teks LIKE :searchQuery)
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

        logger.info("Get all jawaban kuesioner successfully");
        return res.status(200).json({
            success: true,
            message: "Semua jawaban kuesioner berhasil didapatkan.",
            currentPage: parseInt(page),
            perPage: limit,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data,
        });
    } catch (error) {
        logger.error("Get all jawaban kuesioner failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const generateJawabanKuesionerPDF = async (req, res) => {
    try {
        const { tahun_akademik } = req.params;

        const tahunAkademik = tahun_akademik.replace("-", "/");

        if (!tahunAkademik) {
            return res.status(400).json({
                success: false,
                message: "Tahun akademik wajib diisi.",
            });
        }

        const jawabanList = await sequelize.query(
            `
                SELECT j.id, j.jawaban_teks, j.tahun_akademik,
                    u.id as user_id, u.name as user_name,
                    p.id as pertanyaan_id, p.name as pertanyaan_name,
                    t.id as pilihan_jawaban_id, t.name as pilihan_jawaban_name
                FROM jawaban_kuesioner j
                JOIN user u ON u.id = j.userId
                JOIN pertanyaan p ON p.id = j.pertanyaanId
                LEFT JOIN pilihan_jawaban t ON t.id = j.pilihanJawabanId
                WHERE ( j.tahun_akademik = :tahun_akademik )
                ORDER BY j.id DESC
                `,
            {
                replacements: {
                    tahun_akademik: tahunAkademik,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (!jawabanList || jawabanList.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Tidak ada jawaban ditemukan untuk tahun akademik ${tahun_akademik}`,
            });
        }

        let rows = "";
        jawabanList.forEach((dt, index) => {
            const jawabanText =
                dt.pilihan_jawaban_name || dt.jawaban_teks || "-";

            rows += `
        <tr>
          <td>${index + 1}</td>
          <td>${dt.user_name}</td>
          <td>${dt.pertanyaan_name}</td>
          <td>${jawabanText}</td>
        </tr>
      `;
        });

        // Ambil HTML dari template
        const html = jawabanKuesionerTemplate(rows, tahun_akademik);

        // Generate PDF
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const tempPath = path.join(
            process.cwd(),
            `jawaban_kuesioner_${tahun_akademik.replace("/", "-")}.pdf`
        );

        await page.pdf({
            path: tempPath,
            format: "A4",
            printBackground: true,
            margin: {
                top: "20px",
                bottom: "20px",
                left: "20px",
                right: "20px",
            },
        });

        await browser.close();

        const pdfBuffer = fs.readFileSync(tempPath);
        fs.unlinkSync(tempPath); // hapus file setelah dibaca

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename=jawaban_kuesioner_${tahun_akademik.replace(
                "/",
                "-"
            )}.pdf`,
            "Content-Length": pdfBuffer.length,
        });

        res.send(pdfBuffer);
        logger.info(
            `PDF jawaban kuesioner tahun ${tahun_akademik} berhasil digenerate`
        );
    } catch (error) {
        logger.error("Generate PDF jawaban kuesioner gagal", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
