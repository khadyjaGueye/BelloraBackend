const authService = require("../services/auth.service");

class AuthController {

    async register(req, res) {
        try {
            const data = await authService.register(req.body);
            res.status(201).json({ data });
        } catch (error) {
            next(error); // délègue au middleware global
        }
    }

    async login(req, res) {
        try {
            const data = await authService.login(
                req.body.email,
                req.body.password
            );
            res.status(200).json({ data });
        } catch (error) {
            next(error); // délègue au middleware global
        }
    }

    async profile(req, res) {
        try {
            const data = await authService.profile(req.user.id);
            res.json(data);
        } catch (error) {
            next(error); // délègue au middleware global
        }
    }

    async updateProfile(req, res) {
        try {
            const result = await authService.updateProfile(
                req.user.id,
                req.body
            );
            res.json({
                data: {
                    success: true,
                    message: "Profil mis à jour.",
                    user: result
                }
            });

        } catch (error) {
            next(error); // délègue au middleware global
        }
    }

    async changePassword(req, res) {
        try {
            const result = await authService.changePassword(
                req.user.id,
                req.body.oldPassword,
                req.body.newPassword
            );
            res.json(result);

        } catch (error) {
            next(error); // délègue au middleware global
        }
    }
}

module.exports = new AuthController();