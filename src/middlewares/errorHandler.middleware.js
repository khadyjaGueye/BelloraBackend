function errorHandler(err, req, res, next) {
    console.error(err); // utile pour le debug en console
  
    let statusCode = 500;
    let message = "Erreur serveur";
  
    // Gestion des erreurs Prisma
    if (err.code === "P2002") {
      statusCode = 400;
      message = "Un enregistrement avec cette valeur existe déjà (contrainte unique)";
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "Enregistrement introuvable";
    } else if (err.code === "P2014") {
      statusCode = 400;
      message = "Violation de contrainte relationnelle";
    } else if (err.name === "ValidationError") {
      statusCode = 400;
      message = err.message;
    } else if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      statusCode = 400;
      message = "JSON invalide dans la requête";
    } else {
      // fallback : garder le message original si utile
      message = err.message || message;
    }
  
    res.status(statusCode).json({
      data: {
        success: false,
        message
      }
    });
  }
  
  module.exports = errorHandler;
  