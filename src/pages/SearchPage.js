import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL, IMAGE_BASE_URL } from '../config'; // or './constants' or the correct path



const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/locations`);
      const allLocations = response.data;

      const filtered = allLocations.filter(loc =>
        loc.name.toLowerCase().includes(query.toLowerCase())
      );

      setLocations(filtered);
    } catch (err) {
      setError("Failed to fetch locations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Search Locations</h1>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Enter movie or location name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      <ul style={styles.list}>
        {locations.map(location => (
          <li key={location._id} style={styles.listItem}>
            <Link to={`/location/${location._id}`} style={styles.link}>
              <h3>{location.name}</h3>
              <p>{location.description}</p>
              {location.image && (
                <img
                  src={`http://localhost:5000${location.image}`}
                  alt={location.name}
                  style={styles.image}
                />
              )}
            </Link>
          </li>
        ))}
      </ul>

      {locations.length === 0 && !loading && (
        <p>No locations found. Try searching something else!</p>
      )}
    </div>
  );
};

export default SearchPage;

// --- Styles ---
const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#111",
    color: "#00FF00",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    textAlign: "center",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "30px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    width: "300px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#00FF00",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    backgroundColor: "#1E2A38",
    marginBottom: "20px",
    borderRadius: "10px",
    padding: "20px",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  image: {
    width: "100%",
    maxHeight: "300px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "20px",
  },
};
