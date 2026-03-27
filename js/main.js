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

// --- EVENTOS DE BÚSQUEDA CORREGIDOS ---
const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const query = input.value.trim();
        
        // Si el usuario borra la búsqueda y da enter, cargamos todo de nuevo
        if (!query) {
            init(); 
            return;
        }

        try {
            // 1. Mostrar estado de carga (opcional pero recomendado)
            const container = document.getElementById("shows");
            container.innerHTML = '<div class="Loader"><p>Buscando en la base de datos...</p></div>';

            const results = await searchShows(query);
            
            // 2. Actualizar el estado global
            state.shows = results;
            state.filteredShows = results;
            state.currentPage = 1; // REINICIO VITAL: Volver a la página 1

            // 3. Renderizar
            if (results.length === 0) {
                container.innerHTML = `
                    <div class="error-state" style="grid-column: 1/-1; text-align: center; padding: 4rem 0;">
                        <h2 style="font-family: var(--font-display); font-size: 2rem; color: var(--accent);">SIN RESULTADOS</h2>
                        <p style="color: var(--text-secondary);">No encontramos nada para "${query}". Intenta con otra serie.</p>
                    </div>`;
                updatePagination(); // Actualizará el indicador a "Página 1 de 1"
            } else {
                renderCurrentPage();
            }
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

// --- LÓGICA DE FILTROS POR GÉNERO ---
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // 1. Gestionar clases visuales (active)
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // 2. Obtener el género seleccionado
        const selectedGenre = btn.dataset.genre; // Asegúrate que en el HTML tengan data-genre
        state.currentFilter = selectedGenre;

        // 3. Aplicar el filtro sobre la lista original de series
        if (selectedGenre === "All") {
            state.filteredShows = state.shows;
        } else {
            state.filteredShows = state.shows.filter(show => 
                show.genres && show.genres.includes(selectedGenre)
            );
        }

        // 4. Reiniciar a la página 1 y renderizar
        state.currentPage = 1;
        renderCurrentPage();
    });
});

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