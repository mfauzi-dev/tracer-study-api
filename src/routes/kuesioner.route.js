import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
    createJawabanKuesioner,
    detailPertanyaanKuesioner,
    updateJawabanKuesioner,
} from "../controllers/kuesioner.controller.js";

const kuesionerRoute = express.Router();

kuesionerRoute.post(
    "/:pertanyaanId/jawaban",
    authenticate,
    createJawabanKuesioner
);

kuesionerRoute.get(
    "/:pertanyaanId/jawaban",
    authenticate,
    detailPertanyaanKuesioner
);

kuesionerRoute.patch(
    "/:pertanyaanId/jawaban",
    authenticate,
    updateJawabanKuesioner
);

export { kuesionerRoute };
