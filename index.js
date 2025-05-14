import express from 'express';
import morgan from 'morgan';
import tacheRoutes from './src/routes/tache.route.js';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';

const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/documentation.json', 'utf8'));
const swaggerOptions = {
    customCss: '.swagger-ui .topbar {display : none}',
    customSiteTitle: "Documentation API"
};

// Créer une application Express
const app = express();

app.use(cors());

// Importer les middlewares
app.use(express.json());
var logMorgan = fs.createWriteStream(path.join('src', 'log', 'access.log'), { flags: 'a' });
app.use(morgan('dev', { stream: logMorgan }));

// Routes
app.use('/api/taches', tacheRoutes);
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument, swaggerOptions));

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port http://localhost:${PORT}`);
});
