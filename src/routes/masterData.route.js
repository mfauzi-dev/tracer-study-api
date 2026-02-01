import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
    getPertanyaanByStatus,
    getPertanyaanByTahunAkademik,
    getTahunAkademik,
} from "../controllers/masterData.controller.js";

const masterDataRoute = express.Router();

masterDataRoute.get("/tahun-akademik", authenticate, getTahunAkademik);
masterDataRoute.get("/pertanyaan", authenticate, getPertanyaanByTahunAkademik);
masterDataRoute.get("/kuesioner", authenticate, getPertanyaanByStatus);

export { masterDataRoute };
