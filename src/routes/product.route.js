const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const upload = require('../middlewares/upload.middleware');

router.get('/', productController.getAll);
router.get('/:id', productController.getById);

router.post('/', upload.single('image'), productController.create);
router.post('/upload', upload.single('image'), productController.uploadImage);
router.put('/:id', upload.single('image'), productController.update);
router.delete('/:id',productController.remove);

module.exports = router;