import { getShows, searchShows } from "./service.js";
import { renderShows, updatePagination } from "./ui.js";
import { state } from "./state.js";

// --- LÓGICA DE PAGINACIÓN ---
function getPaginatedShows() {
    const start = (state.currentPage - 1) * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    return state.filteredShows.slice(start, end);
}

function renderCurrentPage() {
    const paginated = getPaginatedShows();
    renderShows(paginated);
    updatePagination();
}

// --- EVENTOS ---
const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    try {
        const results = await searchShows(query);
        state.shows = results;
        state.filteredShows = results;
        state.currentPage = 1;
        renderCurrentPage();
    } catch (error) {
        console.error("Error en búsqueda:", error);
    }
});

// Eventos de botones (Prev, Next, ItemsPerPage) se mantienen igual...

async function init() {
    try {
        const shows = await getShows();
        state.shows = shows;
        state.filteredShows = shows;
        renderCurrentPage();
    } catch (error) {
        console.error("Error cargando shows:", error);
    }
}

init();