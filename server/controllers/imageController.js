const cloudinary = require('../../utils/cloudinary');
const Image = require('../models/imageModel');
const streamifier = require('streamifier');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

// Upload image
exports.uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No image file provided', 400));
  }

  const streamUpload = req => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
        { folder: 'skinApp', resource_type: 'image' },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  const result = await streamUpload(req);

  const savedImage = await Image.create({
    imageUrl: result.secure_url,
    uploadedBy: req.user._id,
  });

  res.status(200).json({
    status: 'success',
    message: 'Image uploaded and saved to DB!',
    url: result.secure_url,
    savedImage,
  });
});

// Get logged-in user's images
exports.getMyImages = catchAsync(async (req, res, next) => {
  const images = await Image.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    count: images.length,
    images,
  });
});
