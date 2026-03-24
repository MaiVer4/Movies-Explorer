const BASE_URL = "https://api.tvmaze.com";

export async function getShows() {
    const res = await fetch(`${BASE_URL}/shows`);
    return await res.json();
}

export async function searchShows(query) {
    const res = await fetch(`${BASE_URL}/search/shows?q=${query}`);
    return await res.json();
}

export async function getShowById(id) {
    const res = await fetch(`${BASE_URL}/shows/${id}`);
    return await res.json();
}