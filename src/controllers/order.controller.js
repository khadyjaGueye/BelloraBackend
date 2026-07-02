const orderService = require('../services/order.service');

async function store(req, res) {
    try {
        const {
            customer_name,
            customer_phone,
            customer_address,
            total_amount,
            items
        } = req.body;

        if (!customer_name || !customer_phone || !customer_address || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Données invalides'
            });
        }
        // Récupérer user_id depuis le token si connecté
        let userId = null;
        if (req.user && req.user.id) {
            userId = req.user.id;
        }
        console.log(userId);
        const orderId = await orderService.createOrder({
            customer_name,
            customer_phone,
            customer_address,
            total_amount,
            user_id: userId
        });
        await orderService.createOrderItems(orderId, items);
        return res.status(201).json({
            data: {
                success: true,
                message: 'Commande enregistrée avec succès',
                order_id: orderId
            }
        });
    } catch (error) {
        return res.status(500).json({
            data: {
                success: false,
                message: error.message
            }
        });
    }
}

async function getAll(req, res) {
    try {
        const orders = await orderService.getAllOrders();
        return res.json({
            data: {
                success: true,
                orders: orders
            }
        });
    } catch (error) {
        return res.status(500).json({
            data: {
                success: false,
                message: error.message
            }
        });
    }
}

async function updateStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        let updated;
        if (status === 'confirmee' || status === 'livree') {
            updated = await orderService.validateOrder(id, status);
        } else {
            updated = await orderService.updateOrderStatus(status, id);
        }

        if (!updated) {
            return res.status(404).json({
                data: { success: false, message: 'Commande non trouvée' }
            });
        }

        return res.json({
            data: { success: true, message: 'Statut mis à jour avec succès' }
        });
    } catch (error) {
        return res.status(500).json({
            data: { success: false, message: error.message }
        });
    }
}

module.exports = {
    getAll,
    updateStatus,
    store
};