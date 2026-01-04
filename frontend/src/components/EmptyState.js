import React from 'react';

const EmptyState = ({ type, onSwitchType }) => {
  const handleSwitchClick = () => {
    if (onSwitchType) {
      onSwitchType();
    }
  };

  if (type === 'regular') {
    return (
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 text-center py-16 px-8 animate-fadeInUp">
        <div className="max-w-md mx-auto">
          {/* Icon */}
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-700 rounded-3xl mx-auto mb-6 flex items-center justify-center animate-float">
            <span className="text-4xl text-white">📚</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Courses Coming Soon
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-base mb-6 leading-relaxed">
            We are preparing comprehensive AI in Education courses for you. 
            Meanwhile, check out our intensive programs!
          </p>

          {/* Features Preview */}
          <div className="bg-gradient-to-r from-blue-50 to-slate-100 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">What's Coming in Courses:</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">✓</span>
                <span>In-depth study of AI tools</span>
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Step-by-step practical assignments</span>
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Personal feedback</span>
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Certificate of completion</span>
              </li>
            </ul>
          </div>

          {/* Call to Action */}
          <button
            onClick={handleSwitchClick}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mb-4"
          >
            <div className="flex items-center justify-center">
              <span className="text-xl mr-2">🚀</span>
              <span>Go to Intensives</span>
            </div>
          </button>

          {/* Notification */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              💡 Subscribe to notifications to be the first to know about course launches
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default empty state for other types
  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 text-center py-16 px-8 animate-fadeInUp">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl mx-auto mb-6 flex items-center justify-center">
          <span className="text-4xl text-white">📋</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Content Not Found
        </h2>
        <p className="text-gray-600 text-base">
          No content available in this section yet.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;