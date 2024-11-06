const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const router = express.Router();
const mongoUrl = "mongodb+srv://mathews:Rihanna6927@cluster0.16sij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = 'FitnessSocialMediaApp';
const JWT_SECRET = 'your_jwt_secret';

function verifyToken(req, res, next) {
    const token = req.cookies.authToken;
    if (!token) return res.status(403).json({ error: 'Token is required' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.userId = decoded.UserId;
        next();
    });
}
router.post('/add-comment', verifyToken, async (req, res) => {
    const { postId, text } = req.body;
    const userId = req.userId;

    try {
        const client = await MongoClient.connect(mongoUrl);
        const db = client.db(dbName);
        const postCollection = db.collection('post');
        const userCollection = db.collection('fitUsers');

        // Fetch the username from fitUsers based on userId
        const user = await userCollection.findOne({ _id: new ObjectId(userId) });
        const username = user ? user.username : 'Unknown';

        // Add comment with userId and username to the post
        const updateResult = await postCollection.updateOne(
            { _id: new ObjectId(postId) },
            { $push: { comments: { userId, username, text } } }
        );

        if (updateResult.modifiedCount === 1) {
            res.status(200).json({ message: 'Comment added.', username });
        } else {
            res.status(404).json({ error: 'Post not found.' });
        }

        client.close();
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment.' });
    }
});


module.exports = router;
