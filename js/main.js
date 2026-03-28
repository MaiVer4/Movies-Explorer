import { getShows, searchShows } from "./service.js";
import { renderShows, updatePagination, renderSearchHistory, toggleSearchHistory } from "./ui.js";
import { state } from "./state.js";
import { addFavorite, removeFavorite, isFavorite, getFavorites, saveSearchTerm } from "./persistence.js";

// --- LÓGICA DE RENDERIZADO CENTRAL ---
function renderCurrentPage() {
    const start = (state.currentPage - 1) * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    const paginated = state.filteredShows.slice(start, end);
    
    renderShows(paginated);
    updatePagination();
}

// --- FUNCIÓN PARA EL CONTADOR (BADGE) ---
function updateFavCount() {
    const badge = document.getElementById("fav-count");
    if (badge) {
        const favorites = getFavorites(); 
        badge.textContent = favorites.length;
        badge.style.display = favorites.length > 0 ? "flex" : "none";
    }
}

// --- EVENTOS DE BÚSQUEDA ---
const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");

if (form && input) {
    // 1. Doble clic para mostrar historial
    input.addEventListener("dblclick", () => {
        renderSearchHistory();
        toggleSearchHistory(true);
    });

    // 2. Cerrar historial si se hace clic fuera del buscador
    document.addEventListener("click", (e) => {
        if (!e.target.closest("#searchForm")) {
            toggleSearchHistory(false);
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const query = input.value.trim();
        
        if (!query) {
            init(); 
            return;
        }

        // Persistencia del historial
        saveSearchTerm(query);
        renderSearchHistory();
        toggleSearchHistory(false); // Ocultar al buscar

        try {
            const container = document.getElementById("shows");
            container.innerHTML = '<div class="Loader"><p>Buscando en la base de datos...</p></div>';

            const results = await searchShows(query);
            
            state.shows = results;
            state.filteredShows = results;
            state.currentPage = 1; 

            if (results.length === 0) {
                container.innerHTML = `
                    <div class="error-state" style="grid-column: 1/-1; text-align: center; padding: 4rem 0;">
                        <h2 style="font-family: var(--font-display); font-size: 2rem; color: var(--accent);">SIN RESULTADOS</h2>
                        <p style="color: var(--text-secondary);">No encontramos nada para "${query}".</p>
                    </div>`;
                updatePagination(); 
            } else {
                renderCurrentPage();
            }
        } catch (error) {
            console.error("Error en búsqueda:", error);
        }
    });
}

// --- EVENTO DE CLIC GLOBAL (FAVORITOS E HISTORIAL) ---
document.addEventListener("click", (e) => {
    // Lógica de Favoritos
    const favBtn = e.target.closest(".fav-btn");
    if (favBtn) {
        const id = favBtn.dataset.id;
        const show = state.filteredShows.find(s => String(s.id) === String(id)) || 
                     state.shows.find(s => String(s.id) === String(id));

        if (isFavorite(id)) {
            removeFavorite(id);
            favBtn.classList.remove("is-active");
            favBtn.innerHTML = "❤️ Favorito";
        } else if (show) {
            addFavorite(show);
            favBtn.classList.add("is-active");
            favBtn.innerHTML = "💔 Quitar";
        }
        updateFavCount(); 
        return; // Salir para no procesar otros clics
    }

    // Lógica de clic en ítem del historial
    if (e.target.classList.contains("history-item")) {
        const term = e.target.dataset.term;
        input.value = term;
        form.dispatchEvent(new Event("submit")); // Disparar búsqueda
    }
});

// --- EVENTOS DE PAGINACIÓN ---
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const itemsSelect = document.getElementById("itemsPerPage");

if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(state.filteredShows.length / state.itemsPerPage);
        if (state.currentPage < totalPages) {
            state.currentPage++;
            renderCurrentPage();
        }
    });
}

if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderCurrentPage();
        }
    });
}

if (itemsSelect) {
    itemsSelect.addEventListener("change", (e) => {
        state.itemsPerPage = parseInt(e.target.value);
        state.currentPage = 1;
        renderCurrentPage();
    });
}

// --- LÓGICA DE FILTROS POR GÉNERO ---
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const selectedGenre = btn.dataset.genre;
        state.currentFilter = selectedGenre;

        state.filteredShows = (selectedGenre === "All") 
            ? state.shows 
            : state.shows.filter(show => show.genres?.includes(selectedGenre));

        state.currentPage = 1;
        renderCurrentPage();
    });
});

// --- INICIALIZACIÓN ---
async function init() {
    try {
        updateFavCount(); 
        renderSearchHistory();

        const shows = await getShows();
        state.shows = shows;
        state.filteredShows = shows;
        
        renderCurrentPage(); 
    } catch (error) {
        console.error("Error al inicializar la app:", error);
    }
}

init();