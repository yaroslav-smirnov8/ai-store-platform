import React from 'react';

const CourseTypeSelector = ({ selectedType, onTypeChange }) => {
  const handleTypeClick = (type) => {
    if (onTypeChange) {
      onTypeChange(type);
    }
  };

  const handleKeyDown = (event, type) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTypeClick(type);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Regular Courses Button */}
          <button
            onClick={() => handleTypeClick('regular')}
            onKeyDown={(e) => handleKeyDown(e, 'regular')}
            className={`
              relative py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${selectedType === 'regular'
                ? 'bg-gradient-to-r from-blue-500 to-blue-800 text-white shadow-lg transform scale-105'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:scale-102'
              }
            `}
            aria-label="Select regular neural networks courses"
            aria-pressed={selectedType === 'regular'}
            role="tab"
            tabIndex={0}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">📚</span>
              <span>Neural Networks Course</span>
            </div>
            {selectedType === 'regular' && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
            )}
          </button>

          {/* Intensive Courses Button */}
          <button
            onClick={() => handleTypeClick('intensive')}
            onKeyDown={(e) => handleKeyDown(e, 'intensive')}
            className={`
              relative py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${selectedType === 'intensive'
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg transform scale-105'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:scale-102'
              }
            `}
            aria-label="Select neural networks intensives"
            aria-pressed={selectedType === 'intensive'}
            role="tab"
            tabIndex={0}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">🚀</span>
              <span>Neural Networks Intensive</span>
            </div>
            {selectedType === 'intensive' && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* Type Description */}
      {selectedType && (
        <div className="mt-4 text-center">
          {selectedType === 'regular' ? (
            <p className="text-gray-600 text-sm">
              📖 Full courses with deep material study
            </p>
          ) : (
            <p className="text-gray-600 text-sm">
              ⚡ Concentrated programs for fast skill mastery
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseTypeSelector;