import { getShows, searchShows } from "./service.js";
import { renderShows, updatePagination } from "./ui.js";
import { state } from "./state.js";

function renderCurrentPage() {
    const start = (state.currentPage - 1) * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    renderShows(state.filteredShows.slice(start, end));
    updatePagination();
}

// --- EVENTO: BUSCADOR ---
document.getElementById("searchForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;
    try {
        const results = await searchShows(query);
        state.filteredShows = results;
        state.currentPage = 1;
        renderCurrentPage();
    } catch (error) { console.error(error); }
});

// --- EVENTO: FILTROS DE GÉNERO ---
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".filter-btn.active").classList.remove("active");
        btn.classList.add("active");

        const genre = btn.dataset.genre;
        state.filteredShows = genre === "All" 
            ? state.shows 
            : state.shows.filter(s => s.genres.includes(genre));
        
        state.currentPage = 1;
        renderCurrentPage();
    });
});

// --- EVENTOS DE PAGINACIÓN ---
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

async function init() {
    try {
        state.shows = await getShows();
        state.filteredShows = state.shows;
        renderCurrentPage();
    } catch (error) { console.error("Error:", error); }
}

init();