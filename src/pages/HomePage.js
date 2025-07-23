import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, IMAGE_BASE_URL } from '../config'; // or './constants' or the correct path

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [popularLocations, setPopularLocations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularLocations = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/locations`);
        console.log(res.data);
        setPopularLocations(res.data.slice(0, 5)); // Take top 5 locations
      } catch (error) {
        console.error('Failed to fetch locations', error);
      }
    };

    fetchPopularLocations();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Banner */}
      <div style={bannerStyle}>
        <div style={overlayStyle}>
          <h1 style={titleStyle}>
            📍 Welcome to <span style={{ color: '#00FF00' }}>Cinespot</span>
          </h1>
          <p style={subtitleStyle}>
            Your ultimate platform for location scouting and discovering iconic film spots.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ marginTop: '20px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a movie or location..."
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Popular Locations */}
      <section style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>🎥 Popular Locations</h2>

        <div style={gridStyle}>
          {popularLocations.map((location) => (
            <div
              key={location._id}
              style={cardStyle}
              onClick={() => navigate(`/location/${location._id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              {/* Displaying images from the "images" array */}
              {location.images && location.images.length > 0 ? (
                <img
                  src={location.images[0]} // Display the first image in the array
                  alt={location.name}
                  style={imageStyle}
                />
              ) : (
                <img
                  src='https://via.placeholder.com/300x200?text=No+Image'
                  alt="No image available"
                  style={imageStyle}
                />
              )}
              <h3 style={{ marginTop: '10px', color: '#333' }}>{location.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
  <p style={footerTextStyle}>© 2025 Cinespot. All rights reserved.</p>
  <p style={footerTextStyle}>Follow us on social media!</p>
  <div style={iconContainerStyle}>
    <a href="https://github.com/Siddhu79-icon" target="_blank" rel="noopener noreferrer" style={iconLinkStyle}>
      <i className="fab fa-github"></i> GitHub
    </a>
    <a href="https://www.linkedin.com/in/siddartha-kallampalli-a8982a2a3?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" style={iconLinkStyle}>
      <i className="fab fa-linkedin"></i> LinkedIn
    </a>
    <a href="https://www.instagram.com/siddhu_chowdary_1?igsh=Mzc2Z2ExZ3JxN3Rt" target="_blank" rel="noopener noreferrer" style={iconLinkStyle}>
      <i className="fab fa-instagram"></i> Instagram
    </a>
  </div>
</footer>

    </div>
  );
};

export default HomePage;

// --- Styles ---
const bannerStyle = {
  backgroundImage: 'url(https://images.unsplash.com/photo-1503437313881-503a91226402)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '70vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
};

const overlayStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  padding: '40px',
  borderRadius: '12px',
  textAlign: 'center',
};

const titleStyle = {
  fontSize: '3rem',
  color: '#fff',
  marginBottom: '10px',
};

const subtitleStyle = {
  fontSize: '1.3rem',
  color: '#ddd',
};

const inputStyle = {
  padding: '10px',
  width: '280px',
  marginRight: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '10px 20px',
  borderRadius: '5px',
  backgroundColor: '#00FF00',
  color: 'black',
  fontWeight: 'bold',
  border: 'none',
  cursor: 'pointer',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
};

const cardStyle = {
  backgroundColor: '#f9f9f9',
  padding: '10px',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};

const imageStyle = {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '10px',
};

const footerStyle = {
  backgroundColor: '#333',
  color: '#fff',
  padding: '20px',
  textAlign: 'center',
  marginTop: 'auto',
};

const footerTextStyle = {
  fontSize: '1rem',
  margin: '5px 0',
};
const iconContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  marginTop: '10px',
  flexWrap: 'wrap',
};

const iconLinkStyle = {
  color: '#00FF00',
  fontWeight: 'bold',
  textDecoration: 'none',
  fontSize: '1rem',
};
