const mongoose = require('mongoose');  // Add this line at the top
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
        res.status(201).json({
            message: 'Job posted successfully',
            job: job  // Include the created job object
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Apply for a job (Employee only)
exports.applyJob = async (req, res) => {
    try {
        // Check if user is an employee
        if (req.user.role !== 'employee') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Validate job ID format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Find the job with populated applicants
        const job = await Job.findById(req.params.id)
            .populate('applicants')
            .populate('employerId');

        // Check if job exists
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Check if user has already applied
        const hasApplied = job.applicants.some(
            applicant => applicant._id.toString() === req.user.userId
        );

        if (hasApplied) {
            return res.status(400).json({ error: 'You have already applied for this job' });
        }

        // Add the applicant
        job.applicants.push(req.user.userId);
        await job.save();

        return res.status(200).json({ 
            message: 'Applied successfully',
            jobTitle: job.title
        });

    } catch (error) {
        // Log the error for debugging
        console.error('Error in applyJob:', error);
        
        // If it's a cast error (invalid ID format), return 404
        if (error.name === 'CastError') {
            return res.status(404).json({ error: 'Job not found' });
        }

        // For all other errors
        return res.status(500).json({ 
            error: 'An unexpected error occurred while processing your application'
        });
    }
};

// Middleware for authentication
exports.authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, 'secretKey');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};