import sql from '../config/db_pg.js';
import authentification from '../middlewares/authentification.middleware.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

function ValidationCle(cleApi) {
    return new Promise((resolve, reject) => {
        const pg = "SELECT id FROM utilisateurs WHERE cle_api = $1";
        sql.query(pg, [cleApi], (err, results) => {
            if (err) {
                console.error("Erreur lors de la validation de la clé API :", err);
                return reject(err);
            }

            if (results.rows.length === 0) { // <-- correction ici
                return resolve(null); // Clé invalide
            }

            return resolve(results.rows[0].id); // Clé valide : retourne l'ID
        });
    });
};

function afficherToutesTaches(utilisateurId, toutes) {
    return new Promise((resolve, reject) => {
        let pg = "SELECT id, titre FROM taches WHERE utilisateur_id = $1";

        if(!toutes){
            pg += " AND complete = false";
        }

        sql.query(pg, [utilisateurId], (err, results) => {
            if(err){
                return reject(err)
            }
            resolve(results.rows);
        })
    });
}

function afficherDetails(tacheId) {
    return new Promise((resolve, reject) => {
        const requeteTache = `SELECT id, titre, description, complete, date_debut, date_echeance FROM taches WHERE id = $1`;

        sql.query(requeteTache, [tacheId], (err, resultTache) => {
            if (err) {
                return reject(err);
            }

            if (resultTache.rows.length === 0) {
                return resolve(null);
            }

            const tache = resultTache.rows[0];
            const requeteSousTaches = `SELECT id, titre, complete FROM sous_taches WHERE tache_id = $1`;

            sql.query(requeteSousTaches, [tacheId], (err, resultSousTaches) => {
                if (err) {
                    return reject(err);
                }
                tache.sous_taches = resultSousTaches.rows;
                resolve(tache);
            });
        });
    });
}

function ajouterTache(utilisateurId, titre, description, date_debut, date_echeance) {
    const query = `
        INSERT INTO taches (utilisateur_id, titre, description, date_debut, date_echeance, complete)
        VALUES ($1, $2, $3, $4, $5, false) RETURNING id
    `;
    const values = [utilisateurId, titre, description, date_debut, date_echeance];
    return sql.query(query, values);
}

function modifierTache(tacheId, titre, description, date_debut, date_echeance) {
    const query = `
        UPDATE taches SET titre = $1, description = $2, date_debut = $3, date_echeance = $4
        WHERE id = $5
    `;
    const values = [titre, description, date_debut, date_echeance, tacheId];
    return sql.query(query, values);
}

function changerStatutTache(tacheId, nouveauStatut) {
    const query = `UPDATE taches SET complete = $1 WHERE id = $2`;
    return sql.query(query, [nouveauStatut, tacheId]);
}

function supprimerTache(tacheId) {
    const query = `DELETE FROM taches WHERE id = $1`;
    return sql.query(query, [tacheId]);
}

function ajouterSousTache(tacheId, titre) {
    const query = `
        INSERT INTO sous_taches (tache_id, titre, complete) VALUES ($1, $2, false) RETURNING id
    `;
    return sql.query(query, [tacheId, titre]);
}

function modifierSousTache(sousTacheId, titre) {
    const query = `UPDATE sous_taches SET titre = $1 WHERE id = $2`;
    return sql.query(query, [titre, sousTacheId]);
}

function changerStatutSousTache(sousTacheId, nouveauStatut) {
    const query = `UPDATE sous_taches SET complete = $1 WHERE id = $2`;
    return sql.query(query, [nouveauStatut, sousTacheId]);
}

function supprimerSousTache(sousTacheId) {
    const query = `DELETE FROM sous_taches WHERE id = $1`;
    return sql.query(query, [sousTacheId]);
}


function ajouterUtilisateurs(nom, prenom, courriel, password) {
    return new Promise((resolve, reject) => {
            const cle_api = crypto.randomBytes(15).toString("hex");

        bcrypt.hash(password, 10)
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

export {ValidationCle, afficherToutesTaches, afficherDetails, ajouterTache, modifierTache, changerStatutTache, supprimerTache, 
    ajouterSousTache, modifierSousTache, changerStatutSousTache, supprimerSousTache, ajouterUtilisateurs, obtenirCleApi, mettreAJourCleApi};