import { Op } from "sequelize";
import sequelize from "../config/database.js";
import { logger } from "../config/logger.js";
import { ResponseError } from "../middleware/error.middleware.js";
import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/generateToken.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../utils/sendEmail.js";
import {
    createUserValidation,
    updatePasswordValidation,
    updateProfileByAdminValidation,
    updateProfileValidation,
} from "../validations/user.validation.js";
import { validate } from "../validations/validation.js";

export const createUser = async (req, res) => {
    try {
        const user = validate(createUserValidation, req.body);

        const userAlreadyExists = await User.findOne({
            where: {
                email: user.email,
            },
        });

        if (userAlreadyExists) {
            throw new ResponseError(400, "User already exists");
        }

        const hashedPassword = await hashPassword(user.password);

        const result = await User.create({
            email: user.email,
            password: hashedPassword,
            name: user.name,
            nomor_induk: user.nomorInduk,
            roleAs: user.roleAs,
            fakultasId: user.fakultasId,
            programStudiId: user.programStudiId,
        });

        if (user.roleAs !== "alumni") {
            result.isVerified = true;
            await result.save();
        }

        const { password: undefined, ...userWithoutPassword } = result.toJSON();

        logger.info("User created successfully");
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            result: userWithoutPassword,
        });
    } catch (error) {
        logger.error("User registration failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const passwordRequest = validate(updatePasswordValidation, req.body);

        if (passwordRequest.newPassword !== passwordRequest.confirmPassword) {
            throw new ResponseError(
                404,
                "New password and confirm password do not match"
            );
        }

        const user = await User.findByPk(userId);

        const isMatch = await comparePassword(
            passwordRequest.oldPassword,
            user.password
        );

        if (!isMatch) {
            throw new ResponseError(404, "Your old password is wrong");
        }

        const hashedPassword = await hashPassword(passwordRequest.newPassword);

        await User.update(
            {
                password: hashedPassword,
            },
            {
                where: {
                    id: user.id,
                },
            }
        );

        logger.info("User updated password successfully");
        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        logger.error("Failed to updated password", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const detailProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId);

        logger.info("Get User profile successfully");
        return res.status(200).json({
            success: true,
            message: "Get user profile successfully",
            data: user,
        });
    } catch (error) {
        logger.error("Get user profile failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const detailProfileByAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);

        await user.save();

        logger.info("Get User profile successfully");
        return res.status(200).json({
            success: true,
            message: "Get user profile successfully",
            data: user,
        });
    } catch (error) {
        logger.error("Get user profile failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profileRequest = validate(updateProfileValidation, req.body);

        const user = await User.findByPk(userId);

        user.name = profileRequest.name ?? user.name;

        await user.save();

        logger.info("User updated profile successfully");
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            isVerified: user.isVerified,
        });
    } catch (error) {
        logger.error("Failed to updated profile", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId, {
            attributes: [
                "id",
                "name",
                "email",
                "isVerified",
                "roleAs",
                "nomor_induk",
            ],
        });

        logger.info("Get user profile successfully");
        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        logger.error("Failed to get user profile", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateUserByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const profileRequest = validate(
            updateProfileByAdminValidation,
            req.body
        );

        const user = await User.findByPk(id);

        user.name = profileRequest.name ?? user.name;
        user.nomor_induk = profileRequest.nomorInduk ?? user.nomor_induk;
        user.fakultasId = profileRequest.fakultasId ?? user.fakultasId;
        user.programStudiId =
            profileRequest.programStudiId ?? user.programStudiId;

        await user.save();

        logger.info("User updated profile By Admin successfully");
        return res.status(200).json({
            success: true,
            message: "Profile updated By Admin successfully",
        });
    } catch (error) {
        logger.error("Failed to updated profile by admin", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const {
            fakultasId = "",
            programStudiId = "",
            isVerified = "",
            search = "",
            page = 1,
            perPage = 10,
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(perPage);

        const limit = parseInt(perPage);

        const fakultasFilter = fakultasId ? parseInt(fakultasId) : null;
        const programStudiFilter = programStudiId
            ? parseInt(programStudiId)
            : null;
        const isVerifiedFilter =
            isVerified !== "" ? parseInt(isVerified) : null;
        const searchQuery = `%${search || ""}%`;

        // get user data
        const data = await sequelize.query(
            `
            SELECT u.id, u.name, u.nomor_induk, u.email, u.roleAs, u.isVerified, 
                f.name as fakultas_name, p.name as program_studi_name
            
            FROM user u
            LEFT JOIN fakultas f ON f.id = u.fakultasId
            LEFT JOIN programStudi p ON p.id = u.programStudiId
            WHERE ( :fakultasFilter IS NULL OR u.fakultasId = :fakultasFilter )
                AND ( :programStudiFilter IS NULL OR u.programStudiId = :programStudiFilter )
                AND ( :isVerifiedFilter IS NULL OR u.isVerified = :isVerifiedFilter )
                AND ( u.name LIKE :searchQuery OR u.nomor_induk LIKE :searchQuery )
            ORDER BY u.isVerified DESC
            LIMIT :limit OFFSET :offset
            `,
            {
                replacements: {
                    fakultasFilter,
                    programStudiFilter,
                    isVerifiedFilter,
                    searchQuery,
                    limit,
                    offset,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        // total
        const [countResult] = await sequelize.query(
            `
            SELECT COUNT(*) AS total
            FROM user u
            LEFT JOIN fakultas f ON f.id = u.fakultasId
            LEFT JOIN programStudi p ON p.id = u.programStudiId
            WHERE ( :fakultasFilter IS NULL OR u.fakultasId = :fakultasFilter )
                AND ( :programStudiFilter IS NULL OR u.programStudiId = :programStudiFilter )
                AND ( :isVerifiedFilter IS NULL OR u.isVerified = :isVerifiedFilter )
                AND ( u.name LIKE :searchQuery OR u.nomor_induk LIKE :searchQuery )
            `,
            {
                replacements: {
                    fakultasFilter,
                    programStudiFilter,
                    isVerifiedFilter,
                    searchQuery,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const total = Number(countResult.total || 0);

        logger.info("Get all users successfully");
        return res.status(200).json({
            success: true,
            message: "Semua user berhasil didapatkan.",
            currentPage: parseInt(page),
            perPage: limit,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data,
        });
    } catch (error) {
        logger.error("Get all users failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const sendVerificationToken = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId);

        if (user.isVerified === 1) {
            throw new ResponseError(400, "Email sudah diverifikasi.");
        }

        const verificationToken = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const verificationTokenExpiresAt = new Date(
            Date.now() + 24 * 60 * 60 * 1000
        );

        user.verificationToken = verificationToken;
        user.verificationTokenExpiresAt = verificationTokenExpiresAt;

        user.save();

        const userWithoutPassword = await User.findByPk(user.id, {
            attributes: [
                "email",
                "isVerified",
                "verificationToken",
                "verificationTokenExpiresAt",
            ],
        });

        await sendVerificationEmail(user.email, verificationToken);

        logger.info("Send verification token successfully");
        return res.status(200).json({
            success: true,
            message: "Send verification token successfully",
            data: userWithoutPassword,
        });
    } catch (error) {
        logger.error("Send verification token failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { code } = req.body;

        const user = await User.findOne({
            where: {
                verificationToken: code,
                verificationTokenExpiresAt: {
                    [Op.gt]: new Date(),
                },
            },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code",
            });
        }

        await User.update(
            {
                isVerified: true,
                verificationToken: null,
                verificationTokenExpiresAt: null,
            },
            {
                where: {
                    id: user.id,
                },
            }
        );

        await sendWelcomeEmail(user.email, user.name);

        const userWithoutPassword = await User.findByPk(user.id, {
            attributes: ["id", "name", "email", "isVerified"],
        });

        logger.info("Email verified successfully");
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: userWithoutPassword,
        });
    } catch (error) {
        logger.error("Email verification failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
