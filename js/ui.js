export function renderShows(shows) {
    const container = document.getElementById("shows");

    container.innerHTML = shows.map(show => `
        <div class="card">
            <img src="${show.image?.medium}" />
            <h3>${show.name}</h3>
            <p>${show.genres.join(", ")}</p>
            <p>⭐ ${show.rating?.average || "N/A"}</p>
        </div>
    `).join("");
}