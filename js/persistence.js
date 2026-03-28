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

const SEARCH_HISTORY_KEY = "search_history";

export function getSearchHistory() {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
}

export function saveSearchTerm(term) {
    if (!term) return;
    let history = getSearchHistory();
    
    // Evitar duplicados y mantener solo las últimas 5 búsquedas
    history = history.filter(item => item.toLowerCase() !== term.toLowerCase());
    history.unshift(term); 
    history = history.slice(0, 5); 
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
}