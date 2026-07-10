const express = require('express');
const router = express.Router();
const { getAll, getByCode } = require('../controllers/codeErreur.controller');

router.get('/', getAll);          // GET /api/code-erreurs
router.get('/:code', getByCode);  // GET /api/code-erreurs/P2002

module.exports = router;
