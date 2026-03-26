import { getFavorites, saveFavorites } from "./storage.js";

export function addFavorite(show) {
    const favorites = getFavorites();
    // Verificamos por ID para cumplir el requisito de no duplicados
    const exists = favorites.some(fav => fav.id === show.id);

    if (!exists) {
        favorites.push(show);
        saveFavorites(favorites);
    }
}

export function removeFavorite(id) {
    const favorites = getFavorites();
    // El ID de la API suele ser número, el de dataset es string. Usamos != 
    const updated = favorites.filter(fav => fav.id != id);
    saveFavorites(updated);
}

export function isFavorite(id) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.id == id);
}