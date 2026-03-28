import { getShows, searchShows } from "./service.js";
import { renderShows, updatePagination, renderSearchHistory, toggleSearchHistory, buildGenreFilters, setActiveFilter } from "./ui.js";
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

// --- EVENTOS DE BÚSQUEDA (CON HISTORIAL) ---
const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");

if (form && input) {
    // 1. Mostrar historial
    input.addEventListener("dblclick", () => {
        renderSearchHistory();
        toggleSearchHistory(true);
    });

    // 2. Cerrar historial al hacer clic fuera
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

    // 1. Resetear el estado de filtros para que la búsqueda sea global
    state.currentFilter = "All"; 
    setActiveFilter("All"); // Esto usará la función de ui.js para iluminar "Todos"

    // 2. Persistencia y ocultar historial
    saveSearchTerm(query);
    renderSearchHistory();
    toggleSearchHistory(false);

    try {
        const container = document.getElementById("shows");
        container.innerHTML = '<div class="Loader"><p>Buscando en la base de datos...</p></div>';

        const results = await searchShows(query);
        
        // 3. Actualizar el estado con los resultados de la búsqueda
        state.shows = results;
        state.filteredShows = results;
        state.currentPage = 1; 

        if (results.length === 0) {
            // ... (tu lógica de error actual)
        } else {
            renderCurrentPage();
        }
    } catch (error) {
        console.error("Error en búsqueda:", error);
    }
    });
}

// --- EVENTO DE CLIC GLOBAL (FAVORITOS E ÍTEMS DEL HISTORIAL) ---
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
        return;
    }

    // Lógica de clic en el historial
    if (e.target.classList.contains("history-item")) {
        const term = e.target.dataset.term;
        input.value = term;
        form.dispatchEvent(new Event("submit"));
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

// --- NUEVA LÓGICA DE FILTROS DINÁMICOS ---
function applyGenreFilter(genre) {
    state.currentFilter = genre;
    state.filteredShows = (genre === "All") 
        ? state.shows 
        : state.shows.filter(show => show.genres?.includes(genre));

    state.currentPage = 1;
    renderCurrentPage();
}

// --- INICIALIZACIÓN ---
async function init() {
    try {
        updateFavCount(); 
        renderSearchHistory();

        const shows = await getShows();
        state.shows = shows;
        state.filteredShows = shows;
        
        // Aquí se construyen los filtros automáticamente usando los datos de la API
        buildGenreFilters(shows, applyGenreFilter);

        renderCurrentPage(); 
    } catch (error) {
        console.error("Error al inicializar la app:", error);
    }
}

init();