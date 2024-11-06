const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const router = express.Router();
const mongoUrl = "mongodb+srv://mathews:Rihanna6927@cluster0.16sij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = 'FitnessSocialMediaApp';
const JWT_SECRET = 'your_jwt_secret';

// Initialize MongoDB client
let db;
MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db(dbName); // Set the database object
    })
    .catch(error => {
        console.error('Failed to connect to the database:', error);
    });

// Middleware to verify JWT and extract user ID
function verifyToken(req, res, next) {
    const token = req.cookies.authToken;
    if (!token) return res.status(403).json({ error: 'Token is required' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.userId = decoded.UserId;
        next();
    });
}

// Fetch current user's friends
router.get('/friends', verifyToken, async (req, res) => {
    const userId = req.userId;
    try {
        const user = await db.collection('fitUsers').findOne({ _id: ObjectId(userId) });
        const friends = await db.collection('fitUsers').find({ _id: { $in: user.friends || [] } }).toArray();
        res.json(friends);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching friends list' });
    }
});

// Fetch other users for "People to Follow" section
router.get('/people-to-follow', verifyToken, async (req, res) => {
    const userId = req.userId;
    try {
        const user = await db.collection('fitUsers').findOne({ _id: ObjectId(userId) });
        const peopleToFollow = await db.collection('fitUsers').find({
            _id: { $nin: [ObjectId(userId), ...(user.friends || [])] }
        }).toArray();
        res.json(peopleToFollow);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching people to follow' });
    }
});

// Follow a user
router.post('/follow', verifyToken, async (req, res) => {
    const { friendId } = req.body;
    const userId = req.userId;
    try {
        await db.collection('fitUsers').updateOne(
            { _id: ObjectId(userId) },
            { $addToSet: { friends: ObjectId(friendId) } }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error following user' });
    }
});

// Unfollow a user
router.post('/unfollow', verifyToken, async (req, res) => {
    const { friendId } = req.body;
    const userId = req.userId;
    try {
        await db.collection('fitUsers').updateOne(
            { _id: ObjectId(userId) },
            { $pull: { friends: ObjectId(friendId) } }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error unfollowing user' });
    }
});

module.exports = router;
