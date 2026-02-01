import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { isAdmin, isAlumni } from "../middleware/role.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import {
    createBiodata,
    deleteBiodata,
    getAllBiodata,
    getMyBiodata,
    getUserBiodata,
    updateBiodata,
} from "../controllers/biodata.controller.js";

const biodataRoute = express.Router();

biodataRoute.post(
    "/create",
    authenticate,
    isAlumni,
    upload.single("image"),
    createBiodata
);

biodataRoute.patch(
    "/update",
    authenticate,
    isAlumni,
    upload.single("image"),
    updateBiodata
);

biodataRoute.delete("/delete/:id", authenticate, isAdmin, deleteBiodata);

biodataRoute.get("/me", authenticate, isAlumni, getMyBiodata);
biodataRoute.get("/:id", authenticate, isAdmin, getUserBiodata);
biodataRoute.get("/", authenticate, isAdmin, getAllBiodata);

export default biodataRoute;
