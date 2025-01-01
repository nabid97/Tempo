const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');

// Define user-related routes
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
