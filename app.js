// CONFIGURATION AIRTABLE (Mets tes vrais codes entre les guillemets)
const AIRTABLE_BASE_ID = "TON_ID_DE_BASE"; 
const AIRTABLE_TOKEN = "TON_TOKEN_SECRET"; 
const TABLE_NAME = "Beats"; // Le nom de ton tableau Airtable

async function fetchBeats() {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}`;
    
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${AIRTABLE_TOKEN}`
            }
        });
        
        const data = await response.json();
        const playlistDiv = document.getElementById('playlist');
        playlistDiv.innerHTML = ''; // On vide le message de chargement

        // On filtre pour ne prendre que ceux qui ont le statut "En ligne"
        const records = data.records.filter(record => record.fields.Statut === "En ligne");

        if (records.length === 0) {
            playlistDiv.innerHTML = "<p>Aucun beat en ligne pour le moment.</p>";
            return;
        }

        // On affiche chaque beat
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

    } catch (error) {
        console.error("Erreur Airtable:", error);
        document.getElementById('playlist').innerHTML = "<p>Erreur lors du chargement des beats.</p>";
    }
}

// Lancer le chargement au démarrage de la page
fetchBeats();