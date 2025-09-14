const mongoose = require('mongoose');

const scanResultsSchema = new mongoose.Schema(
  {
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
      required: true,
    },
    aiScores: {
      acne: Number,
      darkSpots: Number,
      hydration: Number,
      wrinkles: Number,
    },
  },
  { timestamps: true }
);

const ScanResult = mongoose.model('ScanResult', scanResultsSchema);

module.exports = ScanResult;
