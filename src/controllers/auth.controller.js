import { logger } from "../config/logger.js";
import { ResponseError } from "../middleware/error.middleware.js";
import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/generateToken.js";
import {
    sendPasswordResetEmail,
    sendResetSuccessEmail,
    sendWelcomeEmail,
} from "../utils/sendEmail.js";
import { loginValidation } from "../validations/auth.validation.js";
import { validate } from "../validations/validation.js";
import { Op } from "sequelize";
import crypto from "crypto";

export const login = async (req, res) => {
    try {
        const loginRequest = validate(loginValidation, req.body);

        const user = await User.findOne({
            where: {
                email: loginRequest.email,
            },
        });

        if (!user) {
            throw new ResponseError(400, "Invalid Credentials");
        }

        const isPasswordValid = await comparePassword(
            loginRequest.password,
            user.password
        );

        if (!isPasswordValid) {
            throw new ResponseError(400, "Invalid Credentials");
        }

        generateToken(res, user);

        await User.update(
            {
                lastLogin: new Date(),
            },
            {
                where: {
                    id: user.id,
                },
            }
        );
        const userWithoutPassword = await User.findByPk(user.id, {
            attributes: ["id", "name", "email", "roleAs", "isVerified"],
        });

        logger.info("Logged in successfully");
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: userWithoutPassword,
        });
    } catch (error) {
        logger.error("Failed to login", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token");

    logger.info("Logged out successfully");
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({
            where: {
                email: email,
            },
        });

        if (!user) {
            throw new ResponseError(400, "User not found");
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

        await User.update(
            {
                resetPasswordToken: resetToken,
                resetPasswordExpiresAt: resetTokenExpiresAt,
            },
            {
                where: {
                    id: user.id,
                },
            }
        );

        await sendPasswordResetEmail(
            user.email,
            `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        );

        logger.info("Password reset link sent successfully");
        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email",
        });
    } catch (error) {
        logger.error("Password reset link failed to send", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpiresAt: {
                    [Op.gt]: new Date(),
                },
            },
        });

        if (!user) {
            throw new ResponseError(400, "Invalid or expired reset token");
        }

        const hashedPassword = await hashPassword(password);

        await User.update(
            {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpiresAt: null,
            },
            {
                where: {
                    id: user.id,
                },
            }
        );

        await sendResetSuccessEmail(user.email);

        logger.info("Password reset success");
        return res.status(200).json({
            success: true,
            message: "Password reset success",
        });
    } catch (error) {
        logger.error("Password reset failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId, {
            attributes: ["id", "name", "email", "roleAs"],
        });

        if (!user) {
            throw new ResponseError(400, "User not found");
        }

        logger.info("Check Auth Success");
        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        logger.error("Failed to check auth", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
