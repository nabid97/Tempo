// routes/user-routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller'); // Import the user controller

// Define the register route
router.post('/register', userController.register);

module.exports = router;
