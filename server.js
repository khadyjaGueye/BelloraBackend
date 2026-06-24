require('dotenv').config();

const app = require('./src/app');
const pool = require('./src/config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connexion MySQL réussie');
        connection.release();
        app.listen(PORT, () => {
            console.log(`🚀 Serveur démarré sur le port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Erreur connexion MySQL :', error.message);
    }
}

startServer();