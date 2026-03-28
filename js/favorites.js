// favorites.js
import { getFavorites, removeFavorite } from "./persistence.js";
import { renderCard } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("favorites-list");

    function renderFavoritesPage() {
        if (!container) return;

        const favorites = getFavorites();
        container.innerHTML = "";

        if (favorites.length === 0) {
            // FIX: Añadimos clase 'empty' para que el CSS se encargue del centrado
            container.classList.add("empty"); 
            container.innerHTML = `
                <div class="empty-favorites animate-in">
                    <div class="empty-icon">💔</div>
                    <h2>TU COLECCIÓN ESTÁ VACÍA</h2>
                    <p>Aún no has guardado ninguna serie. Explora el catálogo y presiona el icono de corazón para añadir series aquí.</p>
                    <a href="index.html" class="search-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        Explorar Catálogo
                    </a>
                </div>`;
            return;
        }

        // Si hay favoritos, removemos la clase 'empty' para que vuelva a ser GRID
        container.classList.remove("empty");
        
        container.innerHTML = favorites
            .filter(show => show && show.id)
            .map((show, index) => renderCard(show, true, index)) // Añadimos index para la mejora 4 de animaciones
            .join("");
    }

    // --- MANEJADOR DE CLICS ---
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".fav-btn");
        if (btn) {
            const id = btn.dataset.id;
            removeFavorite(id);

            const card = btn.closest('.card');
            if (card) {
                // Animación de salida personalizada
                card.style.animation = 'cardOut 0.3s ease forwards';
                setTimeout(() => {
                    renderFavoritesPage();
                    updateHeaderBadge();
                }, 300);
            } else {
                renderFavoritesPage();
                updateHeaderBadge();
            }
        }
    });

    function updateHeaderBadge() {
        const badge = document.getElementById("fav-count");
        if (badge) {
            const currentCount = getFavorites().length;
            badge.textContent = currentCount;
            badge.style.display = currentCount > 0 ? "flex" : "none";
        }
    }

    renderFavoritesPage();
    updateHeaderBadge();
});