import { state } from "./state.js";
import { isFavorite } from "./persistence.js"; 

/**
 * Genera el HTML de una tarjeta de serie
 * @param {Object} show - Datos de la serie
 * @param {Boolean} forceFavorite - Si es true, ignora el chequeo y marca como favorito
 */
export function renderCard(show, forceFavorite = false) {
    const favoriteStatus = forceFavorite || isFavorite(show.id);
    const defaultImg = "https://via.placeholder.com/210x295?text=Sin+Imagen";
    
    // Fallback de imagen
    const image = show.image?.medium || defaultImg;
    const rating = show.rating?.average ? `<div class="card-rating">⭐ ${show.rating.average}</div>` : '';
    const genre = (show.genres && show.genres.length > 0) ? show.genres[0] : 'TV Show';
    const year = show.premiered ? show.premiered.split('-')[0] : 'N/A';

    return `
        <div class="card animate-in">
            <a href="show.html?id=${show.id}" class="card-link">
                <div class="card-img-wrap">
                    <img src="${image}" alt="${show.name}" loading="lazy" />
                    <div class="card-overlay">
                        <div class="card-play">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M5 3l14 9-14 9V3z"/>
                            </svg>
                        </div>
                    </div>
                    ${rating}
                    <div class="card-genre">${genre}</div>
                </div>
            </a>
            <div class="card-body">
                <h3 class="card-title">${show.name}</h3>
                <button data-id="${show.id}" class="fav-btn ${favoriteStatus ? 'is-active' : ''}">
                    <span class="fav-icon">${favoriteStatus ? "💔" : "❤️"}</span>
                    <span class="fav-text">${favoriteStatus ? "Quitar" : "Favorito"}</span>
                </button>
                <div class="card-meta">
                    <span>${year}</span>
                </div>
            </div>
        </div>
    `;
}

export function renderShows(shows) {
    const container = document.getElementById("shows");
    if (!container) return;

    if (shows.length === 0) {
        // MEJORA 3: Aplicando la clase .empty-favorites definida en CSS
        container.innerHTML = `
            <div class="empty-favorites animate-in">
                <div class="empty-icon">🎬</div>
                <h2>No se encontraron resultados</h2>
                <p>Intenta ajustar tus filtros o buscar otro término. ¡La cartelera es inmensa!</p>
            </div>`;
        return;
    }

    container.innerHTML = shows.map(show => renderCard(show)).join("");
}

export function updatePagination() {
    const totalPages = Math.ceil(state.filteredShows.length / state.itemsPerPage);
    const indicator = document.getElementById("pageIndicator");
    if (indicator) {
        indicator.textContent = `Página ${state.currentPage} de ${totalPages || 1}`;
    }
    
    // Control de estado de botones
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    
    if (prevBtn) prevBtn.disabled = state.currentPage === 1;
    if (nextBtn) nextBtn.disabled = state.currentPage >= totalPages || totalPages === 0;
}