import { getShows } from "./service.js";
import { renderShows } from "./ui.js";
import { state } from "./state.js";

async function init() {
    try {
        const shows = await getShows();

        state.shows = shows;
        state.filteredShows = shows;

        renderShows(shows.slice(0, state.itemsPerPage));
    } catch (error) {
        console.error("Error cargando shows:", error);
    }
}
init();
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
        state.searchQuery = query;
        state.shows = results; // Actualizamos la base
        state.filteredShows = results; // Y los filtros
        state.currentPage = 1; // Reset a página 1
        renderCurrentPage();
    } catch (error) {
        console.error("Error en búsqueda:", error);
    }
});

document.getElementById("next").addEventListener("click", () => {
    const totalPages = Math.ceil(state.filteredShows.length / state.itemsPerPage);
    if (state.currentPage < totalPages) {
        state.currentPage++;
        renderCurrentPage();
    }
});

document.getElementById("prev").addEventListener("click", () => {
    if (state.currentPage > 1) {
        state.currentPage--;
        renderCurrentPage();
    }
});

document.getElementById("itemsPerPage").addEventListener("change", (e) => {
    state.itemsPerPage = parseInt(e.target.value);
    state.currentPage = 1;
    renderCurrentPage();
});

// --- INICIALIZACIÓN ---
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