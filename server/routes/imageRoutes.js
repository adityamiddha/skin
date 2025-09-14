const express = require('express');
const router = express.Router();
const { uploadImage, getMyImages } = require('../controllers/imageController');
const upload = require('../../utils/multer');
const { protect } = require('../middlewares/authmiddleware');

// POST /api/image/upload
router.post('/upload', protect, upload.single('image'), uploadImage);

// GET /api/image/my-images
router.get('/my-images', protect, getMyImages);
module.exports = router;
