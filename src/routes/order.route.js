const express = require('express');

const router = express.Router();
module.exports = router;
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const optionalAuth = require('../middlewares/optionalAuth.middleware');

router.post('/', optionalAuth, orderController.store);
// router.post('/', orderController.store);

// Récupérer toutes les commandes (admin uniquement)
router.get('/', authMiddleware, roleMiddleware('admin'), orderController.getAll);

// Mettre à jour le statut d’une commande (admin uniquement)
router.put('/:id/', authMiddleware, roleMiddleware('admin'), orderController.updateStatus);

module.exports = router;
