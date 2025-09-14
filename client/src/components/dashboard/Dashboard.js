import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiCamera, FiClock, FiUser, FiLogOut, FiPlus, FiImage } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ImageUpload from './ImageUpload';
import ScanHistory from './ScanHistory';
import Profile from './Profile';
import { imageAPI, aiAPI } from '../../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upload');
  const setImages = useState([])[1]; // Only using setImages
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      // eslint-disable-next-line no-unused-vars
      // eslint-disable-next-line no-unused-vars
      const response = await imageAPI.getMyImages();
      setImages(response.data.images);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleImageUpload = async file => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      // eslint-disable-next-line no-unused-vars
      // eslint-disable-next-line no-unused-vars
      // eslint-disable-next-line no-unused-vars
      const response = await imageAPI.uploadImage(formData);
      toast.success('Image uploaded successfully!');

      // Refresh images list
      await fetchImages();

      // Automatically analyze the uploaded image
      if (response.data.savedImage) {
        await analyzeImage(response.data.savedImage._id);
      }

      setActiveTab('history');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = async imageId => {
    try {
      // eslint-disable-next-line no-unused-vars
      // eslint-disable-next-line no-unused-vars
      // eslint-disable-next-line no-unused-vars
      const response = await aiAPI.analyzeImage(imageId);
      toast.success('AI analysis completed! Check your scan history.');
    } catch (error) {
      toast.error('Failed to analyze image');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return <ImageUpload onImageUpload={handleImageUpload} loading={loading} />;
      case 'history':
        return <ScanHistory />;
      case 'profile':
        return <Profile />;
      default:
        return <ImageUpload onImageUpload={handleImageUpload} loading={loading} />;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-skin-500 rounded-lg flex items-center justify-center">
                <span className="text-xl text-white font-bold">S</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">SkinCare AI</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FiLogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'upload'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FiUpload className="h-5 w-5" />
                <span>Upload & Scan</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'history'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FiClock className="h-5 w-5" />
                <span>Scan History</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'profile'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FiUser className="h-5 w-5" />
                <span>Profile</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">{renderTabContent()}</div>
      </main>
    </div>
  );
};

export default Dashboard;
