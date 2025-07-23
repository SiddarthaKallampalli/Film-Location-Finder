const express = require('express');
const Location = require('../models/Location');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Set up multer storage and file upload settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory for file uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpg|jpeg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed"));
  },
});

// POST route to create a new location with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, latitude, longitude, movie } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !description || !latitude || !longitude || !movie) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newLocation = new Location({ name, description, movie, latitude, longitude, image });
    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add location', error: error.message });
  }
});

// GET route to search locations or fetch all locations
router.get('/', async (req, res) => {
  const query = req.query.q || '';  // Get search query from URL (e.g., /api/locations?q=central park)
  try {
    const locations = await Location.find({
      $text: { $search: query, $caseSensitive: false }  // Case-insensitive search
    });
    res.status(200).json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch locations', error: error.message });
  }
});

// GET route to fetch a single location by ID
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE route to remove a location by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);
    if (!deletedLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
