const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const upload = require('../middlewares/upload.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// Liste des produits
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Création d’un produit avec image
router.post('/', authMiddleware, roleMiddleware('admin'), upload.single('image'), productController.create);

// Upload d’une image seule
// router.post('/upload', authMiddleware, roleMiddleware('admin'), upload.single('image'), productController.uploadImage);

// Mise à jour d’un produit
router.put('/:id', authMiddleware, roleMiddleware('admin'), upload.single('image'), productController.update);

// Suppression d’un produit
router.delete('/:id', authMiddleware, roleMiddleware('admin'), productController.remove);

module.exports = router;
