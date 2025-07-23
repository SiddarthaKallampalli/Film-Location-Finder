import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, IMAGE_BASE_URL } from '../config'; // or './constants' or the correct path


const AdminDashboardPage = () => {
  const [locations, setLocations] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [movie, setMovie] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminAuth');
    if (!isAdmin) navigate('/admin-login');
    else fetchLocations();
  }, [navigate]);

  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/locations`);
      setLocations(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('movie', movie);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    images.forEach(img => formData.append('images', img));

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/locations/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE_URL}/locations`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setName('');
      setDescription('');
      setMovie('');
      setLatitude('');
      setLongitude('');
      setImages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchLocations();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this location?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/locations/${id}`);
      fetchLocations();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1>📍 Admin Dashboard - Manage Locations</h1>

      <section style={{ marginTop: '30px' }}>
        <h2>{editingId ? "Edit Location" : "Add New Location"}</h2>
        <form onSubmit={handleAddLocation}>
          <input type="text" placeholder="Location Name" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} /><br /><br />
          <textarea placeholder="Location Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ ...inputStyle, height: '100px' }} /><br /><br />
          <input type="text" placeholder="Movie Name" value={movie} onChange={(e) => setMovie(e.target.value)} required style={inputStyle} /><br /><br />
          <input type="number" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} required style={inputStyle} /><br /><br />
          <input type="number" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} required style={inputStyle} /><br /><br />
          <input
            type="file"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files);
              setImages(files);
            }}
            style={inputStyle}
            ref={fileInputRef}
          /><br /><br />

          {/* Image Previews */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {images.map((img, index) => (
              <img
                key={index}
                src={URL.createObjectURL(img)}
                alt={`Preview ${index}`}
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
              />
            ))}
          </div>

          <button type="submit" style={buttonStyle}>{editingId ? "Update Location" : "Add Location"}</button>
        </form>
      </section>

      <section style={{ marginTop: '50px' }}>
        <h2>Existing Locations</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {locations.map(loc => (
            <li key={loc._id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <h3>{loc.name}</h3>
              <p>{loc.description}</p>
              <p><strong>Movie:</strong> {loc.movie}</p>
              <button
                onClick={() => {
                  setEditingId(loc._id);
                  setName(loc.name);
                  setDescription(loc.description);
                  setMovie(loc.movie);
                  setLatitude(loc.latitude);
                  setLongitude(loc.longitude);
                  setImages([]);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                style={{ ...buttonStyle, backgroundColor: '#FFA500', marginTop: '10px', marginRight: '10px' }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(loc._id)}
                style={{ ...buttonStyle, backgroundColor: 'red', marginTop: '10px' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

const inputStyle = {
  width: '300px',
  padding: '10px',
  fontSize: '16px',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default AdminDashboardPage;
