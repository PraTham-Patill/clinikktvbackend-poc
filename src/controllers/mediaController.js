const mediaService = require('../services/mediaService');
const fs = require('fs');

exports.uploadMedia = async (req, res) => {
    try {
        const metadata = JSON.parse(req.body.metadata);
        if (!metadata.title || !metadata.type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const result = await mediaService.uploadMedia(metadata, req.file);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMediaById = async (req, res) => {
    try {
        const media = await mediaService.getMediaById(req.params.id);
        if (!fs.existsSync(media.filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.set('Content-Type', media.mimetype);
        fs.createReadStream(media.filePath).pipe(res);
    } catch (error) {
        if (error.message === 'Media not found') {
            res.status(404).json({ error: 'Media not found' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

exports.listMedia = async (req, res) => {
    try {
        const mediaList = await mediaService.listMedia();

        // Generate HTML page with updated background
        let html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Clinikk TV Media Library</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Poppins', sans-serif;
                        background: linear-gradient(135deg, #2d2d2d, #1a1a1a); /* Gray to black gradient */
                        background-size: 200% 200%;
                        animation: gradientShift 15s ease infinite;
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 20px;
                    }
                    @keyframes gradientShift {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    .container {
                        width: 90%;
                        max-width: 1200px;
                        padding: 30px;
                        background: rgba(255, 255, 255, 0.05); /* Slightly lighter for contrast */
                        backdrop-filter: blur(10px);
                        border-radius: 20px;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4); /* Darker shadow */
                    }
                    h1 {
                        text-align: center;
                        color: #e0e0e0; /* Light gray for contrast */
                        margin-bottom: 40px;
                        font-size: 3em;
                        font-weight: 700;
                        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                    }
                    .media-list {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                        gap: 25px;
                    }
                    .media-card {
                        background: #ffffff; /* White cards for contrast */
                        border-radius: 15px;
                        padding: 25px;
                        box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.1);
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                        opacity: 0;
                        animation: fadeIn 0.5s forwards;
                        animation-delay: calc(var(--delay) * 0.2s);
                        position: relative;
                        overflow: hidden;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .media-card:hover {
                        transform: scale(1.05);
                        box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.4), -8px -8px 20px rgba(255, 255, 255, 0.2);
                    }
                    .media-card::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 5px;
                        background: linear-gradient(90deg, #ff6f61, #6b48ff); /* Keep the gradient border */
                        animation: borderGlow 3s infinite;
                    }
                    @keyframes borderGlow {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    .media-card h2 {
                        margin: 0 0 15px;
                        font-size: 1.8em;
                        color: #1a73e8;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    .media-card h2::before {
                        content: '🎥';
                        font-size: 1.2em;
                    }
                    .media-card[data-type="audio"] h2::before {
                        content: '🎵';
                    }
                    .media-card p {
                        margin: 8px 0;
                        color: #444;
                        font-size: 1em;
                        line-height: 1.5;
                    }
                    .media-card .type {
                        font-weight: bold;
                        color: #e44d26;
                        background: #ffebee;
                        padding: 5px 10px;
                        border-radius: 12px;
                        display: inline-block;
                    }
                    .media-card .duration {
                        color: #2e7d32;
                        background: #e8f5e9;
                        padding: 5px 10px;
                        border-radius: 12px;
                        display: inline-block;
                    }
                    .media-card .upload-date {
                        font-style: italic;
                        color: #888;
                        font-size: 0.9em;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Clinikk TV Media Library</h1>
                    <div class="media-list">
        `;

        mediaList.forEach((media, index) => {
            html += `
                <div class="media-card" data-type="${media.type}" style="--delay: ${index};">
                    <h2>${media.title}</h2>
                    <p>${media.description}</p>
                    <p><span class="type">Type:</span> ${media.type}</p>
                    <p><span class="duration">Duration:</span> ${media.duration} seconds</p>
                    <p><span class="upload-date">Uploaded:</span> ${new Date(media.uploadDate).toLocaleString()}</p>
                </div>
            `;
        });

        html += `
                    </div>
                </div>
            </body>
            </html>
        `;

        res.set('Content-Type', 'text/html');
        res.send(html);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};