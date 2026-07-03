const db = require('../config/database');
const bcrypt = require('bcrypt');

exports.updateProfile = async (id, data) => {
    const fields = [];
    const values = [];

    if (data.first_name !== undefined) {
        fields.push('first_name = ?');
        values.push(data.first_name);
    }
    if (data.last_name !== undefined) {
        fields.push('last_name = ?');
        values.push(data.last_name);
    }
    if (data.phone !== undefined) {
        fields.push('phone = ?');
        values.push(data.phone);
    }
    if (data.address !== undefined) {
        fields.push('address = ?');
        values.push(data.address);
    }
    if (data.image !== undefined) {
        fields.push('image = ?');
        values.push(data.image);
    }

    // toujours mettre à jour updated_at
    fields.push('updated_at = NOW()');

    const updateQuery = `
    UPDATE users 
    SET ${fields.join(', ')}
    WHERE id = ?
  `;

    values.push(id);

    await db.query(updateQuery, values);

    // Récupérer l'utilisateur mis à jour
    const [rows] = await db.query(`
    SELECT id, first_name, last_name, email, phone, role, image, is_active, created_at, updated_at 
    FROM users WHERE id = ?
  `, [id]);

    if (rows.length === 0) {
        return { success: false, message: 'Utilisateur introuvable' };
    }

    return { success: true, user: rows[0] };
};

exports.changePassword = async (id, oldPassword, newPassword) => {
  try {
    // Récupérer l’utilisateur
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    const user = rows[0];

    if (!user) {
      return { success: false, message: 'Utilisateur introuvable' };
    }

    // Vérifier l’ancien mot de passe
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return { success: false, message: 'Ancien mot de passe incorrect' };
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour en BDD
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);

    return { success: true };
  } catch (error) {
    throw error;
  }
};
