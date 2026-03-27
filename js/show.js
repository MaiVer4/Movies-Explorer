import { getShowById } from "./service.js";
import { isFavorite, addFavorite, removeFavorite } from "./persistence.js";

const detailsContainer = document.getElementById("show-details");
const bgBlur = document.getElementById("details-bg-blur");

/**
 * Inicializa la página de detalles obteniendo el ID de la URL
 */
async function initDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        // Si no hay ID, regresamos al catálogo
        window.location.href = "index.html";
        return;
    }

    try {
        const show = await getShowById(id);
        renderShowDetails(show);
    } catch (error) {
        console.error("Error cargando detalles:", error);
        // CORRECCIÓN: Quitamos la clase Loader si hay error
        detailsContainer.classList.remove("Loader");
        detailsContainer.innerHTML = `
            <div class="error-state">
                <h2>Opps! No pudimos encontrar la serie</h2>
                <a href="index.html" class="back-link">Volver al inicio</a>
            </div>`;
    }
}

/**
 * Renderiza la información en el DOM y aplica el fondo cinemático
 */
function renderShowDetails(show) {
    const favoriteStatus = isFavorite(show.id);
    const originalImg = show.image?.original || show.image?.medium || "https://via.placeholder.com/600x900?text=Sin+Imagen";

    // 1. Aplicar fondo difuminado inmersivo
    if (bgBlur) {
        bgBlur.style.backgroundImage = `url(${originalImg})`;
    }

    // 2. CORRECCIÓN: Intercambio de clases para activar la grilla y el diseño
    detailsContainer.innerHTML = "";
    detailsContainer.classList.remove("Loader"); // Quitamos el estado de carga
    detailsContainer.classList.add("details-grid"); // Activamos la grilla de dos columnas
    
    // 3. Construir la estructura de detalles (añadimos pildoras de género y estatus)
    detailsContainer.innerHTML = `
        <div class="details-poster">
            <img src="${originalImg}" alt="${show.name}">
        </div>
        <div class="details-info">
            <h1>${show.name}</h1>
            
            <div class="meta-row">
                <span class="badge">⭐ ${show.rating?.average || 'N/A'}</span>
                <span>${show.premiered?.split('-')[0] || 'N/A'}</span>
                <span>${show.runtime || '??'} min</span>
                <span class="status-tag">${show.status}</span>
            </div>
            
            <div class="genres">
                ${show.genres.map(g => `<span class="genre-pill">${g}</span>`).join("")}
            </div>
            
            <div class="summary">
                ${show.summary || "<p>No hay descripción disponible para esta serie.</p>"}
            </div>
            
            <div class="actions-row">
                <button id="fav-btn-detail" data-id="${show.id}" class="fav-btn ${favoriteStatus ? 'is-active' : ''}">
                    <span class="fav-icon">${favoriteStatus ? '💔' : '❤️'}</span>
                    <span class="fav-text">${favoriteStatus ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}</span>
                </button>
            </div>
            
            <div class="extra-info">
                <p><strong>Lenguaje:</strong> ${show.language}</p>
                <p><strong>Cadena:</strong> ${show.network?.name || show.webChannel?.name || 'N/A'}</p>
            </div>

            <a href="index.html" class="back-link"> Volver al catálogo</a>
        </div>
    `;

    // 4. Lógica de Toggle para el botón de favoritos (DOM Manipulation en tiempo real)
    const favBtn = document.getElementById("fav-btn-detail");
    favBtn.addEventListener("click", () => {
        if (isFavorite(show.id)) {
            removeFavorite(show.id);
            favBtn.classList.remove("is-active");
            favBtn.querySelector(".fav-icon").textContent = "❤️";
            favBtn.querySelector(".fav-text").textContent = "Agregar a Favoritos";
        } else {
            addFavorite(show);
            favBtn.classList.add("is-active");
            favBtn.querySelector(".fav-icon").textContent = "💔";
            favBtn.querySelector(".fav-text").textContent = "Quitar de Favoritos";
        }
    });
}

// Arrancar la página
initDetails();