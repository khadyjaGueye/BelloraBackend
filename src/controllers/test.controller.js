const { getTests, createTest } = require('../services/test.service');

exports.getAllTests = async (req, res) => {
  try {
    const tests = await getTests();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addTest = async (req, res) => {
  try {
    const newTest = await createTest(req.body);
    res.status(201).json(newTest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
