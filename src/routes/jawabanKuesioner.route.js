import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";
import {
    generateJawabanKuesionerPDF,
    getAllJawabanKuesioner,
} from "../controllers/jawabanKuesioner.controller.js";

const jawabanKuesionerRoute = express.Router();

jawabanKuesionerRoute.get("/", authenticate, isAdmin, getAllJawabanKuesioner);
jawabanKuesionerRoute.get("/pdf/:tahun_akademik", generateJawabanKuesionerPDF);

export { jawabanKuesionerRoute };
