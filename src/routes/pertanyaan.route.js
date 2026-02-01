import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { isAdmin, isAdminOrDosen } from "../middleware/role.middleware.js";
import {
    copyPertanyaanByTahunAkademik,
    createPertanyaan,
    deletePertanyaan,
    detailPertanyaan,
    getAllPertanyaan,
    updatePertanyaan,
    updateStatusByTahunAkademik,
} from "../controllers/pertanyaan.controller.js";

const pertanyaanRoute = express.Router();

pertanyaanRoute.post("/create", authenticate, isAdmin, createPertanyaan);
pertanyaanRoute.get("/", authenticate, isAdminOrDosen, getAllPertanyaan);
pertanyaanRoute.patch("/update/:id", authenticate, isAdmin, updatePertanyaan);
pertanyaanRoute.delete("/delete/:id", authenticate, isAdmin, deletePertanyaan);
pertanyaanRoute.post(
    "/copy",
    authenticate,
    isAdmin,
    copyPertanyaanByTahunAkademik
);

pertanyaanRoute.patch(
    "/update-status",
    authenticate,
    isAdmin,
    updateStatusByTahunAkademik
);

pertanyaanRoute.get("/detail/:id", authenticate, isAdmin, detailPertanyaan);

export { pertanyaanRoute };
