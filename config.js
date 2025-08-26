const API_KEY = "zuraxd12";
const BASE_URL = "https://api-zurabotz.vercel.app";

const API = {
  search: (query) => `${BASE_URL}/search/spotify?apikey=${API_KEY}&q=${encodeURIComponent(query)}`,
  download: (url) => `${BASE_URL}/download/ytmp3?apikey=${API_KEY}&url=${encodeURIComponent(url)}`
};

export default API;
