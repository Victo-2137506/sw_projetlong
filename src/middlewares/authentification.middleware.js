import { ValidationCle } from "../models/tache.model.js";

const authentification = async (req, res, next) => {
    // Vérifier si la clé API est présente dans l'entête
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Vous devez fournir une clé API" });
    }

    // Récupérer la clé API qui est dans l'entête au format "cle_api XXXXXXXX"
    const cleApi = req.headers.authorization.split(' ')[1];

    try {
        // Vérifier si la clé API est valide
        const resultat = await ValidationCle(cleApi);
        if (!resultat) {
            return res.status(401).json({ message: "Clé API invalide" });
        }

        // La clé API est valide, on continue le traitement
        req.utilisateurId = resultat.id; // Assigner l'ID utilisateur correctement
        next();
    } catch (erreur) {
        return res.status(500).json({ message: "Erreur lors de la validation de la clé API" });
    }
};

export default authentification;
