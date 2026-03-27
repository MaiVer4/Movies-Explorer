import { getFavorites, removeFavorite } from "./persistence.js";

// Usamos DOMContentLoaded para asegurar que el HTML cargó completamente
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("favorites-list");

    function renderFavoritesPage() {
        if (!container) return;

        const favorites = getFavorites();

        // 1. Limpiar el Loader o contenido previo (¡Importante!)
        container.innerHTML = "";

        // 2. Si no hay favoritos, mostrar un estado vacío elegante
        if (favorites.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 5rem 20px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 4rem; margin-bottom: 20px; opacity: 0.2;">💔</div>
                    <h3 style="font-family: var(--font-display); font-size: 2.5rem; color: var(--text-primary); letter-spacing: 2px; margin-bottom: 10px;">TU COLECCIÓN ESTÁ VACÍA</h3>
                    <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto 30px; line-height: 1.6;">Aún no has guardado ninguna serie. Explora el catálogo y presiona el icono de corazón para añadir series aquí.</p>
                    <a href="index.html" class="search-btn" style="text-decoration: none; display: inline-flex; align-items: center; gap: 8px; justify-content: center;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        Explorar Catálogo
                    </a>
                </div>`;
            return;
        }

        // 3. Renderizar tarjetas (Filtrando datos corruptos por seguridad)
        const htmlCards = favorites
            .filter(show => show && show.id) // Ignora entradas corruptas
            .map(show => {
                const defaultImg = "https://via.placeholder.com/210x295?text=Sin+Imagen";
                const image = show.image?.medium || defaultImg;
                const rating = show.rating?.average ? `<div class="card-rating">⭐ ${show.rating.average}</div>` : '';
                const genre = (show.genres && show.genres.length > 0) ? show.genres[0] : 'TV Show';
                const year = show.premiered ? show.premiered.split('-')[0] : 'N/A';

                // ESTA ES LA ESTRUCTURA EXACTA QUE USA UI.JS
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
                        <button data-id="${show.id}" class="fav-btn is-active">
                            <span class="fav-icon">💔</span>
                            <span class="fav-text">Quitar</span>
                        </button>
                        <div class="card-meta">
                            <span>${year}</span>
                        </div>
                    </div>
                </div>`;
            }).join("");

        container.innerHTML = htmlCards;
    }

    // 4. Escuchar clics para eliminar favoritos y refrescar la vista
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".fav-btn");
        if (btn) {
            const id = btn.dataset.id;
            removeFavorite(id);

            // Animación de salida opcional antes de re-renderizar
            const card = btn.closest('.card');
            if (card) {
                card.style.animation = 'cardOut 0.3s ease forwards';
                setTimeout(() => {
                    renderFavoritesPage();
                    // Actualizar el contador del header si existe
                    updateHeaderBadge();
                }, 300);
            } else {
                renderFavoritesPage();
                updateHeaderBadge();
            }
        }
    });

    // Función auxiliar para actualizar el badge del header si navegas directo
    function updateHeaderBadge() {
        const badge = document.getElementById("fav-count");
        if (badge) {
            const currentCount = getFavorites().length;
            badge.textContent = currentCount;
            badge.style.display = currentCount > 0 ? "flex" : "none";
        }
    }

    // Ejecución inicial
    renderFavoritesPage();
    updateHeaderBadge();
});