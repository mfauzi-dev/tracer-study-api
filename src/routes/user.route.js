import express from "express";
import {
    createUser,
    detailProfile,
    detailProfileByAdmin,
    getAllUsers,
    getUserProfile,
    sendVerificationToken,
    updatePassword,
    updateProfile,
    updateUserByAdmin,
    verifyEmail,
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const userRoute = express.Router();

userRoute.post("/create", authenticate, isAdmin, createUser);
userRoute.get("/profile", authenticate, getUserProfile);
userRoute.get("/detail", authenticate, detailProfile);
userRoute.get("/detail/:id", authenticate, isAdmin, detailProfileByAdmin);
userRoute.patch("/password", authenticate, updatePassword);
userRoute.patch("/profile", authenticate, updateProfile);
userRoute.patch("/update-users/:id", authenticate, isAdmin, updateUserByAdmin);
userRoute.get("/", authenticate, isAdmin, getAllUsers);
userRoute.post("/resend-verification", authenticate, sendVerificationToken);
userRoute.post("/verify-email", verifyEmail);

export { userRoute };
