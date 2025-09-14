const express = require('express');
const router = express.Router();
const { analyzeImage } = require('../controllers/aiController');
const { protect } = require('../middlewares/authmiddleware');

router.post('/scan/:imageId', protect, analyzeImage);

module.exports = router;
