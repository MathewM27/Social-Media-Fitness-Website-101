// server/followRoutes.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const router = express.Router();

const JWT_SECRET = 'your_jwt_secret';
const mongoURL = 'mongodb+srv://mathews:Rihanna6927@cluster0.16sij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'FitnessSocialMediaApp';
let db;

router.use(cookieParser());

// Connect to MongoDB
MongoClient.connect(mongoURL)
    .then((client) => {
        db = client.db(dbName);
    })
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Middleware to verify JWT
function verifyToken(req, res, next) {
    const token = req.cookies.authToken;
    if (!token) return res.status(403).json({ error: 'Token is required' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.userId = decoded.UserId;
        next();
    });
}

// Fetch users to follow and current friends separately
router.get('/fetch-people', verifyToken, async (req, res) => {
    try {
        const userId = new ObjectId(req.userId);

        // Fetch the current user's friends
        const currentUser = await db.collection('fitUsers').findOne({ _id: userId });
        const friendsList = currentUser.friends || [];

        // Separate friends and non-friends
        const peopleToFollow = await db.collection('fitUsers')
            .find({ _id: { $ne: userId, $nin: friendsList } })
            .project({ profileName: 1, profileImage: 1 })
            .toArray();

        const friends = await db.collection('fitUsers')
            .find({ _id: { $in: friendsList } })
            .project({ profileName: 1, profileImage: 1 })
            .toArray();

        res.status(200).json({ peopleToFollow, friends });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Follow a user
router.post('/follow', verifyToken, async (req, res) => {
    const { userIdToFollow } = req.body;
    const userId = new (req.userId);

    try {
        await db.collection('fitUsers').updateOne(
            { _id: userId },
            { $addToSet: { friends: new ObjectId(userIdToFollow) } }
        );
        res.json({ message: 'User followed successfully' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Failed to follow user' });
    }
});

// Unfollow a user
router.post('/unfollow', verifyToken, async (req, res) => {
    const { userIdToUnfollow } = req.body;
    const userId = new ObjectId(req.userId);

    try {
        await db.collection('fitUsers').updateOne(
            { _id: userId },
            { $pull: { friends: new ObjectId(userIdToUnfollow) } }
        );
        res.json({ message: 'User unfollowed successfully' });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Failed to unfollow user' });
    }
});

module.exports = router;
