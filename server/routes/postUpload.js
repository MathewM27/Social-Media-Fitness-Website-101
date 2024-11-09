const express = require('express');
const multer = require('multer');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken'); // Import jwt for token verification
const cookieParser = require('cookie-parser');
const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Save uploads locally in 'uploads/' directory
const JWT_SECRET = 'your_jwt_secret'; // JWT secret for access token

const mongoURL = 'mongodb+srv://mathews:Rihanna6927@cluster0.16sij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'FitnessSocialMediaApp';
let db;

router.use(cookieParser());

// Connect to MongoDB
MongoClient.connect(mongoURL)
    .then((client) => {
        db = client.db(dbName);
        console.log("Connected to MongoDB");
    })
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Middleware to verify JWT
function verifyToken(req, res, next) {
    const token = req.cookies.authToken; // Fetch authToken from cookies

    if (!token) return res.status(403).json({ error: 'Token is required' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.userId = decoded.UserId; // Ensure UserId matches the login payload

        next();
    });
}

// POST endpoint to upload media and create a post
router.post('/create-post', verifyToken, upload.single('media'), async (req, res) => {
    console.log('Received request to create post');
    console.log('Request body:', req.body); // Check request body
    console.log('Request file:', req.file);

    const userId = req.userId;


    try {
        const { caption } = req.body;
        const mediaPath = req.file ? req.file.path : null;



        // Create the post object
        const newPost = {
            userId,
            caption,
            media: mediaPath,
            createdAt: new Date(),
            likes: [],
            dislikes: [],
            comments: [],
        };

        // Save post to MongoDB
        const result = await db.collection('post').insertOne(newPost);


        res.status(201).json({ success: true, post: { ...newPost, _id: result.insertedId } });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ success: false, error: 'Failed to create post' });
    }
});
router.get('/fetch-posts', async (req, res) => {
    try {
        // Fetch all posts from the 'post' collection
        const posts = await db.collection('post').find().toArray();

        // For each post, get the user's details from the 'fitUsers' collection
        const postsWithUserDetails = await Promise.all(posts.map(async (post) => {
            let user;
            try {
                // Convert post.userId to ObjectId if it’s a valid string, otherwise use as is
                const userId = typeof post.userId === 'string' ? new ObjectId(post.userId) : post.userId;
                user = await db.collection('fitUsers').findOne({ _id: userId });
            } catch (err) {
                console.error('Error finding user:', err);
            }

            return {
                ...post,
                username: user ? user.profileName : 'Unknown User',
                avatar: user ? user.profileImage : './assets/default-avatar.jpg'
            };
        }));

        res.status(200).json(postsWithUserDetails);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});


module.exports = router;
