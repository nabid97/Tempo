// routes/app-routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/app-controller'); // Adjust path if necessary

// Define routes
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/jobs', controller.authenticate, controller.postJob);
router.post('/jobs/:id/apply', controller.authenticate, controller.applyJob);

module.exports = router;
