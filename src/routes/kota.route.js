import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";
import {
    createKota,
    getKotaByProvinsi,
} from "../controllers/kota.controller.js";

const kotaRoute = express.Router();

kotaRoute.get("/", authenticate, getKotaByProvinsi);
kotaRoute.post("/create", authenticate, isAdmin, createKota);

export { kotaRoute };
