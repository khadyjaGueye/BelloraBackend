const authService = require("../services/auth.service");

class AuthController {

    async register(req, res) {
        try {
            const data = await authService.register(req.body);
            res.status(201).json({data});
        } catch (error) {
            res.status(400).json({
                data: {
                    success: false,
                    message: error.message
                }
            });
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

            res.status(401).json({
               data:{
                 success: false,
                message: error.message
               }
            });

        }

    }

    async profile(req, res) {

        try {

            const data = await authService.profile(req.user.id);

            res.json(data);

        } catch (error) {

            res.status(400).json({
                success: false,
                message: error.message
            });

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

            res.status(400).json({
                success: false,
                message: error.message
            });

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

            res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

}

module.exports = new AuthController();