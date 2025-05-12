import sql from '../config/db_pg.js';
import authentification from '../middlewares/authentification.middleware.js';
import bcrypt from 'bcrypt';

function ValidationCle(cleApi) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id FROM utilisateurs WHERE cle_api = $1";
        db.query(sql, [cleApi], (err, results) => {
            if (err) {
                console.error("Erreur lors de la validation de la clé API :", err);
                return reject(err);
            }
 
            if (results.length === 0) {
                return resolve(null); // Clé invalide
            }
            console.log(results);
            return resolve(results[0].id); // Clé valide : retourne l'ID
        });
    });
};

// Code fait par ChatGPT pour generer une clé d'api
function genererCleAPI() {
    const cle = crypto.randomBytes(15).toString("hex");
}

function afficherToutesTaches(utilisateurId, toutes) {
    return new Promise((resolve, reject) => {
        let pg = "SELECT * FROM taches WHERE utilisateur_id = $1";

        if(!toutes){
            pg += " AND complete = 0";
        }

        sql.query(pg, [utilisateurId], (err, results) => {
            if(err){
                return reject(err)
            }
            resolve(results);
        })
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

export {ValidationCle, afficherToutesTaches, afficherDetails, crudTaches, crudSousTaches, ajouterUtilisateurs, obtenirCleApi, mettreAJourCleApi};