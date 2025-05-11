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


function recupererCleApi(courriel, motDePasse, regenerer = false) {
    return new Promise((resolve, reject) => {
        // Vérifier si l'utilisateur existe
        const requete = `SELECT id, password, cle_api FROM utilisateurs WHERE courriel = $1`;
        sql.query(requete, [courriel])
            .then(result => {
                if (result.rows.length === 0) {
                    return reject(new Error("Utilisateur non trouvé"));
                }

                const utilisateur = result.rows[0];

                // Comparer le mot de passe
                bcrypt.compare(motDePasse, utilisateur.password)
                    .then(estValide => {
                        if (!estValide) {
                            return reject(new Error("Mot de passe invalide"));
                        }

                        // Si on veut régénérer la clé
                        if (regenerer) {
                            const nouvelleCle = genererCleAPI();
                            const updateQuery = `UPDATE utilisateurs SET cle_api = $1 WHERE id = $2`;

                            return sql.query(updateQuery, [nouvelleCle, utilisateur.id])
                                .then(() => resolve(nouvelleCle));
                        } else {
                            return resolve(utilisateur.cle_api);
                        }
                    });
            })
            .catch(err => reject(err));
    });
}

export{afficherToutesTaches, afficherDetails, crudTaches, crudSousTaches, ajouterUtilisateurs, recupererCleApi};