const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const upload = require('../middlewares/upload.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// router.post('/create', authMiddleware, roleMiddleware('admin'), productController.createProduct);
// router.put('/:id', authMiddleware, roleMiddleware('admin'), productController.updateProduct);
// router.delete('/:id', authMiddleware, roleMiddleware('admin'), productController.deleteProduct);

router.post('/', authMiddleware, roleMiddleware('admin'), upload.single('image'), productController.create);
router.post('/upload', authMiddleware, roleMiddleware('admin'), upload.single('image'), productController.uploadImage);
router.put('/:id', authMiddleware, roleMiddleware('admin'), upload.single('image'), productController.update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), productController.remove);

module.exports = router;