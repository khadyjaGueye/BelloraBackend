const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');

async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      image: true,
      is_active: true,
      created_at: true,
      updated_at: true,
    },
  });
}

async function updateProfile(id, data) {
  const updatedUser = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      image: true,
      is_active: true,
      created_at: true,
      updated_at: true,
    },
  });
  return { success: true, user: updatedUser };
}

async function changePassword(id, oldPassword, newPassword) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return { success: false, message: 'Utilisateur introuvable' };

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return { success: false, message: 'Ancien mot de passe incorrect' };

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });

  return { success: true };
}

// Compter tous les utilisateurs
async function countUsers() {
  return await prisma.user.count();
}


module.exports = { getUserById, updateProfile, changePassword ,countUsers};
