import API from './config.js';

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResults = document.getElementById("searchResults");
const randomMusic = document.getElementById("randomMusic");

const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const downloadBtn = document.getElementById("downloadBtn");
const favAddBtn = document.getElementById("favAddBtn");

let currentUrl = "";
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

// Fetch random music
async function loadRandom() {
  const res = await fetch(API.search("top hits"));
  const data = await res.json();
  displayMusic(data.result, randomMusic);
}
loadRandom();

// Search
searchBtn.addEventListener("click", async () => {
  const q = searchInput.value.trim();
  if (!q) return;
  const res = await fetch(API.search(q));
  const data = await res.json();
  displayMusic(data.result, searchResults);
});

// Display
function displayMusic(list, container) {
  container.innerHTML = "";
  list.forEach(music => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${music.thumbnail}" alt="">
      <h4>${music.title}</h4>
      <p>${music.artist}</p>
    `;
    card.addEventListener("click", () => playMusic(music));
    container.appendChild(card);
  });
}

// Play
function playMusic(music) {
  cover.src = music.thumbnail;
  title.textContent = music.title;
  artist.textContent = music.artist;
  audio.src = music.url;
  audio.play();
  currentUrl = music.url;
  downloadBtn.onclick = () => window.open(API.download(currentUrl), "_blank");
  favAddBtn.onclick = () => addToFavorites(music);
}

// Favorit
function addToFavorites(music) {
  if (!favorites.find(f => f.url === music.url)) {
    favorites.push(music);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Ditambahkan ke Favorit!");
  }
}
