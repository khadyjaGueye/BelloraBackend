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
  return await prisma.product.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      category: {
        select: {
          name: true
        }
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

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};