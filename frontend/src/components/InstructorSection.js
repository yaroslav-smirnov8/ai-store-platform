import React from 'react';
import { courseData } from '../data/courseData';

const InstructorSection = () => {
  const { instructor } = courseData;

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
          Who am I and why can you trust me?
        </h2>
        
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-blue-800 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-5xl">👨‍🏫</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">{instructor.name}</h3>
        <p className="text-lg text-blue-600 font-semibold mb-6">{instructor.title}</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-center">
              <span className="text-2xl mr-2">🎓</span>
              Experience and Qualifications
            </h4>
            <ul className="space-y-3 text-left">
              {instructor.credentials.map((credential, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-700">{credential}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-center">
              <span className="text-2xl mr-2">🚀</span>
              Helping Teachers
            </h4>
            <ul className="space-y-3 text-left">
              {instructor.achievements.map((achievement, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">⭐</span>
                  <span className="text-gray-700">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
