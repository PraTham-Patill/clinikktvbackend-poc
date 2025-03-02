const mongoose = require('mongoose');
const Media = require('../models/media');
const fs = require('fs');
const path = require('path');

// In-memory sample data (used when MongoDB is unavailable)
let inMemoryMedia = [
    {
        id: 'sample1',
        title: 'Sample Video',
        description: 'A sample video for testing',
        type: 'video',
        duration: 120,
        uploadDate: new Date(),
        filePath: 'uploads/sample1.mp4',
        mimetype: 'video/mp4'
    },
    {
        id: 'sample2',
        title: 'Sample Audio',
        description: 'A sample audio for testing',
        type: 'audio',
        duration: 180,
        uploadDate: new Date(),
        filePath: 'uploads/sample2.mp3',
        mimetype: 'audio/mpeg'
    }
];

// Check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

const uploadMedia = async (metadata, file) => {
    if (isMongoConnected()) {
        // Use MongoDB
        const id = new mongoose.Types.ObjectId();
        const filePath = path.join('uploads', id.toString());
        fs.renameSync(file.path, filePath);

        const media = new Media({
            _id: id,
            title: metadata.title,
            description: metadata.description,
            type: metadata.type,
            duration: metadata.duration,
            filePath,
            mimetype: file.mimetype
        });

        await media.save();
        return { id: id.toString() };
    } else {
        // Use in-memory array
        const id = `inmem-${Date.now()}`;
        const filePath = path.join('uploads', id);
        fs.renameSync(file.path, filePath);

        const newMedia = {
            id,
            title: metadata.title,
            description: metadata.description,
            type: metadata.type,
            duration: metadata.duration,
            uploadDate: new Date(),
            filePath,
            mimetype: file.mimetype
        };
        inMemoryMedia.push(newMedia);
        return { id };
    }
};

const getMediaById = async (id) => {
    if (isMongoConnected()) {
        const media = await Media.findById(id);
        if (!media) {
            throw new Error('Media not found');
        }
        return {
            id: media._id.toString(),
            title: media.title,
            description: media.description,
            type: media.type,
            duration: media.duration,
            uploadDate: media.uploadDate,
            filePath: media.filePath,
            mimetype: media.mimetype
        };
    } else {
        const media = inMemoryMedia.find(m => m.id === id);
        if (!media) {
            throw new Error('Media not found');
        }
        return media;
    }
};

const listMedia = async () => {
    if (isMongoConnected()) {
        const mediaList = await Media.find({}, 'title description type duration uploadDate');
        return mediaList.map(m => ({
            id: m._id.toString(),
            title: m.title,
            description: m.description,
            type: m.type,
            duration: m.duration,
            uploadDate: m.uploadDate
        }));
    } else {
        return inMemoryMedia.map(m => ({
            id: m.id,
            title: m.title,
            description: m.description,
            type: m.type,
            duration: m.duration,
            uploadDate: m.uploadDate
        }));
    }
};

module.exports = {
    uploadMedia,
    getMediaById,
    listMedia
};