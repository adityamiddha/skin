const express = require('express');
const router = express.Router();
const scanResultController = require('../controllers/scanResultController');
const { protect } = require('../middlewares/authmiddleware');
const { compareScanResults } = require('../controllers/scanResultController');

router.post('/', protect, scanResultController.createScanResult);
router.get('/my-scans', protect, scanResultController.getMyScanResults);
router.post('/compare-scans', protect, compareScanResults);

module.exports = router;
