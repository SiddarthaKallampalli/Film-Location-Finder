import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL, IMAGE_BASE_URL } from '../config'; // or './constants' or the correct path

import { searchMovies, getMovieDetails } from '../api/tmdb'; // getMovieDetails added

const SearchResultsPage = () => {
  const [locations, setLocations] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const queryParams = new URLSearchParams(search);
      const query = queryParams.get('q');

      if (!query) return;

      try {
        // Fetch your location results
        const locationsResponse = await axios.get(`${API_BASE_URL}/locations?q=${query}`);
        setLocations(locationsResponse.data);

        // Fetch TMDB search results
        const basicMovies = await searchMovies(query);

        // Now fetch full details for each movie
        const detailedMovies = await Promise.all(
          basicMovies.map(async (movie) => {
            try {
              const details = await getMovieDetails(movie.id);
              return { ...movie, ...details };  // Merge basic + detailed data
            } catch (error) {
              console.error(`Failed to fetch details for movie ID: ${movie.id}`, error);
              return movie; // fallback to basic if error
            }
          })
        );

        setMovies(detailedMovies);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch results.');
        setLoading(false);
      }
    };

    fetchData();
  }, [search]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Search Results</h1>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* Your Locations */}
      {locations.length > 0 && (
        <>
          <h2>📍 Locations (From Your DB)</h2>
          <ul style={styles.locationList}>
            {locations.map((location) => (
              <li key={location._id}>
                <h3>{location.name}</h3>
                <p>{location.description}</p>
                <button onClick={() => navigate(`/location/${location._id}`)}>View Details</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Movies from TMDB */}
      {movies.length > 0 && (
        <>
          <h2>🎬 Movies (From TMDB)</h2>
          <ul style={styles.movieGrid}>
            {movies.map((movie) => (
              <li key={movie.id} style={styles.movieCard}>
                <h3>{movie.title}</h3>
                {movie.poster_path && (
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                    alt={movie.title} 
                    style={styles.poster}
                  />
                )}
                <p><strong>Overview:</strong> {movie.overview || "No overview available."}</p>
                <p><strong>Production Countries:</strong> 
                  {movie.production_countries?.length > 0
                    ? movie.production_countries.map(c => c.name).join(', ')
                    : "Unknown"}
                </p>
                <p><strong>Production Companies:</strong> 
                  {movie.production_companies?.length > 0
                    ? movie.production_companies.map(c => c.name).join(', ')
                    : "Unknown"}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default SearchResultsPage;

// --- Styles ---
const styles = {
  locationList: {
    listStyle: "none",
    padding: 0,
  },
  movieGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    padding: 0,
    listStyle: "none",
    marginTop: "20px",
  },
  movieCard: {
    backgroundColor: "#1E2A38",
    padding: "20px",
    borderRadius: "10px",
    color: "#00FF00",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
    transition: "transform 0.3s ease-in-out",
    cursor: "pointer",
  },  
  poster: {
    width: "100%",
    height: "300px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
  },
};
