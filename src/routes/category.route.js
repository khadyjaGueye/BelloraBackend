const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const upload = require('../middlewares/upload.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

module.exports = router;

router.get('/', categoryController.getAll);
router.post("/", authMiddleware, roleMiddleware("admin"), upload.single("image"), categoryController.create);
router.get('/:id', categoryController.getById);
router.put('/:id',authMiddleware, roleMiddleware("admin"), categoryController.update);
router.delete('/:id',authMiddleware, roleMiddleware("admin"), categoryController.remove);

module.exports = router;