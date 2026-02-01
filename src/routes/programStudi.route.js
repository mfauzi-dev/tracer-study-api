import express from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import { isAdmin } from "../middleware/role.middleware.js";
import {
    createProgramStudi,
    deleteProgramStudi,
    detailProgramStudi,
    getProgramStudi,
    updateProgramStudi,
} from "../controllers/programStudi.controller.js";

const programStudiRoute = express.Router();

programStudiRoute.post("/create", authenticate, isAdmin, createProgramStudi);

programStudiRoute.get("/", authenticate, isAdmin, getProgramStudi);

programStudiRoute.get("/detail/:id", authenticate, isAdmin, detailProgramStudi);

programStudiRoute.patch(
    "/update/:id",
    authenticate,
    isAdmin,
    updateProgramStudi
);

programStudiRoute.delete(
    "/delete/:id",
    authenticate,
    isAdmin,
    deleteProgramStudi
);

export { programStudiRoute };
