const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const userRoutes = require('./routes/user-routes'); // Import user routes

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const DB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mydb"; // Use environment variable or default
mongoose.connect(DB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Register routes
app.use('/api', userRoutes); // Prefix all user routes with /api

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
