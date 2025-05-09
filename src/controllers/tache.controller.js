import {afficherToutesTaches, afficherDetails, crudTaches, crudSousTaches, ajouterUtilisateurs, recupererCleApi} from "../models/tache.model.js";

const AfficherTachesUsager = (req, res) => {
    const utilisateurId = parseInt(req.params.id); // ID de l'usager
    const afficherToutes = req.query.toutes === 'true'; // Vérifie s'il faut tout afficher

    if (isNaN(utilisateurId)) {
        return res.status(400).json({ message: "L'ID de l'usager doit être un nombre" });
    }

    afficherToutesTaches(utilisateurId, afficherToutes)
        .then((taches) => {
            if (!taches || taches.length === 0) {
                return res.status(404).json({ message: "Aucune tâche trouvée pour cet usager" });
            }
            res.json(taches);
        })
        .catch((error) => {
            res.status(500).json({ message: "Erreur serveur", erreur: error.message });
        });
};



export{AfficherTachesUsager}