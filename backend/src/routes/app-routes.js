const express = require('express');
const router = express.Router();
const appController = require('../controllers/app-controller');

// Define job routes
router.post('/jobs', appController.authenticate, appController.postJob);
router.post('/jobs/:id/apply', appController.authenticate, appController.applyJob);

module.exports = router;