const pages = document.querySelectorAll(".page");
const navItems = document.querySelectorAll(".sidebar nav ul li");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const recommendations = document.getElementById("recommendations");

let audio = new Audio();
let currentSong = null;
let queue = [];
let favorites = [];

// Navigation
navItems.forEach(item => {
  item.addEventListener("click", () => {
    navItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    pages.forEach(p => p.classList.remove("active"));
    document.getElementById(item.dataset.page).classList.add("active");
  });
});

// Search
searchInput?.addEventListener("keyup", async e => {
  if (e.key === "Enter") {
    let query = searchInput.value;
    let res = await fetch(API_URL + encodeURIComponent(query));
    let data = await res.json();
    searchResults.innerHTML = "";
    data.result.forEach(song => {
      let div = document.createElement("div");
      div.innerHTML = `
        <img src="${song.image}" />
        <p>${song.title}</p>
        <button onclick="playSong('${song.url}','${song.title}','${song.artist}','${song.image}')">▶</button>
        <button onclick="addFavorite('${song.url}','${song.title}','${song.artist}','${song.image}')">❤️</button>
      `;
      searchResults.appendChild(div);
    });
  }
});

// Play Song
function playSong(url, title, artist, image) {
  audio.src = url;
  audio.play();
  currentSong = { url, title, artist, image };
  document.getElementById("song-title").textContent = title;
  document.getElementById("song-artist").textContent = artist;
  document.getElementById("cover").src = image;
  document.getElementById("miniTitle").textContent = title;
  queue.push(currentSong);
  renderQueue();
}

// Queue render
function renderQueue() {
  const list = document.getElementById("queueList");
  list.innerHTML = "";
  queue.forEach((s, i) => {
    let li = document.createElement("li");
    li.textContent = `${i+1}. ${s.title} - ${s.artist}`;
    list.appendChild(li);
  });
}

// Favorites
function addFavorite(url, title, artist, image) {
  favorites.push({ url, title, artist, image });
  const favList = document.getElementById("favoritesList");
  let div = document.createElement("div");
  div.innerHTML = `<img src="${image}" /><p>${title}</p>`;
  favList.appendChild(div);
}

// Controls
document.getElementById("play").onclick = () => { audio.paused ? audio.play() : audio.pause(); };
document.getElementById("miniPlay").onclick = () => { audio.paused ? audio.play() : audio.pause(); };
document.getElementById("volume").oninput = e => { audio.volume = e.target.value; };

// Theme toggle
document.getElementById("theme-toggle").onclick = () => {
  document.body.classList.toggle("light");
};
