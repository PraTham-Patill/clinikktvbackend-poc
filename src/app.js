const express = require('express');
const mongoose = require('mongoose');
const mediaRoutes = require('./routes/media');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Add this

const app = express();

// Enable CORS
app.use(cors());

// Attempt to connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/clinikktv')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection failed; using in-memory fallback:', err.message));

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to Clinikk TV Backend Service POC! Use /media to access the API endpoints.');
});

app.use(express.json());
app.use('/media', mediaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));