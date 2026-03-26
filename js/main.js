import { getShows, searchShows } from "./service.js";
import { renderShows, updatePagination } from "./ui.js";
import { state } from "./state.js";
import { addFavorite, removeFavorite, isFavorite } from "./persistence.js";


// --- LÓGICA DE RENDERIZADO CENTRAL ---
function renderCurrentPage() {
    const start = (state.currentPage - 1) * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    
    // Usamos filteredShows para que funcione con búsquedas y filtros
    const paginated = state.filteredShows.slice(start, end);
    
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
        renderCurrentPage(); // <-- Aquí ya usa la cantidad elegida
    } catch (error) {
        console.error("Error en búsqueda:", error);
    }
});

// Escuchamos clics en todo el documento
document.addEventListener("click", (e) => {
    const favBtn = e.target.closest(".fav-btn");
    
    if (favBtn) {
        const id = favBtn.dataset.id;
        const show = state.shows.find(s => s.id == id);

        if (show) {
            // LÓGICA DE TOGGLE REAL
            if (isFavorite(id)) {
                removeFavorite(id);
                favBtn.classList.remove("is-active");
                favBtn.innerHTML = "❤️ Agregar a Favoritos";
            } else {
                addFavorite(show);
                favBtn.classList.add("is-active");
                favBtn.innerHTML = "💔 Quitar de Favoritos";
            }
        }
    }
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

// ESTA ES LA CLAVE: El evento del selector
document.getElementById("itemsPerPage").addEventListener("change", (e) => {
    state.itemsPerPage = parseInt(e.target.value); // Convertimos el texto "20" a número 20
    state.currentPage = 1; // Siempre volvemos a la 1
    renderCurrentPage(); // ¡Ahora sí mostrará 20!
});

// --- INICIALIZACIÓN ---
async function init() {
    try {
        const shows = await getShows();
        state.shows = shows;
        state.filteredShows = shows;
        
        // IMPORTANTE: No usamos .slice aquí, dejamos que renderCurrentPage haga su magia
        renderCurrentPage(); 
    } catch (error) {
        console.error("Error cargando shows:", error);
    }
}

init();