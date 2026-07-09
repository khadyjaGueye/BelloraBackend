module.exports = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                data: {
                    success: false,
                    message: "Utilisateur non authentifié."
                }
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                data: {
                    success: false,
                    message: "Vous n'avez pas les droits nécessaires."
                }
            });
        }
        next();
    };
};