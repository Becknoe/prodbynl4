const AIRTABLE_BASE_ID = "appRL2xfRfJvSIs9m"; 
const AIRTABLE_TOKEN = "patLnTJtzZ3LmNiUe.de7e9c9af5fb7c46231106cfd62507258b799b65bcbe174ed96f67372d0ff151"; 
const TABLE_NAME = "tblYBIPbEtjFSCuNK";

async function fetchBeats() {
    // MOUCHARD 0 : Vérifier si la fonction se lance
    console.log("Démarrage de la fonction fetchBeats()...");

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}`;
    
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${AIRTABLE_TOKEN}`
            }
        });
        
        const data = await response.json();
        const playlistDiv = document.getElementById('playlist');
        playlistDiv.innerHTML = ''; 

        if (data.error) {
            console.error("Erreur API:", data.error);
            playlistDiv.innerHTML = `<p>Erreur serveur : ${data.error.message}</p>`;
            return;
        }

        const records = data.records ? data.records.filter(record => record.fields.Status === "En ligne") : [];

        if (records.length === 0) {
            playlistDiv.innerHTML = "<p>Aucun beat trouvé.</p>";
            return;
        }

        // 1. Génération du HTML
        records.forEach(record => {
            const fields = record.fields;
            const title = fields.Titre || "Sans titre";
            const audioUrl = fields.Audio && fields.Audio[0] ? fields.Audio[0].url : null;
            const coverUrl = fields.Cover && fields.Cover[0] ? fields.Cover[0].url : "https://via.placeholder.com/60";

            const trackHtml = `
                <div class="track">
                    <img src="${coverUrl}" alt="${title}">
                    <div>
                        <h3>${title}</h3>
                        ${audioUrl ? `<audio controls src="${audioUrl}"></audio>` : '<p style="color:gray;">Pas de fichier audio</p>'}
                    </div>
                </div>
            `;
            playlistDiv.insertAdjacentHTML('beforeend', trackHtml);
        });

        // 2. Gestion de la lecture aléatoire et de la pause
        const audios = document.querySelectorAll('#playlist audio');
        
        // MOUCHARD 1 : Vérifier si on trouve bien les lecteurs audio
        console.log(`Initialisation : ${audios.length} lecteurs audio trouvés et configurés.`);

        audios.forEach(audio => {
            // Écouteur pour la fin du son
            audio.addEventListener('ended', (event) => {
                // MOUCHARD 2 : Vérifier si la fin est détectée
                console.log("Un son vient de se terminer ! Recherche d'une nouvelle piste aléatoire...");
                
                const autresAudios = Array.from(audios).filter(a => a !== event.target);
                
                if (autresAudios.length > 0) {
                    const randomIndex = Math.floor(Math.random() * autresAudios.length);
                    console.log(`Lancement aléatoire de la piste index n°${randomIndex}`);
                    autresAudios[randomIndex].play();
                } else {
                    event.target.play();
                }
            });

            // Écouteur pour mettre en pause les autres
            audio.addEventListener('play', (event) => {
                audios.forEach(a => {
                    if (a !== event.target) {
                        a.pause();
                    }
                });
            });
        });

    } catch (error) {
        console.error("Erreur critique:", error);
        document.getElementById('playlist').innerHTML = "<p>Erreur critique lors du chargement.</p>";
    }
}

fetchBeats();
