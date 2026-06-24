const pool = require('../config/database');

async function findAll() {
    const [rows] = await pool.query(
        'SELECT * FROM categories'
    );
    return rows;
}

async function findById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM categories WHERE id = ?',
        [id]
    );
    return rows[0];
}

async function create(category) {
    const [result] = await pool.query(
        `
        INSERT INTO categories
        (name,description,image )
        VALUES
        (?,?,?)
        `,
        [
            category.name,
            category.description,
            category.image
        ]
    );
    return result;
}

async function update(id, category) {

    const [result] = await pool.query(
        `
        UPDATE categories
        SET
            name = ?,
            description = ?,
             image = ?
        WHERE id = ?
        `,
        [
            category.name,
            category.description,
            category.image,
            id
        ]
    );
    return result;
}

async function remove(id) {
    const [result] = await pool.query(
        'DELETE FROM categories WHERE id = ?',
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