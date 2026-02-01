import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";

import { authRoute } from "./routes/auth.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import dotenv from "dotenv";
import { userRoute } from "./routes/user.route.js";
import { fakultasRoute } from "./routes/fakultas.route.js";
import { programStudiRoute } from "./routes/programStudi.route.js";
import biodataRoute from "./routes/biodata.route.js";
import { pertanyaanRoute } from "./routes/pertanyaan.route.js";
import { pilihanJawabanRoute } from "./routes/pilihanJawaban.route.js";
import { masterDataRoute } from "./routes/masterData.route.js";
import { kuesionerRoute } from "./routes/kuesioner.route.js";
import { jawabanKuesionerRoute } from "./routes/jawabanKuesioner.route.js";
import { provinsiRoute } from "./routes/provinsi.route.js";
import { kotaRoute } from "./routes/kota.route.js";
import { lokasiPekerjaanRoute } from "./routes/lokasiPekerjaan.route.js";
import { planRoute } from "./routes/plan.route.js";

dotenv.config();

export const app = express();

app.use(
    cors({
        credentials: true,
        origin: "http://localhost:5173",
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/fakultas", fakultasRoute);
app.use("/api/users", userRoute);
app.use("/api/program-studi", programStudiRoute);
app.use("/api/biodata", biodataRoute);
app.use("/api/pertanyaan", pertanyaanRoute);
app.use("/api/pilihan-jawaban", pilihanJawabanRoute);
app.use("/api/master-data", masterDataRoute);
app.use("/api/kuesioner", kuesionerRoute);
app.use("/api/jawaban-kuesioner", jawabanKuesionerRoute);
app.use("/api/provinsi", provinsiRoute);
app.use("/api/kota", kotaRoute);
app.use("/api/lokasi-pekerjaan", lokasiPekerjaanRoute);
app.use("/api", planRoute);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use(errorMiddleware);
