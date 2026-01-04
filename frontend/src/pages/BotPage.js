import React, { useEffect } from 'react';
import { analyticsAPI } from '../utils/api';
// Removed Telegram dependencies - now pure web app
import AnimatedBackground from '../components/AnimatedBackground';

const BotPage = () => {
  useEffect(() => {
    // Track page view
    analyticsAPI.trackClick({
      page: 'bot',
      action: 'page_view',
      meta_data: {}
    }).catch(console.error);
  }, []);

  const handleOpenBotClick = async () => {
    // Track click
    await analyticsAPI.trackClick({
      page: 'bot',
      action: 'open_bot_click',
      meta_data: {}
    }).catch(console.error);

    // Open SolarTutor bot
    window.open('https://t.me/SolarTutor_Bot', '_blank');
  };

  return (
    <div className="min-h-screen relative pb-20">
      <AnimatedBackground variant="cosmic-css" />
      <div className="max-w-md mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-slate-600 to-slate-700 rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/40 border-2 border-blue-300/50 relative">
              <span className="text-3xl text-white drop-shadow-2xl relative z-10">☀️</span>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-600/20 to-slate-700/20 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute inset-0 w-28 h-28 bg-gradient-to-r from-blue-600/15 via-slate-600/15 to-slate-700/15 rounded-full mx-auto animate-pulse"></div>
          </div>

          <div className="glass-neural-bright rounded-2xl p-6 border border-blue-400/30 shadow-2xl shadow-blue-500/20 mb-4">
            <h1 className="text-4xl font-black mb-3 drop-shadow-lg tracking-wider text-center">
              <span className="bg-gradient-to-r from-blue-600 via-slate-600 to-slate-700 bg-clip-text text-transparent">
                SOLARTUTOR
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 via-slate-500 to-slate-600 mx-auto rounded-full shadow-lg"></div>
          </div>

          <div className="glass-neural rounded-2xl p-4 border border-blue-400/30 shadow-xl shadow-blue-500/15">
            <p className="text-gray-700 text-base font-semibold leading-relaxed">
              <span className="text-blue-500 text-lg">🧠</span> AI methodologist for English teachers
              <br />
              <span className="text-slate-600 font-bold">Complete lessons in 40 seconds!</span>
              <span className="text-blue-500 text-lg ml-1">⚡</span>
            </p>
          </div>
        </div>

        {/* Why SolarTutor is different */}
        <div className="glass-neural-bright rounded-xl p-6 mb-6 border border-blue-400/30">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4 text-center">
            🧡 WHY NOT CHATGPT?
          </h2>
          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h3 className="font-bold text-red-700 mb-2 flex items-center">
                <span className="mr-2">🔎</span> ChatGPT gives fragments
              </h3>
              <ul className="text-red-600 text-sm space-y-1">
                <li>• Long prompts → short answers</li>
                <li>• Disconnected lesson parts</li>
                <li>• Dozens of clarifications needed</li>
                <li>• You waste time instead of saving it</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-bold text-green-700 mb-2 flex items-center">
                <span className="mr-2">✅</span> SolarTutor creates complete lessons
              </h3>
              <ul className="text-green-600 text-sm space-y-1">
                <li>• No prompts - just topic and level</li>
                <li>• Full plan in 40-60 seconds</li>
                <li>• Methodologically verified structure</li>
                <li>• Everything connected and ready to use</li>
              </ul>
            </div>
          </div>
        </div>

        {/* What you get */}
        <div className="glass-neural-bright rounded-xl p-6 mb-6 border border-slate-400/30">
          <h2 className="text-xl font-bold bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent mb-4 text-center">
            WHAT YOU GET
          </h2>
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center mb-2">
                <span className="text-blue-600 mr-2">📋</span>
                <h3 className="font-bold text-blue-700">Complete Lesson Plan</h3>
              </div>
              <p className="text-blue-600 text-sm">Warm-up → Presentation → Practice → Production → Homework</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="flex items-center mb-2">
                <span className="text-slate-600 mr-2">⏰</span>
                <h3 className="font-bold text-slate-700">Stage Timing</h3>
              </div>
              <p className="text-slate-600 text-sm">Precise time for each lesson part</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="flex items-center mb-2">
                <span className="text-slate-600 mr-2">💬</span>
                <h3 className="font-bold text-slate-700">Teacher Script</h3>
              </div>
              <p className="text-slate-600 text-sm">Ready-made phrases and instructions</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="flex items-center mb-2">
                <span className="text-slate-600 mr-2">🎯</span>
                <h3 className="font-bold text-slate-700">Exercises with Keys</h3>
              </div>
              <p className="text-slate-600 text-sm">Ready tasks with answers and examples</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center mb-2">
                <span className="text-blue-600 mr-2">🎮</span>
                <h3 className="font-bold text-blue-700">Games + Visuals</h3>
              </div>
              <p className="text-blue-600 text-sm">Interactive games and beautiful illustrations</p>
            </div>
          </div>
        </div>

        {/* Reviews Section - Placeholder for circles */}
        <div className="glass-neural-bright rounded-xl p-6 mb-6 border border-slate-400/30">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg shadow-slate-500/30 border border-slate-300">
              <span className="text-white text-xl drop-shadow-lg">⭐</span>
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
              TEACHER REVIEWS
            </h2>
          </div>

          {/* Placeholder for review circles - will be added later */}
          <div className="text-center py-8">
            <div className="text-pink-500/60 text-sm font-medium">
              Reviews will be displayed as circles here
            </div>
            <div className="text-pink-400/60 text-xs mt-2">
              (space reserved for Stories/circles)
            </div>
          </div>
        </div>

        {/* Free access */}
        <div className="glass-neural-bright rounded-xl p-6 mb-6 border border-green-400/30">
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4 text-center">
            💚 FREE ACCESS
          </h2>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center mb-3">
              <span className="text-green-600 text-xl mr-3">🎁</span>
              <h3 className="font-bold text-green-700">Invite a Colleague</h3>
            </div>
            <p className="text-green-600 text-sm mb-3">
              Share your referral link with other teachers
            </p>
            <div className="bg-green-100 rounded-lg p-3 border border-green-300">
              <p className="text-green-700 text-sm font-semibold">
                <span className="text-orange-600">⚡</span> For each friend: +5 texts and +5 images free
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl shadow-2xl shadow-slate-500/20 p-8 border-2 border-slate-300 overflow-hidden group mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-slate-200/30 to-slate-300/30"></div>

          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-slate-600 to-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl shadow-blue-500/40 border-2 border-blue-400">
              <span className="text-2xl text-white drop-shadow-2xl">🚀</span>
            </div>

            <h2 className="text-2xl font-black mb-3 bg-gradient-to-r from-blue-700 via-slate-700 to-slate-800 bg-clip-text text-transparent">
              TRY IT RIGHT NOW!
            </h2>

            <p className="text-gray-700 text-base font-semibold mb-6 leading-relaxed">
              Create your first methodologically sound lesson in 40 seconds
            </p>

            <button
              onClick={handleOpenBotClick}
              className="w-full bg-gradient-to-r from-blue-600 via-slate-600 to-slate-700 text-white font-black py-4 px-6 rounded-xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-blue-500/30 border-2 border-blue-400"
            >
              <span className="text-lg">OPEN SOLARTUTOR</span>
            </button>

            <p className="text-gray-600 text-sm mt-3 font-medium">
              <span className="text-orange-600">⚡</span> Opens Telegram bot
            </p>
          </div>

          <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
          <div className="absolute bottom-2 left-2 w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
        </div>

        {/* Pricing */}
        <div className="glass-neural-bright rounded-xl p-6 border border-blue-400/30">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6 text-center">
            💎 SOLARTUTOR PRICING
          </h2>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-blue-700 text-lg">💎 Basic</div>
                  <div className="text-blue-600 text-sm">8 text generations + 4 images per day</div>
                </div>
                <div className="text-blue-700 font-black text-xl">$400/mo</div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-slate-300 transition-colors relative">
              <div className="absolute -top-2 -right-2 bg-slate-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                POPULAR
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-700 text-lg">⭐ Standard</div>
                  <div className="text-slate-600 text-sm">16 text generations + 8 images per day</div>
                </div>
                <div className="text-slate-700 font-black text-xl">$550/mo</div>
              </div>
            </div>

            <div className="bg-slate-100 rounded-lg p-4 border border-slate-300 hover:border-slate-400 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-700 text-lg">🔥 Premium</div>
                  <div className="text-slate-600 text-sm">25 text generations + 15 images per day</div>
                </div>
                <div className="text-slate-700 font-black text-xl">$750/mo</div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center mb-2">
              <span className="text-green-600 text-lg mr-2">✅</span>
              <h3 className="font-bold text-green-700">Your Security:</h3>
            </div>
            <ul className="text-green-600 text-sm space-y-1">
              <li>💳 Pay with any card via YooKassa</li>
              <li>❌ Cancel subscription in 2 clicks</li>
              <li>🔒 Secure payments</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotPage;
