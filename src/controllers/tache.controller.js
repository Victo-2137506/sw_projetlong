import {afficherToutesTaches, afficherDetails, crudTaches, crudSousTaches, ajouterUtilisateurs, recupererCleApi} from "../models/tache.model.js";

const AfficherTachesUsager = (req, res) => {
    const cleApi = req.headers['authorization']; // Ou bien récupère la clé API d'une autre manière, selon comment tu la passes (par exemple dans les paramètres URL, req.query, etc.).
    const afficherToutes = req.query.toutes === 'true'; // Vérifie s'il faut tout afficher

    if (!cleApi) {
        return res.status(400).json({ message: "La clé API est requise" });
    }

    afficherToutesTaches(cleApi, afficherToutes)
        .then((taches) => {
            if (!taches || taches.length === 0) {
                return res.status(404).json({ message: "Aucune tâche trouvée pour cette clé API" });
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

async function recupererCleApiUtilisateur(req, res) {
    const { courriel, motDePasse, regenerer } = req.body;

    if (!courriel || !motDePasse) {
        return res.status(400).json({ erreur: "Courriel et mot de passe requis" });
    }

    try {
        const cle = await recupererCleApi(courriel, motDePasse, regenerer === true || regenerer === "true");
        res.json({ cle_api: cle });
    } catch (err) {
        res.status(401).json({ erreur: err.message });
    }
}


export{AfficherTachesUsager, AjouterUtilisateur, recupererCleApiUtilisateur}