import React from 'react';
import { courseData } from '../data/courseData';

const PricingSection = () => {
  const { pricing } = courseData;

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
          Pricing Plans
        </h2>
        <p className="text-gray-600 text-lg">
          Choose the right learning plan
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Robot Plan */}
        <div className="bg-gradient-to-br from-blue-50 to-slate-100 rounded-2xl p-6 border-2 border-blue-200 hover:shadow-xl transition-all duration-300">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{pricing.robot.name}</h3>
            
            <div className="flex items-center justify-center space-x-3 mb-2">
              <span className="text-2xl font-bold text-gray-400 line-through">
                ${pricing.robot.originalPrice.toLocaleString()}
              </span>
              <span className="text-3xl font-bold text-blue-600">
                ${pricing.robot.currentPrice.toLocaleString()}
              </span>
            </div>
            
            <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-3">
              -{pricing.robot.discount}%
            </div>
            
            <p className="text-gray-600 font-semibold">
              ${pricing.robot.monthlyPrice.toLocaleString()}/month
            </p>
          </div>

          <ul className="space-y-3 mb-6">
            {pricing.robot.features.map((feature, index) => (
              <li key={index} className="flex items-start text-sm">
                <span className="text-blue-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-800 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg">
              Buy
            </button>
            <button className="w-full bg-white text-blue-600 font-semibold py-2 px-6 rounded-xl border-2 border-blue-200 hover:bg-blue-50 transition-all duration-300">
              Details
            </button>
          </div>
        </div>

        {/* Android Plan */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-200 rounded-2xl p-6 border-2 border-slate-300 hover:shadow-xl transition-all duration-300 relative">
          {/* Popular badge */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-sm font-bold px-4 py-1 rounded-full">
              POPULAR
            </div>
          </div>

          <div className="text-center mb-6 mt-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{pricing.android.name}</h3>
            
            <div className="flex items-center justify-center space-x-3 mb-2">
              <span className="text-2xl font-bold text-gray-400 line-through">
                ${pricing.android.originalPrice.toLocaleString()}
              </span>
              <span className="text-3xl font-bold text-purple-600">
                ${pricing.android.currentPrice.toLocaleString()}
              </span>
            </div>
            
            <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-3">
              -{pricing.android.discount}%
            </div>
            
            <p className="text-gray-600 font-semibold">
              ${pricing.android.monthlyPrice.toLocaleString()}/month
            </p>
          </div>

          <ul className="space-y-3 mb-6">
            {pricing.android.features.map((feature, index) => (
              <li key={index} className="flex items-start text-sm">
                <span className="text-purple-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg">
              Buy
            </button>
            <button className="w-full bg-white text-purple-600 font-semibold py-2 px-6 rounded-xl border-2 border-purple-200 hover:bg-purple-50 transition-all duration-300">
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
