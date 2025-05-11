import sql from '../config/db_pg.js';
import authentification from '../middlewares/authentification.middleware.js';
import bcrypt from 'bcrypt';


export const ValidationCle = async (cleApi) => {
    // Vérifie si une tâche appartient a cette clé existe
    const tache = await sql.findOne({ where: { cleApi } });
    return tache !== null;  // Retourne true si la clé existe, sinon false
};

// Code fait par ChatGPT pour generer une clé d'api
function genererCleAPI() {
    const cle = crypto.randomBytes(15).toString("hex");
}



function afficherToutesTaches(cleApi, afficherToutes = false) {
    return new Promise((resolve, reject) => {
        // Trouver d'abord l'utilisateur via sa clé API
        const requeteUtilisateur = 'SELECT id FROM utilisateurs WHERE cle_api = ?';

        sql.query(requeteUtilisateur, [cleApi], (err, resultatUtilisateur) => {
            if (err || resultatUtilisateur.length === 0) {
                return reject(new Error("Erreur lors de la validation de la clé api"));
            }

            const utilisateurId = resultatUtilisateur[0].id;

            let requeteTaches = `
                SELECT id, utilisateur_id, titre, description, date_debut, date_echeance, complete FROM taches WHERE utilisateur_id = ?`;

            if (!afficherToutes) {
                requeteTaches += ' AND complete = 0';
            }

            sql.query(requeteTaches, [utilisateurId], (erreur, resultat) => {
                if (erreur) return reject(erreur);
                resolve(resultat);
            });
        });
    });
}




function afficherDetails(){

};

function crudTaches(){

};

function crudSousTaches(){

};

function ajouterUtilisateurs(nom, prenom, courriel, password) {
    return new Promise((resolve, reject) => {
        const cle_api = genererCleAPI();

        // Hasher le mot de passe avant insertion
        bcrypt.hash(password, 10) // 10 est le "salt rounds", un bon compromis sécurité/performance
            .then(hashedPassword => {
                const requete = `INSERT INTO utilisateurs (nom, prenom, courriel, password, cle_api) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
                const params = [nom, prenom, courriel, hashedPassword, cle_api];

                return sql.query(requete, params);
            })
            .then(resultat => {
                resolve({
                    id: resultat.rows[0].id,
                    nom,
                    prenom,
                    courriel,
                    password: '****',
                    cle_api
                });
            })
            .catch(err => reject(err));
    });
}

async function obtenirCleApi(courriel) {
    const requete = `SELECT id, password, cle_api FROM utilisateurs WHERE courriel = $1`;
    const result = await sql.query(requete, [courriel]);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}

async function mettreAJourCleApi(utilisateurId, nouvelleCle) {
    const requete = `UPDATE utilisateurs SET cle_api = $1 WHERE id = $2`;
    await sql.query(requete, [nouvelleCle, utilisateurId]);
}

export{afficherToutesTaches, afficherDetails, crudTaches, crudSousTaches, ajouterUtilisateurs, obtenirCleApi, mettreAJourCleApi};