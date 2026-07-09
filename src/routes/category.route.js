const express = require('express');

const router = express.Router();

const categoryController = require('../controllers/category.controller');
const upload = require('../middlewares/upload.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.get('/', categoryController.getAll);
router.post('/', authMiddleware, roleMiddleware('admin'), categoryController.create);
router.get('/:id', categoryController.getById);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.remove);

module.exports = router;