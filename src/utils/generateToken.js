import jwt from "jsonwebtoken";

export const generateToken = (res, user) => {
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        roleAs: user.roleAs,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("token", token, {
        httpOnly: true, // XSS
        secure: process.env.NODE_ENV === "production", // only works in http
        sameSite: "strict", // csrf
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return token;
};
