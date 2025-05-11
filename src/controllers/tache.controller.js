import bcrypt from "bcrypt";
import crypto from "crypto";
import {afficherToutesTaches, afficherDetails, crudTaches, crudSousTaches, ajouterUtilisateurs, obtenirCleApi, mettreAJourCleApi} from "../models/tache.model.js";

const AfficherTachesUsager = (req, res) => {
    const utilisateurId = req.utilisateurId;
    const afficherToutes = req.query.toutes === 'true';

    if (!utilisateurId) {
        return res.status(400).json({ message: "La clé API est requise" });
    }

    afficherToutesTaches(utilisateurId, afficherToutes)
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

const Demandercle = async (req, res) => {
    const { courriel, motdepasse, regenerer } = req.body;

    if (!courriel || !motdepasse) {
        return res.status(400).json({ message: "Courriel et mot de passe requis" });
    }

    try {
        const utilisateur = await obtenirCleApi(courriel);

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const motDePasseValide = await bcrypt.compare(motdepasse, utilisateur.password);
        if (!motDePasseValide) {
            return res.status(401).json({ message: "Mot de passe invalide" });
        }

        if (regenerer === true) {
            const nouvelleCle = crypto.randomBytes(15).toString("hex");
            await mettreAJourCleApi(utilisateur.id, nouvelleCle);
            return res.status(200).json({ message: "Nouvelle clé générée", cle_api: nouvelleCle });
        }

        return res.status(200).json({ cle_api: utilisateur.cle_api });

    } catch (erreur) {
        console.error("Erreur dans demanderCle :", erreur);
        return res.status(500).json({ message: "Erreur interne lors de la demande de clé" });
    }
};



export{AfficherTachesUsager, AjouterUtilisateur, Demandercle}