import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";
import {
    createProvinsi,
    getAllProvinsi,
} from "../controllers/provinsi.controller.js";

const provinsiRoute = express.Router();

provinsiRoute.post("/create", authenticate, isAdmin, createProvinsi);
provinsiRoute.get("/", authenticate, getAllProvinsi);

export { provinsiRoute };
