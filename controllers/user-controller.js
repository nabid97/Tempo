// controllers/user-controller.js
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Import the User model

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, password, role = 'employee' } = req.body; // Default role to 'employee'

        // Validate the role field
        if (!['employer', 'employee'].includes(role)) {
            return res.status(400).json({ error: "Invalid role. Allowed values are 'employer' or 'employee'." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ username, password: hashedPassword, role });

        // Save the user to the database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Username already exists. Please choose a different username.' });
        }
        // Handle other errors
        res.status(400).json({ error: error.message });
    }
};
