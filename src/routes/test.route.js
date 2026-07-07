const express = require("express");
const router = express.Router();

const {
  createTest,
  getTests,
} = require("../controllers/test.controller");

router.post("/", createTest);
router.get("/", getTests);

module.exports = router;