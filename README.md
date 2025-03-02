# Clinikk TV Backend POC

Welcome to the Clinikk TV Backend Proof of Concept (POC). This is a simple RESTful API built with Node.js and Express.js to manage media content—like videos and audio—for Clinikk TV, serving both an app and a Progressive Web App (PWA). It uses MongoDB for storing metadata, but don’t worry if MongoDB gives you trouble (it did for me)—there’s an in-memory fallback to keep things running. This README will guide you through setup, usage, and fixing common hiccups.

## What’s This Project About?

This backend is all about handling media for Clinikk TV:
- Upload media files (e.g., videos or audio) with metadata like title and type.
- Fetch specific files by their ID (with streaming support).
- List all media metadata in one go.

It’s a POC, so it’s lightweight but modular—ready to scale if needed. If MongoDB isn’t available, it switches to in-memory storage so you can still play around with it.

### Key Features
- Upload media files with metadata.
- Retrieve media by ID (streamed to the client).
- List all media metadata.
- Fallback to in-memory storage if MongoDB fails.

## Prerequisites

Before diving in, make sure you’ve got:
- **Node.js** (v14.x or higher) – Grab it from [nodejs.org](https://nodejs.org/).
- **MongoDB** (v4.x or higher) – Optional, get it from [mongodb.com](https://www.mongodb.com/). Skip this if you’re fine with in-memory storage.
- **Git** – Download it at [git-scm.com](https://git-scm.com/).
- **Postman** or **curl** – For testing the API endpoints.

## Installation

Let’s get this up and running:

1. **Clone the Repository**:
   ```bash
   git clone <repo-url>
   cd clinikktvbackend-poc
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   This pulls in Express, Mongoose, Multer, and other goodies listed in package.json.

3. **Set Up MongoDB (Optional)**:
   Start your MongoDB server:
   ```bash
   mongod --dbpath /path/to/your/data/db
   ```
   (Adjust the path to where you want MongoDB to store data.)
   If MongoDB isn’t running, the app will log an error but switch to in-memory storage—no sweat!

4. **Environment Variables (Optional)**:
   By default, the MongoDB URI is hardcoded in `src/app.js` as `mongodb://127.0.0.1:27017/clinikktv`. To customize it, create a `.env` file:
   ```text
   MONGODB_URI=mongodb://127.0.0.1:27017/clinikktv
   PORT=3000
   ```
   Then install dotenv (`npm install dotenv`) and update `src/app.js` to use it:
   ```javascript
   require('dotenv').config();
   const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/clinikktv';
   ```

5. **Running the Application**:
   ```bash
   npm start
   ```
   You’ll see `Server running on port 3000` if all’s well.
   If MongoDB isn’t running, you might get: `MongoDB connection error: MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`. The app will still work with in-memory storage.

## Test the API

- **Upload a File**:
  ```http
  POST http://localhost:3000/media
  ```
  Attach a file (e.g., a video) and metadata (e.g., `{ "title": "Health Tips", "type": "video" }`) in a `multipart/form-data` request.

- **Get a File**:
  ```http
  GET http://localhost:3000/media/{id}
  ```
  Replace `{id}` with the file’s ID.

- **List All Media**:
  ```http
  GET http://localhost:3000/media
  ```

## API Endpoints

| Method | Endpoint         | Description                      |
|--------|-----------------|----------------------------------|
| POST   | `/media`        | Upload a file and its metadata. |
| GET    | `/media/{id}`   | Retrieve a file by its ID.      |
| GET    | `/media`        | List all media metadata.        |

## Project Structure

Here’s where stuff lives:

```
clinikktvbackend-poc/
├── src/
│   ├── models/
│   │   └── media.js
│   ├── controllers/
│   │   └── mediaController.js
│   ├── routes/
│   │   └── media.js
│   ├── services/
│   │   └── mediaService.js
│   └── app.js
├── uploads/
│   └── .gitkeep
├── node_modules/  # Present locally but ignored by Git
├── README.md
├── DESIGN.md
├── package.json
├── package-lock.json
└── .gitignore    
```

## Sample Files for Testing

For testing retrieval, create dummy files in the `uploads/` directory:

```bash
echo $null > uploads/sample1.mp4
echo $null > uploads/sample2.mp3
```

These match the sample data (sample1, sample2) in the in-memory store.

## Troubleshooting

### MongoDB Connection Error:
- **Symptom**: `MongoDB connection error: MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`
- **Fix**:
  - Ensure MongoDB is running (`mongod` command above).
  - Check if `127.0.0.1:27017` is correct (or update the URI).
  - If you don’t need MongoDB, let it fall back to in-memory storage.

### 404 on File Retrieval:
- **Symptom**: `GET /media/{id}` returns 404.
- **Fix**: Verify the file exists in `uploads/` and the ID matches.


