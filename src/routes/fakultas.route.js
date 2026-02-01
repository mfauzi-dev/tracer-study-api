import express from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import {
    createFakultas,
    deleteFakultas,
    detailFakultas,
    getFakultas,
    updateFakultas,
} from "../controllers/fakultas.controller.js";
import { isAdmin, isAdminOrDosen } from "../middleware/role.middleware.js";

const fakultasRoute = express.Router();

fakultasRoute.post("/create", authenticate, isAdmin, createFakultas);
fakultasRoute.patch("/update/:id", authenticate, isAdmin, updateFakultas);
fakultasRoute.get("/detail/:id", authenticate, isAdmin, detailFakultas);
fakultasRoute.get("/", authenticate, isAdminOrDosen, getFakultas);
fakultasRoute.delete("/delete/:id", authenticate, isAdmin, deleteFakultas);

export { fakultasRoute };
