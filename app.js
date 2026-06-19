const AIRTABLE_BASE_ID = "appRL2xfRfJvSIs9m"; 
const AIRTABLE_TOKEN = "patLnTJtzZ3LmNiUe.de7e9c9af5fb7c46231106cfd62507258b799b65bcbe174ed96f67372d0ff151"; 
const TABLE_NAME = "tblYBIPbEtjFSCuNK"; // L'ID technique, impossible qu'il se trompe

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
                        ${audioUrl ? `<audio controls src="${audioUrl}"></audio>` : '<p style="color:gray;">Pas d'audio</p>'}
                    </div>
                </div>
            `;
            playlistDiv.insertAdjacentHTML('beforeend', trackHtml);
        });

    } catch (error) {
        console.error("Erreur:", error);
        document.getElementById('playlist').innerHTML = "<p>Erreur critique.</p>";
    }
}

fetchBeats();