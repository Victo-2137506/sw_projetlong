document.addEventListener("DOMContentLoaded", () => {
    const formCreer = document.getElementById("form-creer-utilisateur");
    const formCle = document.getElementById("form-cle-api");

    formCreer.addEventListener("submit", async (e) => {
        e.preventDefault();

        const prenom = formCreer.querySelector("input[name='prenom']").value;
        const nom = formCreer.querySelector("input[name='nom']").value;
        const courriel = formCreer.querySelector("input[name='courriel']").value;
        const password = formCreer.querySelector("input[name='motdepasse']").value;

        const response = await fetch("https://sw-projetlong-y7ru.onrender.com/api/taches/utilisateur", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom, prenom, courriel, password })
        });

        const data = await response.json();
        const message = document.getElementById("message-creer");

        if (response.ok) {
            message.style.color = "green";
            message.textContent = `Utilisateur créé avec succès. Clé API : ${data.utilisateur.cle_api}`;
        } else {
            message.style.color = "red";
            message.textContent = `Erreur: ${data.erreur || data.message}`;
        }
    });

    formCle.addEventListener("submit", async (e) => {
        e.preventDefault();

        const courriel = formCle.querySelector("input[name='courriel_recup']").value;
        const motdepasse = formCle.querySelector("input[name='motdepasse_recup']").value;
        const regenerer = formCle.querySelector("input[name='generer']").checked;

        const response = await fetch("https://sw-projetlong-y7ru.onrender.com/api/taches/cle-api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courriel, motdepasse, regenerer })
        });

        const data = await response.json();
        const message = document.getElementById("message-cle");

        if (response.ok) {
            message.style.color = "green";
            message.textContent = `Clé API : ${data.cle_api}`;
        } else {
            message.style.color = "red";
            message.textContent = `Erreur: ${data.message}`;
        }
    });
});
