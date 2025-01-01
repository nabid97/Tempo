const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, password, role = 'employee' } = req.body;

        // Validate role
        if (!['employer', 'employee'].includes(role)) {
            return res.status(400).json({ error: "Invalid role. Allowed values are 'employer' or 'employee'." });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in register:', error);

        // Handle duplicate username error
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Username already exists. Please choose a different username.' });
        }

        res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
    }
};

// Login a user
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
    }
};
