import express from 'express';
import morgan from 'morgan';
import tacheRoutes from './src/routes/tache.route.js';
import fs from 'fs';
import path from 'path';

// Créer une application express
const app = express();

// Importer les middlewares
app.use(express.json());
app.use(morgan('dev'));

// Route
app.use('/api/taches', tacheRoutes);

// Logger les erreurs 500
const logMorgan = fs.createWriteStream(path.join('src', 'log', 'access.log'), { flags: 'a' });
app.use(morgan('combined', {
  skip: (req, res) => res.statusCode < 500,
  stream: logMorgan
}));

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le serveur http://localhost:${PORT}`);
});
