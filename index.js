import express from 'express'
import sql from './src/config/db_pg'
import tacheRoutes from './src/routes/tache.route.js';

// Créer une application express
const app = express();

app.use('/api/taches', tacheRoutes)

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le serveur http://localhost:${PORT}`);
});
