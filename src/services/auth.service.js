const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

class AuthService {

    async register(data) {
        const { firstName, lastName, email, password, phone,address,image } = data;

        const existingEmail = await prisma.user.findUnique({ where: { email } });
        if (existingEmail) throw new Error("Cet email est déjà utilisé.");

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                first_name: firstName,
                last_name: lastName,
                email,
                password: hashedPassword,
                phone,
                address:address,
                image:image,
                role: "customer",
            },
        });

        const token = jwt.sign({ id: user.id, role: user.role }, jwtConfig.secret, {
            expiresIn: jwtConfig.expiresIn,
        });

        return { success: true, message: "Compte créé avec succès.", token, user };
    }


    async login(email, password) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error("Email ou mot de passe incorrect.");
        if (!user.is_active) throw new Error("Votre compte est désactivé.");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Email ou mot de passe incorrect.");

        const token = jwt.sign(
            { id: user.id, role: user.role },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        const { password: _, ...safeUser } = user;
        return { success: true, message: "Connexion réussie.", token, user: safeUser };
    }

    async profile(id) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                role: true,
                is_active: true,
                created_at: true,
                updated_at: true,
            },
        });
        if (!user) throw new Error("Utilisateur introuvable.");
        return user;
    }

    async updateProfile(id, data) {
        const user = await prisma.user.update({
            where: { id },
            data,
        });
        return user;
    }

    async changePassword(id, oldPassword, newPassword) {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) throw new Error("Utilisateur introuvable.");

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) throw new Error("Ancien mot de passe incorrect.");

        const hash = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({ where: { id }, data: { password: hash } });

        return { success: true, message: "Mot de passe modifié avec succès." };
    }
}

module.exports = new AuthService();
