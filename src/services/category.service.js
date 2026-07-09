const prisma = require("../config/prisma");

// Récupérer toutes les catégories
async function findAll() {
  return await prisma.category.findMany();
}

// Récupérer une catégorie par ID
async function findById(id) {
  return await prisma.category.findUnique({
    where: { id: Number(id) },
  });
}

// Créer une nouvelle catégorie
async function create(category) {
  return await prisma.category.create({
    data: {
      name: category.name,
      description: category.description,
      image: category.image,
    },
  });
}

// Mettre à jour une catégorie
async function update(id, category) {
  return await prisma.category.update({
    where: { id: Number(id) },
    data: {
      name: category.name,
      description: category.description,
      image: category.image,
    },
  });
}

// Supprimer une catégorie
async function remove(id) {
  return await prisma.category.delete({
    where: { id: Number(id) },
  });
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
