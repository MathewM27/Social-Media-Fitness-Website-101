const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const router = express.Router();
const mongoUrl = "mongodb+srv://mathews:Rihanna6927@cluster0.16sij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = 'FitnessSocialMediaApp';
const JWT_SECRET = 'your_jwt_secret';

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

// Like a post
router.post('/disLike-post', verifyToken, async (req, res) => {
    const { postId } = req.body;
    const userId = req.userId;

    try {
        const client = await MongoClient.connect(mongoUrl);
        const db = client.db(dbName); // Use main database name here
        const postCollection = db.collection('post'); // Access the 'post' collection

        // Convert postId to ObjectId
        const updateResult = await postCollection.updateOne(
            { _id: new ObjectId(postId) }, // Convert to ObjectId
            { $addToSet: { dislikes: userId } } // Add userId to likes array if not already present
        );

        if (updateResult.modifiedCount === 1) {
            res.status(200).json({ message: 'Post disliked.' });
        } else {
            res.status(404).json({ error: 'Post not found.' });
        }

        client.close();
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ error: 'Failed to like post.' });
    }
});

module.exports = router;
