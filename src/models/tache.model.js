import sql from '../config/db_pg.js';

function afficherToutesTaches(){
    return new Promise((resolve, reject) => {
        const requete = 'SELECT id, utilisateur_id, titre, description, date_debut, date_echeance, complete FROM taches';
        const parametres = [id];

        sql.query(requete, parametres, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }

            resolve(resultat.rows);
        });
    });
};

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