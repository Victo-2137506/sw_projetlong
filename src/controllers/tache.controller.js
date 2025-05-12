import bcrypt from "bcrypt";
import crypto from "crypto";
import {afficherToutesTaches, afficherDetails, ajouterUtilisateurs, ajouterTache, modifierTache, changerStatutTache, supprimerTache, 
    ajouterSousTache, modifierSousTache, changerStatutSousTache, supprimerSousTache, obtenirCleApi, mettreAJourCleApi} from "../models/tache.model.js";

const AfficherTachesUsager = (req, res) => {
    const utilisateurId = req.utilisateurId;
    const afficherToutes = req.query.toutes == "true";
    
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

function AfficherTacheDetails(req, res) {
    const tacheId = parseInt(req.params.id, 10);

    if (isNaN(tacheId)) {
        return res.status(400).json({ erreur: "ID de tâche invalide." });
    }

    afficherDetails(tacheId)
        .then(tache => {
            if (!tache) {
                return res.status(404).json({ erreur: "Tâche non trouvée." });
            }
            res.json(tache);
        })
        .catch(err => {
            console.error("Erreur dans getTacheDetails :", err);
            res.status(500).json({ erreur: "Erreur interne du serveur." });
        });
}

async function creerTache(req, res) {
    const utilisateurId = req.utilisateurId;
    const { titre, description, date_debut, date_echeance } = req.body;

    try {
        const result = await ajouterTache(utilisateurId, titre, description, date_debut, date_echeance);
        res.status(201).json({ message: 'Tâche ajoutée', id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de la tâche' });
    }
}

async function modifierUneTache(req, res) {
    const tacheId = req.params.id;
    const { titre, description, date_debut, date_echeance } = req.body;

    try {
        await modifierTache(tacheId, titre, description, date_debut, date_echeance);
        res.status(200).json({ message: 'Tâche modifiée' });
    } catch (err) {
        res.status(500).json({ erreur: 'Erreur lors de la modification de la tâche' });
    }
}

async function changerStatut(req, res) {
    const tacheId = req.params.id;
    const { complete } = req.body;

    try {
        await changerStatutTache(tacheId, complete);
        res.status(200).json({ message: 'Statut modifié' });
    } catch (err) {
        res.status(500).json({ erreur: 'Erreur lors du changement de statut' });
    }
}

async function supprimerUneTache(req, res) {
    const tacheId = req.params.id;

    try {
        await supprimerTache(tacheId);
        res.status(200).json({ message: 'Tâche supprimée' });
    } catch (err) {
        res.status(500).json({ erreur: 'Erreur lors de la suppression de la tâche' });
    }
}

async function listerTaches(req, res) {
    const utilisateurId = req.utilisateurId;
    const toutes = req.query.toutes === "true";

    try {
        const taches = await afficherToutesTaches(utilisateurId, toutes);
        res.json(taches);
    } catch (err) {
        res.status(500).json({ erreur: 'Erreur lors de la récupération des tâches' });
    }
}


async function creerSousTache(req, res) {
    const tacheId = req.params.tacheId;
    const { titre } = req.body;

    try {
        const result = await ajouterSousTache(tacheId, titre);
        res.status(201).json({ message: 'Sous-tâche ajoutée', id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de la sous-tâche' });
    }
}

async function modifierUneSousTache(req, res) {
    const sousTacheId = req.params.id;
    const { titre } = req.body;

    try {
        await modifierSousTache(sousTacheId, titre);
        res.status(200).json({ message: 'Sous-tâche modifiée' });
    } catch (err) {
        res.status(500).json({ erreur: 'Erreur lors de la modification' });
    }
}

async function changerStatutSous(req, res) {
    const sousTacheId = req.params.id;
    const { complete } = req.body;

    try {
        await changerStatutSousTache(sousTacheId, complete);
        res.status(200).json({ message: 'Statut modifié' });
    } catch (err) {
        res.status(500).json({ erreur: 'Erreur lors du changement de statut' });
    }
}

async function supprimerUneSousTache(req, res) {
    const sousTacheId = req.params.id;

    try {
        await supprimerSousTache(sousTacheId);
        res.status(200).json({ message: 'Sous-tâche supprimée' });
    } catch (err) {
        res.status(500).json({ erreur: 'Erreur lors de la suppression' });
    }
}

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



export{AfficherTachesUsager, AfficherTacheDetails, AjouterUtilisateur, Demandercle,
        creerTache, modifierUneTache, changerStatut, supprimerUneTache, listerTaches,
            creerSousTache, modifierUneSousTache, changerStatutSous, supprimerUneSousTache
}