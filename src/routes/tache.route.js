import express from 'express';
const router = express.Router();

import { AfficherTachesUsager, AjouterUtilisateur, Demandercle } from '../controllers/tache.controller.js'
import authentification from '../middlewares/authentification.middleware.js';

// Route pour trouver toutes les taches de l'usager
router.get('/tache', authentification, AfficherTachesUsager);

router.post('/utilisateur', AjouterUtilisateur)

router.post('/cle-api', Demandercle);


export default router;