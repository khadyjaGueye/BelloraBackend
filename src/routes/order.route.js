const express = require('express');

const router = express.Router();
module.exports = router;
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const optionalAuth = require('../middlewares/optionalAuth.middleware');

// Récupérer toutes les commandes (admin uniquement)
router.get('/', authMiddleware, roleMiddleware('admin'), orderController.getAll);
router.get('/count', authMiddleware, roleMiddleware('admin'), orderController.getOrderCount);
//Récupérer une commande par ID (admin uniquement)
router.get('/count/clients',authMiddleware, roleMiddleware('admin'), orderController.getClientCount);

// Liste des commandes avec leurs produits
router.get("/with-products", authMiddleware, roleMiddleware('admin'), orderController.getAllOrdersWithProducts);
router.get('/:id', authMiddleware, roleMiddleware('admin'), orderController.getOne);
// Mettre à jour le statut d’une commande (admin uniquement)
router.put('/:id/', authMiddleware, roleMiddleware('admin'), orderController.updateStatus);
router.get('/count/:status', authMiddleware, roleMiddleware('admin'), orderController.getOrderCountByStatus);

router.post('/', optionalAuth, orderController.store);

module.exports = router;
