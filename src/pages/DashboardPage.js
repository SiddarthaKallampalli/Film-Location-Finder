import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, IMAGE_BASE_URL } from '../config'; // or './constants' or the correct path

import { fetchTopMovies } from '../api/tmdb';  // We'll create this file

const DashboardPage = () => {
  const [totalLocations, setTotalLocations] = useState(0);
  const [topLocations, setTopLocations] = useState([]);
  const [topMovies, setTopMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationResponse = await axios.get(`${API_BASE_URL}/locations`);
        setTotalLocations(locationResponse.data.length);

        const sortedLocations = locationResponse.data.sort((a, b) => a.name.localeCompare(b.name));
        setTopLocations(sortedLocations.slice(0, 5));

        const movies = await fetchTopMovies();
        setTopMovies(movies.slice(0, 5)); // Top 5 Movies
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Cinespot Dashboard</h1>

      <div style={styles.stats}>
        <div style={styles.statBox}>
          <h2>{totalLocations}</h2>
          <p>Total Locations</p>
        </div>

        <div style={styles.shortcuts}>
          
          <Link to="/locations" style={styles.button}>Browse All Locations</Link>
        </div>
      </div>

      <h2 style={styles.sectionTitle}>Top Locations</h2>
      <ul style={styles.list}>
        {topLocations.map((loc) => (
          <li key={loc._id} style={styles.item}>
            {loc.name}
          </li>
        ))}
      </ul>

      <h2 style={styles.sectionTitle}>Top IMDb Movies</h2>
      <ul style={styles.list}>
        {topMovies.map((movie) => (
          <li key={movie.id} style={styles.item}>
            <strong>{movie.title}</strong> ({movie.release_date?.split('-')[0]})
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#111',
    color: '#fff',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '36px',
    marginBottom: '20px',
    color: '#00FF00',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: '40px',
  },
  statBox: {
    backgroundColor: '#1E2A38',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    flex: '0 0 200px',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  statBoxHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
  shortcuts: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
  },
  button: {
    backgroundColor: '#00FF00',
    color: '#000',
    padding: '12px 25px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s, transform 0.3s',
  },
  buttonHover: {
    backgroundColor: '#00cc00',
    transform: 'scale(1.05)',
  },
  sectionTitle: {
    fontSize: '24px',
    marginTop: '40px',
    color: '#00FF00',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  list: {
    marginTop: '20px',
    listStyle: 'none',
    padding: 0,
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#1E2A38',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '10px',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  itemHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
};

export default DashboardPage;
