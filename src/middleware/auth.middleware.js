import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized - no token provided",
        });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - no token provided",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
