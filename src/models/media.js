const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    type: { type: String, required: true },
    duration: Number,
    uploadDate: { type: Date, default: Date.now },
    filePath: String,
    mimetype: String
});

module.exports = mongoose.model('Media', mediaSchema);