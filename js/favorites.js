import { getFavorites, removeFavorite } from "./persistence.js";
import { renderCard } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("favorites-list");

    /**
     * Renderiza la página de favoritos usando la función compartida de ui.js
     */
    function renderFavoritesPage() {
        if (!container) return;

        const favorites = getFavorites();

        // 1. Limpiar contenedor
        container.innerHTML = "";

        // 2. Estado vacío si no hay favoritos
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

        // 3. Renderizar usando la función compartida de ui.js
        // Pasamos true como segundo argumento para forzar el estado visual de "favorito"
        container.innerHTML = favorites
            .filter(show => show && show.id)
            .map(show => renderCard(show, true)) 
            .join("");
    }

    /**
     * Manejador de eventos para eliminar favoritos
     */
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".fav-btn");
        if (btn) {
            const id = btn.dataset.id;
            removeFavorite(id);

            // Animación de salida antes de refrescar
            const card = btn.closest('.card');
            if (card) {
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

    /**
     * Actualiza el contador del header (Badge)
     */
    function updateHeaderBadge() {
        const badge = document.getElementById("fav-count");
        if (badge) {
            const currentCount = getFavorites().length;
            badge.textContent = currentCount;
            badge.style.display = currentCount > 0 ? "flex" : "none";
        }
    }

    // Inicialización
    renderFavoritesPage();
    updateHeaderBadge();
});