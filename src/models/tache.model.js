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
        let requete = 'SELECT id, utilisateur_id, titre, description, date_debut, date_echeance, complete FROM taches WHERE cle_api = ?';
        const parametres = [cleApi];

        if (!afficherToutes) {
            requete += ' AND complete = 0';
        }

        sql.query(requete, parametres, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur.sqlState + ' : ' + erreur.sqlMessage);
                return reject(erreur);
            }

            resolve(resultat);
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


function recupererCleApi(){

};

export{afficherToutesTaches, afficherDetails, crudTaches, crudSousTaches, ajouterUtilisateurs, recupererCleApi};