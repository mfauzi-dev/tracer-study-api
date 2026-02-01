export const authorizeRoles = (...roles) => {
    return async (req, res, next) => {
        try {
            const user = req.user;

            if (!user || !roles.includes(user.roleAs)) {
                return res.status(403).json({
                    success: false,
                    message: "Akses ditolak. Role tidak diizinkan.",
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };
};

export const isAdmin = authorizeRoles("admin");
export const isAlumni = authorizeRoles("alumni");
export const isDosen = authorizeRoles("dosen");
export const isAdminOrAlumni = authorizeRoles("admin", "alumni");
export const isAdminOrDosen = authorizeRoles("admin", "dosen");
