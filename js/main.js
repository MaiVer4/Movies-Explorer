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
