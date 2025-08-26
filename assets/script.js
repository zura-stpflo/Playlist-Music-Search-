// Elemen
const pages = document.querySelectorAll('.page');
const navItems = document.querySelectorAll('.sidebar nav ul li');
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const miniPlayBtn = document.getElementById('miniPlayBtn');
const progressBar = document.getElementById('progressBar');
const volumeBar = document.getElementById('volumeBar');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const trackCover = document.getElementById('trackCover');
const miniCover = document.getElementById('miniCover');
const miniTitle = document.getElementById('miniTitle');
const downloadBtn = document.getElementById('downloadBtn');
let currentTrack = null;
let queue = [];
let favorites = [];

// Navigasi
navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(item.dataset.page).classList.add('active');
  });
});

// Play Lagu
function playTrack(track) {
  currentTrack = track;
  audio.src = track.url;
  audio.play();
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  trackCover.src = track.thumbnail;
  miniCover.src = track.thumbnail;
  miniTitle.textContent = track.title;
  playBtn.textContent = '⏸️';
  miniPlayBtn.textContent = '⏸️';
  if (!queue.find(q => q.url === track.url)) queue.push(track);
  renderQueue();
}

// Search
document.getElementById('searchBtn').addEventListener('click', async () => {
  const q = document.getElementById('searchInput').value;
  const res = await fetch(`${API_BASE}/search/spotify?apikey=${API_KEY}&q=${q}`);
  const data = await res.json();
  const results = document.getElementById('searchResults');
  results.innerHTML = '';
  data.result.forEach(music => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<img src="${music.thumbnail}" alt=""><h3>${music.title}</h3>`;
    card.onclick = () => playTrack({
      title: music.title,
      artist: music.artist,
      thumbnail: music.thumbnail,
      url: music.url
    });
    results.appendChild(card);
  });
});

// Random Music di Home
async function loadRandom() {
  const res = await fetch(`${API_BASE}/search/spotify?apikey=${API_KEY}&q=top hits`);
  const data = await res.json();
  const container = document.getElementById('randomMusic');
  container.innerHTML = '';
  data.result.slice(0, 8).forEach(music => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<img src="${music.thumbnail}" alt=""><h3>${music.title}</h3>`;
    card.onclick = () => playTrack({
      title: music.title,
      artist: music.artist,
      thumbnail: music.thumbnail,
      url: music.url
    });
    container.appendChild(card);
  });
}
loadRandom();

// Queue
function renderQueue() {
  const container = document.getElementById('queueList');
  container.innerHTML = '';
  queue.forEach(track => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<img src="${track.thumbnail}" alt=""><h3>${track.title}</h3>`;
    card.onclick = () => playTrack(track);
    container.appendChild(card);
  });
}

// Favorit
function addFavorite(track) {
  if (!favorites.find(f => f.url === track.url)) favorites.push(track);
  renderFavorites();
}
function renderFavorites() {
  const container = document.getElementById('favoriteList');
  container.innerHTML = '';
  favorites.forEach(track => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<img src="${track.thumbnail}" alt=""><h3>${track.title}</h3>`;
    card.onclick = () => playTrack(track);
    container.appendChild(card);
  });
}

// Download
downloadBtn.addEventListener('click', async () => {
  if (!currentTrack) return;
  const res = await fetch(`${API_BASE}/download/ytmp3?apikey=${API_KEY}&url=${currentTrack.url}`);
  const data = await res.json();
  window.open(data.result.download_url, '_blank');
});

// Play/Pause
playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = '⏸️';
    miniPlayBtn.textContent = '⏸️';
  } else {
    audio.pause();
    playBtn.textContent = '▶️';
    miniPlayBtn.textContent = '▶️';
  }
});
miniPlayBtn.addEventListener('click', () => playBtn.click());

// Progress
audio.addEventListener('timeupdate', () => {
  progressBar.value = (audio.currentTime / audio.duration) * 100 || 0;
});
progressBar.addEventListener('input', () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

// Volume
volumeBar.addEventListener('input', () => {
  audio.volume = volumeBar.value / 100;
});

// Theme
document.getElementById('toggleTheme').addEventListener('click', () => {
  document.body.classList.toggle('light');
});
