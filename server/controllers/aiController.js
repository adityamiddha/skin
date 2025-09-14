const ScanResult = require('../models/scanResultModel');
const Image = require('../models/imageModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

exports.analyzeImage = catchAsync(async (req, res, next) => {
  const imageId = req.params.imageId;
  const userId = req.user._id;

  // 1. Check if image exists and belongs to the user
  const image = await Image.findOne({ _id: imageId, uploadedBy: userId });
  if (!image) {
    return next(new AppError('Image not found or unauthorized', 404));
  }

  // 2. Simulate AI processing (random scores for now)
  const aiScores = {
    wrinkles: Math.floor(Math.random() * 100),
    acne: Math.floor(Math.random() * 100),
    darkSpots: Math.floor(Math.random() * 100),
    hydration: Math.floor(Math.random() * 100),
  };

  // 3. Save to ScanResult collection
  const newResult = await ScanResult.create({
    uploadedBy: userId,
    image: imageId,
    aiScores,
  });

  res.status(201).json({
    status: 'success',
    message: 'AI scan completed and result saved',
    data: newResult,
  });
});
