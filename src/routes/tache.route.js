import express from 'express';
const router = express.Router();

import { AfficherTachesUsager, AjouterUtilisateur, Demandercle, AfficherTacheDetails,
        creerTache, modifierUneTache, changerStatut, supprimerUneTache, listerTaches, detailsTache,
    creerSousTache, modifierUneSousTache, changerStatutSous, supprimerUneSousTache
 } from '../controllers/tache.controller.js'
import authentification from '../middlewares/authentification.middleware.js';

// Route pour trouver toutes les taches de l'usager
router.get('/tache', authentification, AfficherTachesUsager);

router.get('/taches/:id', authentification, AfficherTacheDetails);

router.post('/utilisateur', AjouterUtilisateur)

router.post('/cle-api', Demandercle);

router.post('/', authentification, creerTache);                      // Ajouter une tâche
router.get('/', authentification, listerTaches);                     // Lister les tâches (avec ou sans complétées ?toutes=true)
router.get('/:id', authentification, detailsTache);                  // Détails d’une tâche
router.put('/:id', authentification, modifierUneTache);              // Modifier une tâche
router.patch('/:id/statut', authentification, changerStatut);        // Changer le statut d’une tâche
router.delete('/:id', authentification, supprimerUneTache);          // Supprimer une tâche

router.post('/:tacheId', authentification, creerSousTache);               // Ajouter une sous-tâche liée à une tâche
router.put('/:id', authentification, modifierUneSousTache);               // Modifier une sous-tâche
router.patch('/:id/statut', authentification,changerStatutSous);         // Modifier le statut d’une sous-tâche
router.delete('/:id', authentification, supprimerUneSousTache);     

export default router;