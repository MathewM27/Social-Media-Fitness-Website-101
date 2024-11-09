const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { connectToDb } = require('../config/db'); // Adjust the path to match your db connection module
const cookieParser = require('cookie-parser'); // Import cookie-parser

router.use(cookieParser()); // Use cookie-parser middleware

const JWT_SECRET = 'your_jwt_secret'; // JWT secret for access token
const JWT_REFRESH_SECRET = 'your_jwt_refresh_secret'; // JWT secret for refresh token
const ACCESS_TOKEN_EXPIRY = '1h'; // Expiry for access token
const REFRESH_TOKEN_EXPIRY = '7d'; // Expiry for refresh token

// Signup route
router.post('/signup', async (req, res) => {
    const { firstname, lastname, username, email, telephone, address, purpose, password } = req.body;

    if (!firstname || !lastname || !username || !email || !telephone || !address || !purpose || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const db = await connectToDb();
        const usersCollection = db.collection('fitUsers'); // Ensure this is the correct collection name

        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await usersCollection.insertOne({
            firstname,
            lastname,
            username,
            email,
            telephone,
            address,
            purpose,
            password: hashedPassword,
            friends: []

        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const db = await connectToDb();
        const usersCollection = db.collection('fitUsers');

        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'User not found. Please sign up.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Create JWT and refresh token
        const token = jwt.sign({ UserId: user._id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        const refreshToken = jwt.sign({ UserId: user._id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

        // Send tokens in response
        res.json({
            message: 'Welcome Back!',
            token,
            refreshToken,
            username: user.username,
            profileName: user.profileName,
            profileBio: user.profileBio,
            profileImage: user.profileImage
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Token refresh endpoint
router.post('/refresh-token', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).send('Refresh token required');

    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const newToken = jwt.sign({ UserId: decoded.UserId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        res.json({ token: newToken });
    } catch (error) {
        res.status(400).send('Invalid refresh token');
    }
});

module.exports = router;
