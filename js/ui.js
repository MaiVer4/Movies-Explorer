import { state } from "./state.js";
import { isFavorite } from "./persistence.js"; 

/**
 * @param {Object} show - Datos de la serie
 * @param {Boolean} forceFavorite - Si es true, ignora el chequeo
 * @param {Number} index - Índice de la tarjeta para la animación escalonada
 */
export function renderCard(show, forceFavorite = false, index = 0) {
    const favoriteStatus = forceFavorite || isFavorite(show.id);
    const defaultImg = "https://via.placeholder.com/210x295?text=Sin+Imagen";
    const image = show.image?.medium || defaultImg;
    const rating = show.rating?.average ? `<div class="card-rating">⭐ ${show.rating.average}</div>` : '';
    const genre = (show.genres && show.genres.length > 0) ? show.genres[0] : 'TV Show';
    const year = show.premiered ? show.premiered.split('-')[0] : 'N/A';

    // MEJORA 4: Inyectamos la variable CSS --i basada en el índice
    return `
        <div class="card animate-in" style="--i: ${index}">
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
        container.innerHTML = `
            <div class="empty-favorites animate-in">
                <div class="empty-icon">🎬</div>
                <h2>No se encontraron resultados</h2>
                <p>Intenta ajustar tus filtros o buscar otro término.</p>
            </div>`;
        return;
    }

    // Pasamos el índice (i) a renderCard
    container.innerHTML = shows.map((show, i) => renderCard(show, false, i)).join("");
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