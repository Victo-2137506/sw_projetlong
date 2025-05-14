import express from 'express';
const router = express.Router();

import { AfficherTachesUsager, AjouterUtilisateur, Demandercle, AfficherTacheDetails,
    creerTache, modifierUneTache, changerStatut, supprimerUneTache,
    creerSousTache, modifierUneSousTache, changerStatutSous, supprimerUneSousTache
} from '../controllers/tache.controller.js'
import authentification from '../middlewares/authentification.middleware.js';

// Route pour trouver toutes les tâches de l'usager
router.get('/tache', authentification, AfficherTachesUsager);
router.get('/taches/:id', authentification, AfficherTacheDetails);

// Route pour créer, modifier, changer le statut ou supprimer une tâche
router.post('/', authentification, creerTache);          
router.put('/:id', authentification, modifierUneTache);       
router.patch('/:id/statut', authentification, changerStatut);  
router.delete('/:id', authentification, supprimerUneTache);

// Route pour créer, modifier, changer le statut ou supprimer une sous-tâche
router.post('/:tacheId/sous-taches', authentification, creerSousTache);
router.put('/sous-taches/:id', authentification, modifierUneSousTache);
router.patch('/sous-taches/:id/statut', authentification, changerStatutSous);
router.delete('/sous-taches/:id', authentification, supprimerUneSousTache);   

// Route pour créer, demander ou régénérer une clé
router.post('/utilisateur', AjouterUtilisateur)
router.post('/cle-api', Demandercle); 

export default router;
