const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
const upload = require('../middlewares/upload.middleware');

// Mise à jour du profil utilisateur avec image
router.put('/profile', authMiddleware, upload.single('image'), userController.updateProfile);

// Récupération de l’utilisateur connecté
router.get('/current', authMiddleware, userController.getCurrentUser);
router.put('/change-password', authMiddleware, userController.changePassword);

module.exports = router;
