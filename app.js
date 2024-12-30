// Importing necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const socketIo = require('socket.io');
const http = require('http');
const cors = require('cors');

// Initialize app and middleware
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
const DB_URI = "mongodb://mongo:27017/jobPlatform"; // Containerized MongoDB
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Schemas and Models
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['employer', 'employee'], required: true }
});
const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const User = mongoose.model('User', UserSchema);
const Job = mongoose.model('Job', JobSchema);

// User registration
app.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// User login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ userId: user._id, role: user.role }, 'secretKey', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Middleware for authentication
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided' });
    try {
        const decoded = jwt.verify(token, 'secretKey');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Post a job (Employer only)
app.post('/jobs', authenticate, async (req, res) => {
    if (req.user.role !== 'employer') return res.status(403).json({ error: 'Access denied' });
    try {
        const { title, description } = req.body;
        const job = new Job({ title, description, employerId: req.user.userId });
        await job.save();
        res.status(201).json({ message: 'Job posted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Apply for a job (Employee only)
app.post('/jobs/:id/apply', authenticate, async (req, res) => {
    if (req.user.role !== 'employee') return res.status(403).json({ error: 'Access denied' });
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        job.applicants.push(req.user.userId);
        await job.save();
        res.json({ message: 'Applied successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Real-time messaging
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('sendMessage', ({ from, to, message }) => {
        io.to(to).emit('receiveMessage', { from, message });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));