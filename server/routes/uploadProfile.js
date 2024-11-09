const express = require('express');
const multer = require('multer');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // Import cookie-parser

const router = express.Router();
router.use(cookieParser()); // Use cookie-parser middleware

const uploadDir = path.join(__dirname, '../../uploads'); // Ensure this path exists or create it
const JWT_SECRET = 'your_jwt_secret'; // Replace with a secure key in production

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});



// Set allowed file types for profile image uploads
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|bmp|webp|mp4|svg/;
    const isValidType = allowedTypes.test(file.mimetype) && allowedTypes.test(path.extname(file.originalname).toLowerCase());
    cb(null, isValidType ? true : new Error('Invalid file type'));
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 30 * 1024 * 1024 } // 10 MB limit
});

const mongoUrl = "mongodb+srv://mathews:Rihanna6927@cluster0.16sij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = 'FitnessSocialMediaApp';

// Middleware to verify JWT and extract user ID
function verifyToken(req, res, next) {
    const token = req.cookies.authToken; // Fetch authToken from cookies
    
    if (!token) return res.status(403).json({ error: 'Token is required' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.userId = decoded.UserId; // Ensure UserId matches the login payload

        next();
    });
}

// Endpoint to update user profile
router.post('/update-profile', verifyToken, upload.single('profileImage'), async (req, res) => {
    const { profileName, profileBio } = req.body;
    const userId = req.userId; // User ID from JWT token
    
    const profileImagePath = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const client = await MongoClient.connect(mongoUrl);
        const db = client.db(dbName);
        const usersCollection = db.collection('fitUsers');

        // Update data object
        const updateData = {
            ...(profileName && { profileName }),
            ...(profileBio && { profileBio }),
            ...(profileImagePath && { profileImage: profileImagePath })
        };

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateData }
        );

        res.status(200).json({
            message: 'Profile updated successfully.',
            profileImagePath
        });

        client.close();
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile.' });
    }
});

// Endpoint to fetch user profile
router.get('/get-profile', verifyToken, async (req, res) => {
    const userId = req.userId;

    try {
        const client = await MongoClient.connect(mongoUrl);
        const db = client.db(dbName);
        const usersCollection = db.collection('fitUsers');

        const userProfile = await usersCollection.findOne(
            { _id: new ObjectId(userId) },
            { projection: { profileName: 1, profileBio: 1, profileImage: 1 } }
        );

        if (!userProfile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.status(200).json(userProfile);
        client.close();
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile.' });
    }
});


module.exports = router;
