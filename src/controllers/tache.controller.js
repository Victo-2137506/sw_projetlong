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

const AjouterUtilisateur = (req, res) => {
    const { nom, prenom, courriel, password } = req.body;

    // Vérification des champs manquants
    let champsManquants = [];
    if (!nom) champsManquants.push("nom");
    if (!prenom) champsManquants.push("prenom");
    if (!courriel) champsManquants.push("courriel");
    if (!password) champsManquants.push("password");

    // Si des champs sont manquants, retourner une erreur
    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: "Le format des données est invalide",
            champ_manquant: champsManquants
        });
    }

    // Appel de la fonction ajouterUtilisateurs pour insérer l'utilisateur
    ajouterUtilisateurs(nom, prenom, courriel, password)
        .then((nouvelUtilisateur) => {
            res.status(201).json({
                message: `L'utilisateur ${nouvelUtilisateur.nom} a été ajouté avec succès`,
                utilisateur: nouvelUtilisateur
            });
        })
        .catch((error) => {
            res.status(500).json({
                erreur: `Échec lors de la création de l'utilisateur ${nom}`,
                message: error.message
            });
        });
};


export{AfficherTachesUsager, AjouterUtilisateur}