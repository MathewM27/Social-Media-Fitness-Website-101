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

// Endpoint to fetch posts with a search query
router.get('/search-posts', verifyToken, async (req, res) => {
    const searchTerm = req.query.search || '';  // Get the search term from the query string

    try {
        // Prioritize posts matching the username first, then caption
        const posts = await db.collection('posts').aggregate([
            {
                $lookup: {
                    from: 'fitUsers', // Join with the users collection to get usernames
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } // Unwind userDetails
            },
            {
                $match: {
                    $or: [
                        { 'userDetails.username': { $regex: searchTerm, $options: 'i' } }, // Match in username
                        { caption: { $regex: searchTerm, $options: 'i' } } // Match in caption
                    ]
                }
            },
            {
                $addFields: {
                    relevance: {
                        $cond: [
                            { $regexMatch: { input: "$userDetails.username", regex: new RegExp(searchTerm, "i") } },
                            1, // Higher relevance for username match
                            0  // Lower relevance for caption match
                        ]
                    }
                }
            },
            { $sort: { relevance: -1, createdAt: -1 } } // Sort by relevance and latest post first
        ]).toArray();

        // Log the result of the search
        console.log("Search Term:", searchTerm);
        console.log("Search Results:", posts);

        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

module.exports = router;
