const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
require('dotenv').config();
const multer = require('multer');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const userRoutes = require('./routes/userRouters');
const postRoutes = require('./routes/postRouter');

const app = express();

// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

// Serve uploaded files statically
app.use('/uploads', express.static(__dirname + '/uploads'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use(notFound);
app.use(errorHandler);




mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connection to MongoDB successful"))
    .catch(err => console.error("Connection to MongoDB failed", err));


// Server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

