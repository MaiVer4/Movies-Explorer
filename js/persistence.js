import { getFavorites as getFromStorage, saveFavorites } from "./storage.js";

// --- CAMBIO AQUÍ: Debes exportar esta función para que favorites.js la vea ---
export function getFavorites() {
    return getFromStorage();
}

export function addFavorite(show) {
    const favorites = getFavorites();
    // Verificamos por ID para cumplir el requisito de no duplicados
    const exists = favorites.some(fav => String(fav.id) === String(show.id));

    if (!exists) {
        favorites.push(show);
        saveFavorites(favorites);
    }
}

export function removeFavorite(id) {
    const favorites = getFavorites();
    // El ID de la API suele ser número, el de dataset es string.
    const updated = favorites.filter(fav => String(fav.id) !== String(id));
    saveFavorites(updated);
}

export function isFavorite(id) {
    const favorites = getFavorites();
    return favorites.some(fav => String(fav.id) === String(id));
}