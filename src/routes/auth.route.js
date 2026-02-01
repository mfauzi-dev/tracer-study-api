import express from "express";
import {
    checkAuth,
    forgotPassword,
    login,
    logout,
    resetPassword,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const authRoute = express.Router();

authRoute.get("/check-auth", authenticate, checkAuth);

authRoute.post("/logout", logout);
authRoute.post("/login", login);
authRoute.post("/forgot-password", forgotPassword);
authRoute.post("/reset-password/:token", resetPassword);

export { authRoute };
