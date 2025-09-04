import React, { useState, useEffect } from 'react';
import { FiCalendar, FiTrendingUp, FiTrendingDown, FiMinus, FiImage, FiBarChart2, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { scanResultsAPI } from '../../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ScanHistory = () => {
  const [scanResults, setScanResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScans, setSelectedScans] = useState([]);
  const [comparison, setComparison] = useState(null);

  useEffect(() => {
    fetchScanResults();
  }, []);

  const fetchScanResults = async () => {
    try {
      const response = await scanResultsAPI.getMyScanResults();
      setScanResults(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch scan results');
    } finally {
      setLoading(false);
    }
  };

  const handleScanSelection = (scanId) => {
    setSelectedScans(prev => {
      if (prev.includes(scanId)) {
        return prev.filter(id => id !== scanId);
      } else if (prev.length < 2) {
        return [...prev, scanId];
      } else {
        toast.info('You can only compare 2 scans at a time');
        return prev;
      }
    });
  };

  const compareScans = async () => {
    if (selectedScans.length !== 2) {
      toast.error('Please select exactly 2 scans to compare');
      return;
    }

    try {
      const response = await scanResultsAPI.compareScanResults({
        scanId1: selectedScans[0],
        scanId2: selectedScans[1]
      });
      setComparison(response.data.comparison);
      toast.success('Comparison completed!');
    } catch (error) {
      toast.error('Failed to compare scans');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success-600 bg-success-100';
    if (score >= 60) return 'text-warning-600 bg-warning-100';
    return 'text-danger-600 bg-danger-100';
  };

  const getTrendIcon = (difference) => {
    if (difference > 0) return <FiTrendingUp className="h-4 w-4 text-success-500" />;
    if (difference < 0) return <FiTrendingDown className="h-4 w-4 text-danger-500" />;
    return <FiMinus className="h-4 w-4 text-gray-500" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (scanResults.length === 0) {
    return (
      <div className="text-center py-12">
        <FiBarChart2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No scan results yet</h3>
        <p className="text-gray-500">Upload and analyze your first image to see results here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Scan History</h2>
            <p className="text-gray-600 mt-1">Track your skin health progress over time</p>
          </div>
          
          {selectedScans.length === 2 && (
            <button
              onClick={compareScans}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <FiBarChart2 className="h-4 w-4 mr-2" />
              Compare Selected
            </button>
          )}
        </div>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Comparison Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(comparison).map(([condition, data]) => (
              <div key={condition} className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 capitalize mb-2">
                  {condition.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Before:</span>
                    <span className="font-medium">{data.before}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">After:</span>
                    <span className="font-medium">{data.after}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Change:</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(data.difference)}
                      <span className={`font-medium ${data.difference > 0 ? 'text-success-600' : data.difference < 0 ? 'text-danger-600' : 'text-gray-600'}`}>
                        {Math.abs(data.difference)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setComparison(null)}
            className="mt-4 text-sm text-primary-600 hover:text-primary-500"
          >
            Clear comparison
          </button>
        </div>
      )}

      {/* Scan Results List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Scans</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {scanResults.map((result, index) => (
            <div key={result._id} className="p-6">
              <div className="flex items-start space-x-4">
                {/* Selection Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedScans.includes(result._id)}
                  onChange={() => handleScanSelection(result._id)}
                  className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                
                {/* Image */}
                <div className="flex-shrink-0">
                  <img
                    src={result.image?.imageUrl || '/placeholder-image.jpg'}
                    alt="Skin scan"
                    className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                                   <div className="flex items-center space-x-2">
                 <FiClock className="h-4 w-4 text-gray-400" />
                 <span className="text-sm text-gray-500">
                   {formatDate(result.createdAt)}
                 </span>
               </div>
                  </div>
                  
                  {/* Scores Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(result.aiScores || {}).map(([condition, score]) => (
                      <div key={condition} className="text-center">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(score)}`}>
                          {condition.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="mt-1 text-lg font-semibold text-gray-900">
                          {score}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selection Instructions */}
      {selectedScans.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            {selectedScans.length === 1 
              ? 'Select one more scan to compare' 
              : 'Ready to compare! Click "Compare Selected" above.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ScanHistory;
