const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const multer = require('multer');

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

router.post('/', upload.single('file'), mediaController.uploadMedia);
router.get('/:id', mediaController.getMediaById);
router.get('/', mediaController.listMedia);

module.exports = router;