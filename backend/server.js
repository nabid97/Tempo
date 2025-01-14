const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./src/routes/user-routes');
const appRoutes = require('./src/routes/app-routes');

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Atlas connection
const DB_URI = process.env.MONGO_URI;
mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Atlas connected successfully'))
    .catch(err => console.error('MongoDB Atlas connection error:', err));

// Mount routes
app.use('/api', userRoutes);  // Handles /api/auth/...
app.use('/api', appRoutes);   // Handles /api/jobs/...

// Default route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Tempo API!'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Route logging for development
if (process.env.NODE_ENV === 'development') {
    console.log('Registered Routes:');
    app._router.stack.forEach(r => {
        if (r.route && r.route.path) {
            console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
        } else if (r.name === 'router') {
            r.handle.stack.forEach(layer => {
                if (layer.route) {
                    console.log(`${Object.keys(layer.route.methods)} ${'/api' + layer.route.path}`);
                }
            });
        }
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

module.exports = app;