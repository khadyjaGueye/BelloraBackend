// controllers/codeErreur.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAll(req, res, next) {
  try {
    const codes = await prisma.codeErreur.findMany();
    res.json({
      data: {
        success: true,
        codes
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getByCode(req, res, next) {
  try {
    const code = req.params.code;
    const codeErreur = await prisma.codeErreur.findUnique({
      where: { code }
    });

    if (!codeErreur) {
      return res.status(404).json({
        data: {
          success: false,
          message: `Code ${code} introuvable`
        }
      });
    }

    res.json({
      data: {
        success: true,
        codeErreur
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getByCode };
