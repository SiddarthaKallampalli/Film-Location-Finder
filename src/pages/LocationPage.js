import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, IMAGE_BASE_URL } from '../config'; // or './constants' or the correct path

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS

// Fix leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const LocationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/locations/${id}`);
        setLocation(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch location details.");
      } finally {
        setLoading(false);
      }
    };
    fetchLocation();
  }, [id]);

  if (loading) return <p style={loadingStyle}>Loading...</p>;
  if (error) return <p style={errorStyle}>{error}</p>;
  if (!location) return <p style={errorStyle}>No location found.</p>;

  // Normalize images into array
  const imagesArray = Array.isArray(location.images)
    ? location.images
    : location.images
    ? [location.images]
    : [];

  return (
    <div style={fadeInStyle}>
      <div style={containerStyle}>
        {/* Back Button */}
        <button onClick={() => navigate(-1)} style={backButtonStyle}>
          ← Back
        </button>

        {/* Carousel Image Gallery */}
        <div style={imageContainerStyle}>
          {imagesArray.length > 0 ? (
            <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
              <div className="carousel-inner">
                {imagesArray.map((image, index) => (
                  <div
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                    key={index}
                  >
                    <img
                      src={`http://localhost:5000${image}`}
                      className="d-block w-100"
                      alt={`Location ${location.name} image ${index + 1}`}
                      style={imageStyle}
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/600x400?text=No+Image';
                      }}
                    />
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          ) : (
            <img
              src="https://via.placeholder.com/600x400?text=No+Image"
              alt="No Image"
              style={imageStyle}
            />
          )}
        </div>

        {/* Details */}
        <div style={detailsStyle}>
          <h1 style={titleStyle}>{location.name}</h1>
          <p style={movieStyle}><strong>🎬 Featured in:</strong> {location.movie}</p>
          <p style={descStyle}>{location.description}</p>
        </div>

        {/* Map */}
        <div style={mapWrapperStyle}>
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={13}
            style={{ height: "100%", width: "100%", borderRadius: '15px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[location.latitude, location.longitude]}>
              <Popup>{location.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;

// --- Styles ---
const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '40px',
};

const backButtonStyle = {
  marginBottom: '20px',
  padding: '10px 20px',
  backgroundColor: '#00FF00',
  color: 'black',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'background-color 0.3s ease',
};

const fadeInStyle = {
  animation: 'fadeIn 1s ease-in',
};

const globalStyle = document.createElement('style');
globalStyle.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(globalStyle);

const imageContainerStyle = {
  textAlign: 'center',
  marginBottom: '30px',
};

const imageStyle = {
  width: '100%',
  maxHeight: '500px',
  objectFit: 'cover',
  borderRadius: '15px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  marginBottom: '15px',
};

const detailsStyle = {
  textAlign: 'center',
  marginBottom: '30px',
};

const titleStyle = {
  fontSize: '2.5rem',
  color: '#333',
};

const movieStyle = {
  fontSize: '1.2rem',
  margin: '10px 0',
  color: '#444',
  backgroundColor: '#e0ffe0',
  display: 'inline-block',
  padding: '5px 10px',
  borderRadius: '10px',
};

const descStyle = {
  fontSize: '1.1rem',
  color: '#555',
  marginTop: '10px',
};

const mapWrapperStyle = {
  height: '400px',
  width: '100%',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  borderRadius: '15px',
  overflow: 'hidden',
};

const loadingStyle = {
  textAlign: 'center',
  marginTop: '100px',
  fontSize: '1.5rem',
};

const errorStyle = {
  textAlign: 'center',
  marginTop: '100px',
  color: 'red',
  fontSize: '1.5rem',
};
