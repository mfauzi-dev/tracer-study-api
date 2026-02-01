import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { isAdmin, isAdminOrDosen } from "../middleware/role.middleware.js";
import {
    createPilihanJawaban,
    deletePilihanJawaban,
    detailPilihanJawaban,
    getAllPilihanJawaban,
    updatePilihanJawaban,
} from "../controllers/pilihanJawaban.controller.js";

const pilihanJawabanRoute = express.Router();

pilihanJawabanRoute.post(
    "/create",
    authenticate,
    isAdmin,
    createPilihanJawaban
);

pilihanJawabanRoute.get(
    "/",
    authenticate,
    isAdminOrDosen,
    getAllPilihanJawaban
);

pilihanJawabanRoute.patch(
    "/detail/:id",
    authenticate,
    isAdmin,
    detailPilihanJawaban
);

pilihanJawabanRoute.patch(
    "/update/:id",
    authenticate,
    isAdmin,
    updatePilihanJawaban
);

pilihanJawabanRoute.delete(
    "/delete/:id",
    authenticate,
    isAdmin,
    deletePilihanJawaban
);

export { pilihanJawabanRoute };
