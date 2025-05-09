import express from 'express';
const router = express.Router();

import { AfficherTachesUsager } from '../controllers/tache.controller.js'

// Route pour trouver toutes les taches de l'usager
router.get('/tache', AfficherTachesUsager);
// Route pour afficher le detail d'une tache
router.get('/:id');
// Route pour ajouter, modifier, modifier le statue et supprimer une tache
router.post('/');
router.put('/')
router.put('/')
router.delete('/')
// Route pour ajouter, modifier, modifier le statue et supprimer une sous-tache
router.post('/');
router.put('/')
router.put('/')
router.delete('/')
// Route pour ajouter un utilisateur
router.post('/')
// Route pour recuperer la cle api ou en redemander une nouvelle
router.get('/')
router.get('/')


export default router;