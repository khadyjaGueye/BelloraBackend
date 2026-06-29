const pool = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

class AuthService {

    /**
     * Inscription
     */
    async register(data) {
        const { firstName, lastName, email, password, phone } = data;
        // Vérifier si l'email existe déjà
        const [existingEmail] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );
        if (existingEmail.length > 0) {
            throw new Error("Cet email est déjà utilisé.");
        }
        // Vérifier si le numéro existe déjà
        const [existingPhone] = await pool.query(
            "SELECT id FROM users WHERE phone = ?",
            [phone]
        );
        if (existingPhone.length > 0) {
            throw new Error("Ce numéro de téléphone est déjà utilisé.");
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertion
        const [result] = await pool.query(
            `
    INSERT INTO users
    ( first_name, last_name, email, password, phone )
    VALUES (?,?,?,?,?)
    `,
            [
                firstName,
                lastName,
                email,
                hashedPassword,
                phone || null
            ]
        );

        // Génération du token
        const token = jwt.sign(
            {
                id: result.insertId,
                role: "customer"
            },
            jwtConfig.secret,
            {
                expiresIn: jwtConfig.expiresIn
            }
        );

        return {
            success: true,
            message: "Compte créé avec succès.",
            token,
            user: {
                id: result.insertId,
                firstName,
                lastName,
                email,
                phone,
                role: "customer"
            }
        };
    }


    /**
     * Connexion
     */
    async login(email, password) {

        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            throw new Error("Email ou mot de passe incorrect.");
        }

        const user = rows[0];

        if (!user.is_active) {
            throw new Error("Votre compte est désactivé.");
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            throw new Error("Email ou mot de passe incorrect.");
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            jwtConfig.secret,
            {
                expiresIn: jwtConfig.expiresIn
            }
        );

        delete user.password;

        return {
            success: true,
            message: "Connexion réussie.",
            token,
            user
        };
    }

    /**
     * Profil connecté
     */
    async profile(id) {

        const [rows] = await pool.query(
            `
            SELECT
                id,
                first_name,
                last_name,
                email,
                phone,
                role,
                is_active,
                created_at
            FROM users
            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {
            throw new Error("Utilisateur introuvable.");
        }

        return rows[0];
    }

    /**
     * Modifier le profil
     */
    async updateProfile(id, data) {

        const {
            firstName,
            lastName,
            phone
        } = data;

        await pool.query(
            `
            UPDATE users
            SET
                first_name = ?,
                last_name = ?,
                phone = ?
            WHERE id = ?
            `,
            [
                firstName,
                lastName,
                phone,
                id
            ]
        );

        return this.profile(id);
    }

    /**
     * Modifier le mot de passe
     */
    async changePassword(id, oldPassword, newPassword) {

        const [rows] = await pool.query(
            "SELECT password FROM users WHERE id=?",
            [id]
        );

        if (rows.length === 0) {
            throw new Error("Utilisateur introuvable.");
        }

        const isMatch = await bcrypt.compare(
            oldPassword,
            rows[0].password
        );

        if (!isMatch) {
            throw new Error("Ancien mot de passe incorrect.");
        }

        const hash = await bcrypt.hash(newPassword, 10);

        await pool.query(
            `
            UPDATE users
            SET password = ?
            WHERE id = ?
            `,
            [hash, id]
        );

        return {
            success: true,
            message: "Mot de passe modifié avec succès."
        };
    }

}

module.exports = new AuthService();