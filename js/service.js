const BASE_URL = "https://api.tvmaze.com";

export async function getShows() {
    const res = await fetch(`${BASE_URL}/shows`);
    return await res.json();
}

export async function searchShows(query) {
    const res = await fetch(`${BASE_URL}/search/shows?q=${query}`);
    const data = await res.json();
    
    //Mapeamos los resultados para devolver solo la info del show
    return data.map(item => item.show); 
}

export async function getShowById(id) {
    const res = await fetch(`${BASE_URL}/shows/${id}`);
    return await res.json();
}