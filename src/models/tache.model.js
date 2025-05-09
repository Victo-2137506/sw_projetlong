import sql from '../config/db_pg.js';

function afficherToutesTaches(utilisateurId, afficherToutes = false) {
    return new Promise((resolve, reject) => {
        let requete = 'SELECT id, utilisateur_id, titre, description, date_debut, date_echeance, complete FROM taches WHERE utilisateur_id = ?';
        const parametres = [utilisateurId];

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

function ajouterUtilisateurs(){

};

function recupererCleApi(){

};

export{afficherToutesTaches, afficherDetails, crudTaches, crudSousTaches, ajouterUtilisateurs, recupererCleApi};