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

// --- FUNCIÓN PARA EL CONTADOR (BADGE) ---
function updateFavCount() {
    const badge = document.getElementById("fav-count");
    if (badge) {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        badge.textContent = favorites.length;
        badge.style.display = favorites.length > 0 ? "flex" : "none";
    }
}

// --- EVENTOS DE BÚSQUEDA ---
const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");

if (form) {
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
}

// --- EVENTO DE CLIC GLOBAL (FAVORITOS) ---
document.addEventListener("click", (e) => {
    const favBtn = e.target.closest(".fav-btn");
    
    if (favBtn) {
        const id = favBtn.dataset.id;
        
        // BUSQUEDA SEGURA: Buscamos en todas las listas posibles del estado
        const show = state.filteredShows.find(s => String(s.id) === String(id)) || 
                     state.shows.find(s => String(s.id) === String(id));

        if (isFavorite(id)) {
            removeFavorite(id);
            favBtn.classList.remove("is-active");
            favBtn.innerHTML = "❤️ Favorito";
        } else {
            // Solo agregamos si encontramos el objeto show completo
            if (show) {
                addFavorite(show);
                favBtn.classList.add("is-active");
                favBtn.innerHTML = "💔 Quitar";
            } else {
                console.warn("No se pudo encontrar la información de la serie para guardar.");
            }
        }
        
        // Actualizamos el número del badge inmediatamente
        updateFavCount(); 
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

// --- INICIALIZACIÓN ---
async function init() {
    try {
        // 1. Cargar contador de favoritos al iniciar
        updateFavCount(); 

        // 2. Obtener series iniciales
        const shows = await getShows();
        state.shows = shows;
        state.filteredShows = shows;
        
        // 3. Renderizar la primera página
        renderCurrentPage(); 
    } catch (error) {
        console.error("Error al inicializar la app:", error);
    }
}

init();