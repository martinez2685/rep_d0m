const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock user database
let users = [];

// User registration endpoint
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    // Simple validation
    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }
    // Check if user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).send('User already exists.');
    }
    // Create new user
    users.push({ username, password });
    res.status(201).send('User registered successfully.');
});

// User login endpoint
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    // Validate user credentials
    if (!user || user.password !== password) {
        return res.status(401).send('Invalid credentials.');
    }
    // Generate JWT token
    const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
});

// Get user profile endpoint
router.get('/profile', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
    if (!token) {
        return res.status(401).send('Token is required.');
    }
    // Verify token
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token.');
        }
        const user = users.find(u => u.username === decoded.username);
        res.json({ username: user.username });
    });
});

module.exports = router;