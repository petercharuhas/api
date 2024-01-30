"use strict";

const MISSING_IMAGE_URL = "https://tinyurl.com/missing-tv";
const TVMAZE_API_URL = "http://api.tvmaze.com/";

const $showsList = $("#showsList");
const $episodesList = $("#episodesList");

async function getShowsByTerm(term) {
  const response = await axios.get(`${TVMAZE_API_URL}search/shows?q=${term}`);
  return response.data.map(result => ({
    id: result.show.id,
    name: result.show.name,
    summary: result.show.summary,
    image: result.show.image ? result.show.image.medium : MISSING_IMAGE_URL,
  }));
}

function populateShows(shows) {
  $showsList.empty();
  shows.forEach(show => {
    const $show = $(`
        <div data-show-id="${show.id}" class="card mb-3">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${show.image}" alt="${show.name}" class="img-fluid rounded-start">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${show.name}</h5>
                <p class="card-text">${show.summary}</p>
                <button class="btn btn-outline-primary Show-getEpisodes">Episodes</button>
              </div>
            </div>
          </div>
        </div>
      `);
    $showsList.append($show);
  });
}

async function getEpisodesOfShow(id) {
  const response = await axios.get(`${TVMAZE_API_URL}shows/${id}/episodes`);
  return response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));
}

function populateEpisodes(episodes) {
  $episodesList.empty();
  episodes.forEach(episode => {
    const $item = $(`
        <li class="list-group-item">
          ${episode.name} (season ${episode.season}, episode ${episode.number})
        </li>
      `);
    $episodesList.append($item);
  });
  $episodesList.show();
}

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);
  populateShows(shows);
}

async function getEpisodesAndDisplay(evt) {
  const showId = $(evt.target).closest(".card").data("show-id");
  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
}

$showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay);

$("#searchForm").on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});
