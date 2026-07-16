const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getOrderById(orderId) {
    const order = await prisma.order.findUnique({
        where: { id: Number(orderId) },
        include: {
            user: { select: { first_name: true, email: true } },
            items: {
                include: {
                    product: { select: { name: true } }
                }
            }
        }
    });

    if (!order) return null;

    return {
        id: order.id,
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        customer_address: order.customer_address,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
        user: order.user ? { name: order.user.first_name, email: order.user.email } : null,
        items: order.items.map(i => ({
            product_id: i.product_id,
            product_name: i.product.name,
            quantity: i.quantity,
            price: i.price
        }))
    };
}

// Créer une commande
async function createOrder(order) {
    const newOrder = await prisma.order.create({
        data: {
            customer_name: order.customer_name,
            customer_phone: order.customer_phone,
            customer_address: order.customer_address,
            total_amount: order.total_amount,
            user_id: order.user_id || null,
        }
    });
    return newOrder.id;
}

// Créer les items
async function createOrderItems(orderId, items) {
    await prisma.orderItem.createMany({
        data: items.map(item => ({
            order_id: orderId,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        }))
    });
}

// Récupérer toutes les commandes avec détails
async function getAllOrders() {
    const orders = await prisma.order.findMany({
        include: {
            user: { select: { first_name: true, email: true } },
            items: {
                include: {
                    product: { select: { name: true } }
                }
            }
        },
        orderBy: { created_at: 'desc' }
    });

    return orders.map(o => ({
        id: o.id,
        customer_name: o.customer_name,
        customer_phone: o.customer_phone,
        customer_address: o.customer_address,
        total_amount: o.total_amount,
        status: o.status,
        created_at: o.created_at,
        user: o.user ? { name: o.user.first_name, email: o.user.email } : null,
        items: o.items.map(i => ({
            product_id: i.product_id,
            product_name: i.product.name,
            quantity: i.quantity,
            price: i.price
        }))
    }));
}

// Mettre à jour le statut
async function updateOrderStatus(orderId, status) {
    const updated = await prisma.order.update({
        where: { id: Number(orderId) },
        data: { status }
    });
    return !!updated;
}

// Valider une commande
async function validateOrder(orderId, status) {
    if (status !== 'confirmee' && status !== 'livree') {
        throw new Error("Le statut doit être 'confirmee' ou 'livree'");
    }

    const items = await prisma.orderItem.findMany({
        where: { order_id: Number(orderId) }
    });

    for (const item of items) {
        await prisma.product.update({
            where: { id: item.product_id },
            data: {
                stock: { decrement: item.quantity }
            }
        });
    }

    const updated = await prisma.order.update({
        where: { id: Number(orderId) },
        data: { status }
    });

    return !!updated;
}

// Compter toutes les commandes
async function countAllOrders() {
    return await prisma.order.count();
}

// Compter par statut
async function countOrdersByStatus(status) {
    return await prisma.order.count({
        where: { status }
    });
}

// Compter tous les clients distincts (via customer_phone)
async function countClients() {
  return await prisma.order.count(); // grâce au @unique, chaque phone est unique
}


module.exports = {
    getOrderById,
    createOrder,
    createOrderItems,
    getAllOrders,
    updateOrderStatus,
    validateOrder,
    countAllOrders,
    countOrdersByStatus,
    countClients
};
