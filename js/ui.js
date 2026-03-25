import { state } from "./state.js";

export function renderShows(shows) {
    const container = document.getElementById("shows");
    const defaultImg = "https://via.placeholder.com/210x295?text=Sin+Imagen";

    container.innerHTML = shows.map(show => `
        <div class="card">
            <div class="card-img-wrap">
                <img src="${show.image?.medium || defaultImg}" alt="${show.name}" />
                <div class="card-overlay">
                    <div class="card-play">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 3l14 9-14 9V3z"/></svg>
                    </div>
                </div>
                ${show.rating?.average ? `<div class="card-rating">⭐ ${show.rating.average}</div>` : ''}
                <div class="card-genre">${show.genres[0] || 'TV Show'}</div>
            </div>
            <div class="card-body">
                <h3 class="card-title">${show.name}</h3>
                <div class="card-meta">
                    <span>${show.premiered?.split('-')[0] || 'N/A'}</span>
                    <span class="card-meta-dot"></span>
                    <span>${show.language}</span>
                </div>
            </div>
        </div>
    `).join("");
}

export function updatePagination() {
    const totalPages = Math.ceil(state.filteredShows.length / state.itemsPerPage);
    const indicator = document.getElementById("pageIndicator");
    if (indicator) {
        indicator.textContent = `Página ${state.currentPage} de ${totalPages || 1}`;
    }
}