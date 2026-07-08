const prisma = require("../config/prisma");

async function getTests(req, res) {
  try {
    const tests = await prisma.test.findMany();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createTest(req, res) {
  try {
    const { name, description } = req.body;
    const newTest = await prisma.test.create({
      data: { name, description },
    });
    res.status(201).json(newTest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getTests, createTest };
