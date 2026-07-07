require("dotenv").config();

const app = require("./src/app");
const prisma = require("./src/config/prisma");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Vérifie la connexion en faisant une requête simple
    await prisma.$connect();
    console.log("✅ Connexion Supabase réussie via Prisma");

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erreur connexion Supabase :", error.message);
    process.exit(1); // Arrête le serveur si la DB n'est pas accessible
  }
}

startServer();
