import express from 'express';
const router = express.Router();

import { AfficherTachesUsager, AjouterUtilisateur, Demandercle, AfficherTacheDetails } from '../controllers/tache.controller.js'
import authentification from '../middlewares/authentification.middleware.js';

// Route pour trouver toutes les taches de l'usager
router.get('/tache', authentification, AfficherTachesUsager);

router.get('/taches/:id', authentification, AfficherTacheDetails);

router.post('/utilisateur', AjouterUtilisateur)

router.post('/cle-api', Demandercle);


export default router;