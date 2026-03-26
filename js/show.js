import { getShowById } from "./service.js";
import { isFavorite, addFavorite, removeFavorite } from "./persistence.js";

const detailsContainer = document.getElementById("show-details");

async function initDetails() {
    // 1. Obtener ID de la URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        window.location.href = "index.html";
        return;
    }

    try {
        const show = await getShowById(id);
        renderShowDetails(show);
    } catch (error) {
        detailsContainer.innerHTML = "<p>Error al cargar los detalles.</p>";
    }
}

function renderShowDetails(show) {
    const favoriteStatus = isFavorite(show.id);
    
    detailsContainer.innerHTML = `
        <div class="details-poster">
            <img src="${show.image?.original || show.image?.medium}" alt="${show.name}">
        </div>
        <div class="details-info">
            <h1>${show.name}</h1>
            <div class="meta-row">
                <span class="badge">⭐ ${show.rating?.average || 'N/A'}</span>
                <span>${show.premiered?.split('-')[0]}</span>
                <span>${show.runtime} min</span>
            </div>
            <div class="genres">${show.genres.join(" • ")}</div>
            
            <div class="summary">${show.summary}</div>
            
            <button id="fav-btn-detail" data-id="${show.id}" class="fav-btn ${favoriteStatus ? 'is-active' : ''}">
                ${favoriteStatus ? "💔 Quitar de Favoritos" : "❤️ Agregar a Favoritos"}
            </button>
            
            <a href="index.html" class="back-link">← Volver al catálogo</a>
        </div>
    `;

    // Evento para el botón de favoritos en esta página
    document.getElementById("fav-btn-detail").addEventListener("click", () => {
        if (isFavorite(show.id)) {
            removeFavorite(show.id);
            location.reload(); // Recargamos para actualizar el botón
        } else {
            addFavorite(show);
            location.reload();
        }
    });
}

initDetails();