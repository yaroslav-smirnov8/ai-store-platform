import React, { useState } from 'react';
import { courseData } from '../data/courseData';

const FAQSection = () => {
  const { faq } = courseData;
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 text-lg">
          Answers to the most popular questions about the course
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faq.map((item, index) => (
          <div 
            key={index}
            className="bg-gradient-to-r from-blue-50 to-slate-100 rounded-xl border border-blue-200 overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-blue-100 transition-colors duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 pr-4">
                {item.question}
              </h3>
              <div className={`transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}>
                <span className="text-2xl text-blue-600">⌄</span>
              </div>
            </button>
            
            {openIndex === index && (
              <div className="px-6 pb-4 border-t border-blue-200">
                <p className="text-gray-700 leading-relaxed pt-4">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <div className="bg-gradient-to-r from-blue-50 to-slate-100 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-4">
            Contact us for a personal consultation
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg">
            Ask a Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
