import React from 'react';
import { courseData } from '../data/courseData';

const LearningModulesSection = () => {
  const { learningModules } = courseData;

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
          What You'll Learn
        </h2>
        <p className="text-gray-600 text-lg">
          Master all key skills of working with neural networks for teaching
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningModules.map((module, index) => (
          <div 
            key={module.id}
            className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                <span className="text-2xl">{module.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {module.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningModulesSection;
