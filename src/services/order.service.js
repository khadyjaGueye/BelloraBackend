const pool = require('../config/database');

async function createOrder(order) {

    const [result] = await pool.query(
        `
        INSERT INTO orders
        (
            customer_name,
            customer_phone,
            customer_address,
            total_amount
        )
        VALUES
        (?, ?, ?, ?)
        `,
        [
            order.customer_name,
            order.customer_phone,
            order.customer_address,
            order.total_amount
        ]
    );

    return result.insertId;
}

async function createOrderItems(
    orderId,
    items
) {

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
            VALUES
            (?, ?, ?, ?)
            `,
            [
                orderId,
                item.product_id,
                item.quantity,
                item.price
            ]
        );

    }

}

module.exports = {
    createOrder,
    createOrderItems
};