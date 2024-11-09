const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const mongoURL = 'mongodb+srv://mathews:Rihanna6927@cluster0.16sij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'FitnessSocialMediaApp';
let db;

MongoClient.connect(mongoURL)
    .then((client) => {
        db = client.db(dbName);
        console.log("Connected to MongoDB");
    })
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.cookies.authToken; // Fetch authToken from cookies
    if (!token) return res.status(403).json({ error: 'Token is required' });

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.userId = decoded.UserId; // Set UserId

        next();
    });
}

// Save message to MongoDB
router.post('/send', verifyToken, async (req, res) => {
    const { recipientId, text } = req.body;

    const newMessage = {
        senderId: req.userId,
        recipientId,
        text,
        timestamp: new Date(),
    };

    try {
        await db.collection('messages').insertOne(newMessage);
        res.send({ success: true, message: 'Message sent!' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).send({ success: false, error: 'Message could not be sent' });
    }
}); router.get('/history/:recipientId', verifyToken, async (req, res) => {
    const userId = req.userId;
    const recipientId = req.params.recipientId;

    // Check if userId and recipientId are accessible here
    console.log('Current userId:', userId);
    console.log('Current recipientId:', recipientId);

    try {
        // Fetch the messages
        const messages = await db.collection('messages').find({
            $or: [
                { senderId: userId, recipientId: recipientId },
                { senderId: recipientId, recipientId: userId }
            ]
        }).sort({ timestamp: 1 }).toArray();

        // Log messages to verify correct query results
        console.log('Fetched messages:', messages);

        // Fetch sender profile info
        const senderIds = [...new Set(messages.map(msg => msg.senderId))];
        const senders = await db.collection('fitUsers').find({
            '_id': { $in: senderIds.map(id => new ObjectId(id)) }
        }).toArray();

        // Map sender names
        const resultMessages = messages.map(msg => {
            const sender = senders.find(sender => sender._id.toString() === msg.senderId);
            return {
                ...msg,
                senderName: sender ? sender.profileName : 'Unknown',
            };
        });

        console.log('Messages with sender names:', resultMessages);
        res.send(resultMessages);
    } catch (error) {
        console.error('Error fetching message history:', error);
        res.status(500).send({ success: false, error: 'Could not fetch messages' });
    }
});

module.exports = router;
