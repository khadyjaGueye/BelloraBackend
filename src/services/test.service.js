const prisma = require('../config/prisma');

async function getTests() {
  return await prisma.test.findMany();
}

async function createTest(data) {
  return await prisma.test.create({ data });
}

module.exports = { getTests, createTest };
