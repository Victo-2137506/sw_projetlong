import express from 'express';
import morgan from 'morgan';
import sql from './src/config/db_pg.js';
import tacheRoutes from './src/routes/tache.route.js';
import authentification from './src/middlewares/authentification.middleware.js';

// Créer une application express
const app = express();

app.use('/api/taches', authentification, tacheRoutes)
app.use(authentification)

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le serveur http://localhost:${PORT}`);
});
