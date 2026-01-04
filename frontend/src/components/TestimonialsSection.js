import React from 'react';
import { courseData } from '../data/courseData';

const TestimonialsSection = () => {
  const { testimonials } = courseData;

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
          My Students' Reviews
        </h2>
        <p className="text-gray-600 text-lg">
          (tap three times on circle to listen)
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id}
            className="bg-gradient-to-br from-blue-50 to-slate-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-lg">👩‍🏫</span>
              </div>
              <div>
                <div className="flex items-center mb-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-sm font-semibold text-gray-700">{testimonial.author}</p>
              </div>
            </div>
            <p className="text-gray-600 italic leading-relaxed">
              "{testimonial.text}"
            </p>
            
            {/* Audio playback button */}
            <div className="mt-4 flex justify-center">
              <button 
                className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg"
                onClick={() => {
                  // Placeholder for audio functionality
                  alert('Audio review will be available in full course version');
                }}
              >
                <span className="text-white text-lg">🔊</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg">
          Read All Reviews
        </button>
      </div>
    </div>
  );
};

export default TestimonialsSection;
