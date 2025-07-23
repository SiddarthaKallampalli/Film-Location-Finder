import axios from 'axios';
import API_KEYS from '../config';  // make sure your config.js has TMDB_API_KEY

const TMDB_API_KEY = '330d0becd7ff738543dadb65d401e1fb'; // adjust if needed
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Existing functions...
export const searchMovies = async (query) => {
  const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
    params: {
      api_key: TMDB_API_KEY,
      query,
    },
  });
  return response.data.results;
};

export const getMovieDetails = async (movieId) => {
  const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
    params: {
      api_key: TMDB_API_KEY,
    },
  });
  return response.data;
};

// ➡️ ADD this function here:
export const fetchTopMovies = async () => {
  const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
    params: {
      api_key: TMDB_API_KEY,
      language: 'en-US',
      page: 1,
    },
  });
  return response.data.results;
};
