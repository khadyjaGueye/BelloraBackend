const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
const upload = require('../middlewares/upload.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.get('/current', authMiddleware, userController.getCurrentUser);
router.get('/count', authMiddleware, roleMiddleware('admin'), userController.getUserCount);
router.put('/profile', authMiddleware, upload.single('image'), userController.updateProfile);
router.put('/change-password', authMiddleware, userController.changePassword);


module.exports = router;
