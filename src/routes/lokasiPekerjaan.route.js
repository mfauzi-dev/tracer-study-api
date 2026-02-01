import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
    createLokasiPekerjaan,
    deleteLokasiPekerjaan,
    deleteUserLokasiPekerjaan,
    detailLokasiPekerjaan,
    getAllLokasiPekerjaan,
    getUserLokasiPekerjaan,
    updateLokasiPekerjaan,
} from "../controllers/lokasiPekerjaan.controller.js";

const lokasiPekerjaanRoute = express.Router();

lokasiPekerjaanRoute.post("/create", authenticate, createLokasiPekerjaan);
lokasiPekerjaanRoute.get("/detail/:id", authenticate, detailLokasiPekerjaan);
lokasiPekerjaanRoute.patch("/update/:id", authenticate, updateLokasiPekerjaan);
lokasiPekerjaanRoute.get("/", authenticate, getUserLokasiPekerjaan);
lokasiPekerjaanRoute.get("/all", authenticate, getAllLokasiPekerjaan);
lokasiPekerjaanRoute.delete(
    "/delete/:id",
    authenticate,
    deleteUserLokasiPekerjaan
);

lokasiPekerjaanRoute.delete(
    "/all/delete/:id",
    authenticate,
    deleteLokasiPekerjaan
);

export { lokasiPekerjaanRoute };
