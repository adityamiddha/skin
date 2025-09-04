import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiCamera, FiImage, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ImageUpload = ({ onImageUpload, loading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp']
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // This would integrate with device camera
    toast.info('Camera capture feature coming soon!');
  };

  const handleUpload = () => {
    if (selectedFile) {
      onImageUpload(selectedFile);
      setSelectedFile(null);
      setPreview(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Upload Skin Image for AI Analysis
          </h2>
          <p className="text-gray-600">
            Upload a clear image of your skin area for comprehensive AI-powered analysis
          </p>
        </div>

        {!selectedFile ? (
          <div className="space-y-6">
            {/* Drag & Drop Zone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
                isDragActive
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {isDragActive ? 'Drop your image here' : 'Drag & drop your image here'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse files
              </p>
              <p className="text-xs text-gray-400">
                Supports: JPG, PNG, GIF, BMP (Max: 5MB)
              </p>
            </div>

            {/* Alternative Upload Methods */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <label className="flex-1 sm:flex-initial">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="w-full sm:w-auto flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer transition-colors duration-200">
                  <FiImage className="h-5 w-5 mr-2" />
                  Browse Files
                </div>
              </label>

              <button
                onClick={handleCameraCapture}
                className="flex-1 sm:flex-initial flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <FiCamera className="h-5 w-5 mr-2" />
                Take Photo
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Image Preview
              </h3>
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full h-64 object-contain rounded-lg border border-gray-200"
                />
                <button
                  onClick={removeFile}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>

            {/* Upload Button */}
            <div className="text-center">
              <button
                onClick={handleUpload}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-skin-600 hover:from-primary-700 hover:to-skin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Uploading & Analyzing...
                  </>
                ) : (
                  <>
                    <FiUpload className="h-5 w-5 mr-2" />
                    Upload & Analyze
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            💡 Tips for Best Results
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Ensure good lighting for clear image quality</li>
            <li>• Keep the camera steady and focused</li>
            <li>• Include the entire area of concern in the frame</li>
            <li>• Avoid shadows or reflections on the skin</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;

