const ScanResult = require('../models/scanResultModel');
const mongoose = require('mongoose');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

// Create scan result
exports.createScanResult = catchAsync(async (req, res, next) => {
  const { imageId, aiScores } = req.body;

  if (!imageId || !aiScores) {
    return next(new AppError('Image ID and AI scores are required', 400));
  }

  const newResult = await ScanResult.create({
    uploadedBy: req.user._id,
    image: imageId,
    aiScores
  });

  res.status(201).json({
    status: 'success',
    message: 'Scan result saved successfully!',
    data: newResult
  });
});

// Get all scan results for logged-in user
exports.getMyScanResults = catchAsync(async (req, res, next) => {
  const results = await ScanResult.find({ uploadedBy: req.user._id })
    .populate('image')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: results.length,
    data: results
  });
});

// Compare two scan results
exports.compareScanResults = catchAsync(async (req, res, next) => {
  const { scanId1, scanId2 } = req.body;

  // Validate IDs
  if (!mongoose.Types.ObjectId.isValid(scanId1) || !mongoose.Types.ObjectId.isValid(scanId2)) {
    return next(new AppError('Invalid scan ID format', 400));
  }

  // Fetch both scan results
  const result1 = await ScanResult.findById(scanId1);
  const result2 = await ScanResult.findById(scanId2);

  if (!result1 || !result2) {
    return next(new AppError('One or both scan results not found', 404));
  }

  const scores1 = result1.aiScores;
  const scores2 = result2.aiScores;

  if (!scores1 || !scores2) {
    return next(new AppError('AI scores missing in one or both scan results', 400));
  }

  // Calculate improvement for each skin condition
  const comparison = {};
  for (let key in scores1) {
    if (typeof scores1[key] === 'number' && typeof scores2[key] === 'number') {
      comparison[key] = {
        before: scores1[key],
        after: scores2[key],
        difference: scores1[key] - scores2[key] // positive = improvement
      };
    }
  }

  res.status(200).json({
    status: 'success',
    message: 'Comparison successful',
    comparison
  });
});