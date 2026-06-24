const pool = require('../config/database');

async function findAll() {
    const [rows] = await pool.query(`
        SELECT
            p.*,
            c.name as category_name
        FROM products p
        INNER JOIN categories c
            ON c.id = p.category_id
    `);
    return rows;
}

async function findById(id) {
    const [rows] = await pool.query(
        `
        SELECT *
        FROM products
        WHERE id = ?
        `,
        [id]
    );
    return rows[0];
}

async function create(product) {
    const [result] = await pool.query(
        `
        INSERT INTO products
        (name,description,price,stock,image,category_id )
        VALUES
        (?,?,?, ?,?,?)
        `,
        [product.name, product.description, product.price, product.stock, product.image, product.category_id]
    );
    return result;
}

async function update(id, product) {
    const [result] = await pool.query(
        `
        UPDATE products SET
            name = ?,description = ?,price = ?,stock = ?,image = ?,category_id = ?
            WHERE id = ?
        `,
        [product.name, product.description, product.price, product.stock, product.image, product.category_id, id]
    );
    return result;
}

async function remove(id) {
    const [result] = await pool.query(
        'DELETE FROM products WHERE id = ?',
        [id]
    );
    return result;
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};