const FAVORITES_KEY = "favorites";

/**
 * Intenta parsear un JSON de forma segura. 
 * Si falla, devuelve un array vacío en lugar de romper la app.
 */
function safeParse(data) {
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error("Error al parsear favoritos de localStorage, reseteando a []:", e);
        return [];
    }
}

export function getFavorites() {
    const data = localStorage.getItem(FAVORITES_KEY);
    // FIX 1: Uso de safeParse para evitar excepciones críticas
    return data ? safeParse(data) : [];
}

export function saveFavorites(favorites) {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
        console.error("No se pudo guardar en localStorage (posible cuota excedida):", e);
    }
}