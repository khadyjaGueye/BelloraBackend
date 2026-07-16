const prisma = require("../config/prisma");


async function findAll() {
  return await prisma.product.findMany({
    include: {
      category: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

async function findById(id) {
  // Vérification côté service pour éviter NaN
  const productId = Number(id);
  if (!productId || isNaN(productId)) {
    throw new Error("ID invalide");
  }
  return await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: {
        select: { name: true }
      }
    }
  });
}

async function create(product) {
  return await prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: Number(product.stock),
      image: product.image || null,
      category: {
        connect: {
          id: Number(product.category_id)
        }
      }
    }
  });
}

async function countAll() {
  return await prisma.product.count();
}

async function countByCategory(categoryId) {
  return await prisma.product.count({
    where: { category_id: Number(categoryId) }
  });
}

async function update(id, product) {
  return await prisma.product.update({
    where: {
      id: Number(id)
    },
    data: {
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: Number(product.stock),
      image: product.image,
      category_id: Number(product.category_id)
    }
  });
}

async function remove(id) {
  return await prisma.product.delete({
    where: {
      id: Number(id)
    }
  });
}

async function findByCategory(categoryId) {
  return prisma.product.findMany({
    where: { category_id: Number(categoryId) }
  });
}

async function findLastProductsByAllCategories() {
  const categories = await prisma.category.findMany();
  const results = await Promise.all(
    categories.map(async (cat) => {
      const lastProduct = await prisma.product.findFirst({
        where: { category_id: cat.id },
        orderBy: { createdAt: 'desc' } // ou id: 'desc'
      });
      return {
        category: cat,
        lastProduct: lastProduct || null
      };
    })
  );

  return results;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  findByCategory,
  findLastProductsByAllCategories,
  countAll,
  countByCategory,
};