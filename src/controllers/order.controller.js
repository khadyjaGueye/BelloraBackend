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
        if (
            !customer_name ||
            !customer_phone ||
            !customer_address ||
            !items ||
            items.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'Données invalides'
            });
        }

        const orderId = await orderService.createOrder({
            customer_name,
            customer_phone,
            customer_address,
            total_amount
        });

        await orderService.createOrderItems(
            orderId,
            items
        );

        return res.status(201).json({
            success: true,
            message: 'Commande enregistrée avec succès',
            order_id: orderId
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

module.exports = {
    store
};