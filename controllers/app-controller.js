// Controller for handling business logic
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Job = require('../models/Job');

// Post a new job (Employer only)
exports.postJob = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (req.user.role !== 'employer') return res.status(403).json({ error: 'Access denied' });

        const job = new Job({ title, description, employerId: req.user.userId });
        await job.save();
        res.status(201).json({ message: 'Job posted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Apply for a job (Employee only)
exports.applyJob = async (req, res) => {
    try {
        if (req.user.role !== 'employee') return res.status(403).json({ error: 'Access denied' });

        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });

        job.applicants.push(req.user.userId);
        await job.save();
        res.json({ message: 'Applied successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Middleware for authentication
exports.authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, 'secretKey');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};
