const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function errorHandler(err, req, res, next) {
  console.error(err);
  let message = "Erreur serveur";
  let statusCode = 500;
  if (err.code) {
    const codeErreur = await prisma.codeErreur.findUnique({ where: { code: err.code } });
    if (codeErreur) {
      message = codeErreur.message;
      statusCode = 400;
    }
  }
  
  res.status(statusCode).json({
    data: {
      success: false,
      message
    }
  });
}

module.exports = errorHandler;
