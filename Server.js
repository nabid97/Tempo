const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const userRoutes = require('./routes/user-routes'); // Import user routes

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const DB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mydb";
mongoose.connect(DB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


// Routes
app.use('/api', userRoutes); // Prefix all user routes with /api

// Default route for API documentation
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Job Platform API!',
        endpoints: {
            register: {
                method: 'POST',
                path: '/api/register',
                description: 'Register a new user (employee or employer).',
            },
            login: {
                method: 'POST',
                path: '/api/login',
                description: 'Login with username and password.',
            }
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
