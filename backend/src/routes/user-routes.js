const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');

// Define auth routes with proper prefixes
router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);

module.exports = router;