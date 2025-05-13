import express from 'express';
import morgan from 'morgan';
import sql from './src/config/db_pg.js';
import tacheRoutes from './src/routes/tache.route.js';
import authentification from './src/middlewares/authentification.middleware.js';

// Créer une application express
const app = express();

// Importer les middlewares
app.use(express.json());
app.use(morgan('dev'));

// Middleware Morgan
app.use((err, req, res, next) => {
  console.error(`Erreur 500 - ${req.method} ${req.originalUrl}`);
  console.error(err.stack);
  res.status(500).json({ message: "Une erreur est survenue sur le serveur." });
});
 
app.use('/api/taches', tacheRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le serveur http://localhost:${PORT}`);
});
