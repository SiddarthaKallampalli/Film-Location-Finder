import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL, IMAGE_BASE_URL } from '../config'; // or './constants' or the correct path



const AddLocationPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [movie, setMovie] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("movie", movie);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    if (image) formData.append("image", image);

    try {
      await axios.post(`${API_BASE_URL}/locations`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Location added successfully!");
      // Optionally, redirect or reset form
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Error adding location");
      } else {
        setError("Image upload failed or form submission issue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add New Location</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Movie:</label>
          <input type="text" value={movie} onChange={(e) => setMovie(e.target.value)} required />
        </div>
        <div>
          <label>Latitude:</label>
          <input type="number" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
        </div>
        <div>
          <label>Longitude:</label>
          <input type="number" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Location"}
        </button>
      </form>
    </div>
  );
};

export default AddLocationPage;
