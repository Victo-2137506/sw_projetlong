document.getElementById("btn-creer").addEventListener("click", async () => {
    const prenom = document.getElementById("prenom").value.trim();
    const nom = document.getElementById("nom").value.trim();
    const courriel = document.getElementById("courriel").value.trim();
    const password = document.getElementById("motdepasse").value;

    const message = document.getElementById("message-creer");

    if (!prenom || !nom || !courriel || !password) {
        message.style.color = "red";
        message.textContent = "Tous les champs sont requis.";
        return;
    }

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prenom, nom, courriel, password })
    };

    try {
        const response = await fetch("https://sw-projetlong-y7ru.onrender.com/api/taches/utilisateur", options);
        const data = await response.json();

        if (response.ok) {
            message.style.color = "green";
            message.textContent = `Utilisateur créé ! Clé API : ${data.utilisateur.cle_api}`;
        } else {
            message.style.color = "red";
            message.textContent = data.erreur || data.message || "Erreur lors de la création.";
        }
    } catch (err) {
        console.error(err);
        message.style.color = "red";
        message.textContent = "Erreur de communication avec le serveur.";
    }
});

document.getElementById("btn-cle").addEventListener("click", async () => {
    const courriel = document.getElementById("courriel_recup").value.trim();
    const motdepasse = document.getElementById("motdepasse_recup").value;
    const regenerer = document.getElementById("generer").checked;

    const message = document.getElementById("message-cle");

    if (!courriel || !motdepasse) {
        message.style.color = "red";
        message.textContent = "Courriel et mot de passe requis.";
        return;
    }

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courriel, motdepasse, regenerer })
    };

    try {
        const response = await fetch("https://sw-projetlong-y7ru.onrender.com/api/taches/cle-api", options);
        const data = await response.json();

        if (response.ok) {
            message.style.color = "green";
            message.textContent = `Clé API : ${data.cle_api}`;
        } else {
            message.style.color = "red";
            message.textContent = data.message || "Erreur lors de la récupération.";
        }
    } catch (err) {
        console.error(err);
        message.style.color = "red";
        message.textContent = "Erreur de communication avec le serveur.";
    }
});
