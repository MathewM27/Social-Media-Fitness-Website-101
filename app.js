require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

const authRoutes = require('./server/routes/auth');
const uploadProfileRoutes = require('./server/routes/uploadProfile');
const postUploadRoutes = require('./server/routes/postUpload'); // Import post upload routes
const likesRoute = require('./server/routes/likes');
const dislikesRoute = require('./server/routes/dislike');
const commentsRoute = require('./server/routes/comments');
const followRoute = require('./server/routes/follow');
const messagingRoute = require('./server/routes/message');
const searchRoute = require('./server/routes/search')

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use(express.static('client'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route handling
app.use('/auth', authRoutes);
app.use('/profile', uploadProfileRoutes);
app.use('/api', postUploadRoutes);
app.use('/like', likesRoute);
app.use('/dislike', dislikesRoute);
app.use('/comments', commentsRoute);
app.use('/follow', followRoute);
app.use('/message', messagingRoute);
app.use('/search', searchRoute);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
