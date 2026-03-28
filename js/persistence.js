import { getFavorites as getFromStorage, saveFavorites } from "./storage.js";

export function getFavorites() {
    return getFromStorage();
}

export function addFavorite(show) {
    const favorites = getFavorites();
    const exists = favorites.some(fav => String(fav.id) === String(show.id));

    if (!exists) {
        favorites.push(show);
        saveFavorites(favorites);
    }
}

export function removeFavorite(id) {
    const favorites = getFavorites();
    const updated = favorites.filter(fav => String(fav.id) !== String(id));
    saveFavorites(updated);
}

export function isFavorite(id) {
    const favorites = getFavorites();
    return favorites.some(fav => String(fav.id) === String(id));
}