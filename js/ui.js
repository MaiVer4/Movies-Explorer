import { state } from "./state.js";
import { isFavorite, getSearchHistory } from "./persistence.js"; 


/**
 * @param {Object} show - Datos de la serie
 * @param {Boolean} forceFavorite - Si es true, ignora el chequeo
 * @param {Number} index - Índice de la tarjeta para la animación escalonada
 */
export function renderCard(show, forceFavorite = false, index = 0) {
    const favoriteStatus = forceFavorite || isFavorite(show.id);
    const defaultImg = "https://via.placeholder.com/210x295?text=Sin+Imagen";
    const image = show.image?.medium || defaultImg;
    
    const ratingValue = show.rating?.average ? `⭐ ${show.rating.average}` : 'N/A';
    const genre = (show.genres && show.genres.length > 0) ? show.genres[0] : 'TV Show';
    const year = show.premiered ? show.premiered.split('-')[0] : 'N/A';

    return `
        <div class="card animate-in" style="--i: ${index}">
            <a href="show.html?id=${show.id}" class="card-link">
                <div class="card-img-wrap">
                    <img src="${image}" alt="${show.name}" loading="lazy" />
                    
                    <div class="card-genre">${genre}</div>
                    <div class="card-rating">${ratingValue}</div>

                    <div class="card-overlay">
                        <div class="card-play">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M5 3l14 9-14 9V3z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </a>
            <div class="card-body"> 
                <h3 class="card-title">${show.name}</h3>

                 <div class="card-year-label">${year}</div>
                
                <button data-id="${show.id}" class="fav-btn ${favoriteStatus ? 'is-active' : ''}">
                    <span class="fav-icon">${favoriteStatus ? "💔" : "❤️"}</span>
                    <span class="fav-text">${favoriteStatus ? "Quitar" : "Favorito"}</span>
                </button>
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

export function buildGenreFilters(shows, onSelect) {
    const track = document.getElementById("filters-track");
    if (!track) return;
 
    // Extraer géneros únicos de todos los shows, ordenados alfabéticamente
    const genres = [...new Set(shows.flatMap(s => s.genres || []))].sort();
 
    // Construir botones: "Todos" primero, luego cada género
    const buttons = ["All", ...genres].map(genre => {
        const label = genre === "All" ? "Todos" : genre;
        const btn = document.createElement("button");
        btn.className = "filter-btn" + (genre === "All" ? " active" : "");
        btn.dataset.genre = genre;
        btn.innerHTML = `<span class="filter-dot"></span> ${label}`;
        btn.addEventListener("click", () => {
            track.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            onSelect(genre);
        });
        return btn;
    });
 
    track.replaceChildren(...buttons);
}
 
export function setActiveFilter(genre) {
    const track = document.getElementById("filters-track");
    if (!track) return;
    
    const buttons = track.querySelectorAll(".filter-btn");
    buttons.forEach(btn => {
        // Si el dataset.genre coincide, añade 'active', si no, lo quita
        if (btn.dataset.genre === genre) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
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

export function renderSearchHistory() {
    const list = document.getElementById("search-history-list");
    if (!list) return;

    const history = getSearchHistory(); // Trae los datos de persistence.js
    
    if (history.length === 0) {
        list.innerHTML = "";
        list.style.display = "none";
        return;
    }

    // Inyectamos los botones dentro de tu div
    list.innerHTML = `
        <div class="history-header">Búsquedas recientes</div>
        <div class="history-items">
            ${history.map(term => `<button class="history-item" data-term="${term}">🕒 ${term}</button>`).join("")}
        </div>
    `;
}

export function toggleSearchHistory(show) {
    const list = document.getElementById("search-history-list");
    if (list) {
        // Solo mostramos si hay algo que mostrar
        const history = getSearchHistory();
        list.style.display = (show && history.length > 0) ? "block" : "none";
    }
}