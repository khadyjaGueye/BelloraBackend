const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function test() {
    const users = await client.user.findMany();
    console.log(users);
  }
  
  test();

module.exports = prisma;