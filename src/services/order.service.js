const pool = require('../config/database');

// Création d'une commande (déjà fait)
async function createOrder(order) {
    const [result] = await pool.query(
        `
    INSERT INTO orders
    (
      customer_name,
      customer_phone,
      customer_address,
      total_amount,
      user_id
    )
    VALUES (?, ?, ?, ?, ?)
    `,
        [
            order.customer_name,
            order.customer_phone,
            order.customer_address,
            order.total_amount,
            order.user_id
        ]
    );

    return result.insertId;
}

// Création des items (déjà fait)
async function createOrderItems(orderId, items) {
    for (const item of items) {
        await pool.query(
            `
      INSERT INTO order_items
      (
        order_id,
        product_id,
        quantity,
        price
      )
      VALUES (?, ?, ?, ?)
      `,
            [orderId, item.product_id, item.quantity, item.price]
        );
    }
}

//  Récupérer toutes les commandes avec détails
async function getAllOrders() {
    const [rows] = await pool.query(
        `
    SELECT 
      o.id AS order_id,
      o.customer_name,
      o.customer_phone,
      o.customer_address,
      o.total_amount,
      o.status,
      o.created_at,
      u.first_name AS user_name,
      u.email AS user_email,
      oi.product_id,
      p.name AS product_name,
      oi.quantity,
      oi.price
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    ORDER BY o.created_at DESC
    `
    );

    // Regrouper les items par commande
    const ordersMap = {};
    rows.forEach(row => {
        if (!ordersMap[row.order_id]) {
            ordersMap[row.order_id] = {
                id: row.order_id,
                customer_name: row.customer_name,
                customer_phone: row.customer_phone,
                customer_address: row.customer_address,
                total_amount: row.total_amount,
                status: row.status,
                created_at: row.created_at,
                user: row.user_name ? { name: row.user_name, email: row.user_email } : null,
                items: []
            };
        }
        if (row.product_id) {
            ordersMap[row.order_id].items.push({
                product_id: row.product_id,
                product_name: row.product_name,
                quantity: row.quantity,
                price: row.price
            });
        }
    });

    return Object.values(ordersMap);
}

//Mettre à jour le statut d’une commande
async function updateOrderStatus(orderId, status) {
    const [result] = await pool.query(
        `
    UPDATE orders
    SET status = ?
    WHERE id = ?
    `,
        [status, orderId]
    );
    return result.affectedRows > 0;
}

async function validateOrder(orderId, status) {
    // Vérifier que le statut est bien confirmee ou livree
    if (status !== 'confirmee' && status !== 'livree') {
        throw new Error("Le statut doit être 'confirmee' ou 'livree' pour valider la commande");
    }
    // Récupérer les items de la commande
    const [items] = await pool.query(
        `SELECT product_id, quantity FROM order_items WHERE order_id = ?`,
        [orderId]
    );
    // Diminuer le stock pour chaque produit
    for (const item of items) {
        await pool.query(
            `UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?`,
            [item.quantity, item.product_id, item.quantity]
        );
    }
    // Mettre à jour le statut de la commande
    const [result] = await pool.query(
        `UPDATE orders SET status = ? WHERE id = ?`,
        [status, orderId]
    );
    return result.affectedRows > 0;
}


module.exports = {
    createOrder,
    createOrderItems,
    getAllOrders,
    updateOrderStatus,
    validateOrder
};
