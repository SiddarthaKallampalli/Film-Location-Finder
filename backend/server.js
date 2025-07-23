const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Location = require('./models/Location'); // Ensure this path is correct

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors()); // allows all origins



// Middleware to parse JSON bodies
app.use(express.json());

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Make sure 'uploads/' directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Adding timestamp to filenames to avoid conflicts
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
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

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// POST route to create location (with multiple images)
app.post('/api/locations', upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, movie, latitude, longitude } = req.body;
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    if (!name || !description || !latitude || !longitude) {
      return res.status(400).json({ message: 'Name, description, latitude, and longitude are required' });
    }

    const newLocation = new Location({
      name,
      description,
      movie: movie || null,
      latitude,
      longitude,
      images,
    });

    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add location', error: error.message });
  }
});


// GET route to fetch all locations OR search
app.get("/api/locations", async (req, res) => {
  const query = req.query.q;
  try {
    const locations = query
      ? await Location.find({ $text: { $search: query } })
      : await Location.find();

    const normalizedLocations = locations.map(loc => {
      let imageList = [];

      // Normalize 'images' field to always be an array
      if (Array.isArray(loc.images)) {
        imageList = loc.images;
      } else if (typeof loc.images === "string") {
        imageList = [loc.images];
      } else if (Array.isArray(loc.image)) {
        imageList = loc.image;
      } else if (typeof loc.image === "string") {
        imageList = [loc.image];
      }

      // Convert to full URLs
      const images = imageList.map(img => 
        img.startsWith("http") ? img : `http://localhost:5000${img}`
      );

      return {
        ...loc._doc,
        images,
      };
    });

    res.status(200).json(normalizedLocations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch locations", error: error.message });
  }
});


// GET route for a single location
app.get('/api/locations/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json(location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE route to delete a location
app.delete('/api/locations/:id', async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete location' });
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
