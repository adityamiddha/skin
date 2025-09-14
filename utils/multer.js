const multer = require('multer');

// Use memory storage (store image in memory temporarily before uploading to cloudinary)
const storage = multer.memoryStorage();

// Filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true); //Accept
  } else {
    cb(new Error('Not an image! Please upload an image file.'), false); // Reject
  }
};

// Setup multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB
});

module.exports = upload;
