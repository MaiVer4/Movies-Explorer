import { getFavorites, removeFavorite } from "./persistence.js";
// Puedes importar renderShows de ui.js si quieres reutilizar la misma tarjeta exacta

function renderFavoritesPage() {
    const container = document.getElementById("favorites-list");
    const favorites = getFavorites();

    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Aún no tienes series guardadas.</p>
                <a href="index.html" class="page-btn">Explorar series</a>
            </div>`;
        return;
    }

    container.innerHTML = favorites.map(show => `
        <div class="card">
            <div class="card-img-wrap">
                <img src="${show.image?.medium || ''}" alt="${show.name}" />
                <button class="remove-btn" data-id="${show.id}" title="Eliminar">❌</button>
            </div>
            <div class="card-body">
                <h3 class="card-title">${show.name}</h3>
                <p class="card-meta">${show.genres.join(", ")}</p>
            </div>
        </div>
    `).join("");
}

// Escuchar eliminación
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
        const id = e.target.dataset.id;
        removeFavorite(id);
        renderFavoritesPage(); // Re-renderizamos para actualizar la lista
    }
});

renderFavoritesPage();