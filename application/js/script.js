document.addEventListener("DOMContentLoaded", () => {
    // Formulaire de création d'utilisateur
    const formCreer = document.getElementById("form-creer-utilisateur");
    const msgCreer = document.getElementById("message-creer");

    formCreer.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            prenom: formCreer.prenom.value,
            nom: formCreer.nom.value,
            courriel: formCreer.courriel.value,
            password: formCreer.motdepasse.value
        };

        try {
            const response = await fetch("/api/taches/utilisateur", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                msgCreer.innerText = result.message;
                msgCreer.style.color = "green";
                formCreer.reset();
            } else {
                msgCreer.innerText = result.erreur || "Erreur lors de la création";
                msgCreer.style.color = "red";
            }
        } catch (err) {
            msgCreer.innerText = "Erreur réseau ou serveur";
            msgCreer.style.color = "red";
        }
    });

    // Formulaire de récupération de clé API
    const formCle = document.getElementById("form-cle-api");
    const msgCle = document.getElementById("message-cle");

    formCle.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            courriel: formCle.courriel_recup.value,
            motdepasse: formCle.motdepasse_recup.value,
            regenerer: formCle.generer.checked
        };

        try {
            const response = await fetch("/api/taches/cle-api", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                msgCle.innerText = `Clé API : ${result.cle_api}`;
                msgCle.style.color = "green";
                formCle.reset();
            } else {
                msgCle.innerText = result.message || "Erreur lors de la récupération";
                msgCle.style.color = "red";
            }
        } catch (err) {
            msgCle.innerText = "Erreur réseau ou serveur";
            msgCle.style.color = "red";
        }
    });
});
