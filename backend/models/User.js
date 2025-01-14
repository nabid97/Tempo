// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true // Ensures usernames are unique
    },
    password: {
        type: String,
        required: true // Passwords are required
    },
    role: {
        type: String,
        enum: ['employer', 'employee'], // Restricts values to employer or employee
        required: true // Role is mandatory
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
