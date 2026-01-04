import React, { useEffect, useRef } from 'react';
import { analyticsAPI } from '../utils/api';
// Removed Telegram dependencies - now pure web app
import AnimatedBackground from '../components/AnimatedBackground';

const CommunityPage = () => {
  const heroRef = useRef(null);
  const problemRef = useRef(null);
  const solutionRef = useRef(null);
  const audienceRef = useRef(null);

  useEffect(() => {
    // Track page view
    analyticsAPI.trackClick({
      page: 'community',
      action: 'page_view',
      meta_data: {}
    }).catch(console.error);

    // Advanced Anime.js animations
    if (window.anime) {
      // Hero section animation
      const heroTimeline = window.anime.timeline({
        easing: 'easeOutExpo',
        duration: 1200
      });

      heroTimeline
        .add({
          targets: heroRef.current?.querySelector('.hero-icon'),
          scale: [0, 1],
          rotate: [540, 0],
          duration: 1800,
          easing: 'easeOutElastic(1, .6)'
        })
        .add({
          targets: heroRef.current?.querySelector('.hero-title'),
          translateY: [80, 0],
          opacity: [0, 1],
          duration: 1200
        }, '-=1200')
        .add({
          targets: heroRef.current?.querySelector('.hero-subtitle'),
          translateY: [50, 0],
          opacity: [0, 1],
          duration: 1000
        }, '-=600')
        .add({
          targets: heroRef.current?.querySelectorAll('.hero-stat'),
          scale: [0, 1],
          opacity: [0, 1],
          duration: 800,
          delay: window.anime.stagger(250)
        }, '-=400');

      // Problem section animation
      setTimeout(() => {
        if (problemRef.current) {
          window.anime({
            targets: problemRef.current.querySelectorAll('.problem-item'),
            translateX: [-150, 0],
            opacity: [0, 1],
            scale: [0.8, 1],
            duration: 1000,
            delay: window.anime.stagger(300),
            easing: 'easeOutBack'
          });
        }
      }, 800);

      // Solution section animation
      setTimeout(() => {
        if (solutionRef.current) {
          window.anime({
            targets: solutionRef.current.querySelectorAll('.solution-item'),
            translateX: [150, 0],
            opacity: [0, 1],
            scale: [0.7, 1],
            duration: 1100,
            delay: window.anime.stagger(250),
            easing: 'easeOutElastic(1, .5)'
          });
        }
      }, 1400);

      // Audience cards animation
      setTimeout(() => {
        if (audienceRef.current) {
          window.anime({
            targets: audienceRef.current.querySelectorAll('.audience-card'),
            translateY: [100, 0],
            opacity: [0, 1],
            scale: [0.8, 1],
            rotate: [5, 0],
            duration: 1200,
            delay: window.anime.stagger(350),
            easing: 'easeOutBack'
          });
        }
      }, 2000);
    }
  }, []);

  const handleJoinClick = () => {
    analyticsAPI.trackClick({
      page: 'community',
      action: 'join_button_click',
      meta_data: {}
    }).catch(console.error);
    window.open(process.env.REACT_APP_TELEGRAM_COMMUNITY_LINK || 'https://t.me/ai_teachers_community', '_blank');
  };

  const handleContactClick = () => {
    analyticsAPI.trackClick({
      page: 'community',
      action: 'contact_button_click',
      meta_data: {}
    }).catch(console.error);
    window.open(process.env.REACT_APP_TELEGRAM_BOT_LINK || 'https://t.me/ai_teachers_bot', '_blank');
  };

  return (
    <div className="min-h-screen pb-20 relative bg-transparent" style={{transform: 'translateZ(0)', contain: 'layout'}}>
      {/* Animated Background */}
      <div className="fixed inset-0" style={{zIndex: -1, width: '100vw', height: '200vh'}}>
        <AnimatedBackground variant="neural" />
      </div>
      
      {/* Enhanced Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-600/60 via-slate-700/60 to-slate-800/60 backdrop-blur-sm"></div>
        <div className="relative p-6 min-h-[300px] flex flex-col justify-center text-white">
          {/* Main Icon */}
          <div className="flex justify-center mb-6">
            <div className="hero-icon w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border border-white/30 animate-float">
              <span className="text-4xl">🤖</span>
            </div>
          </div>
          
          <h1 className="hero-title text-2xl font-bold mb-4 text-center leading-tight text-glow">
            AI for Teachers: <br/>
            <span className="hero-subtitle text-blue-200">Community for Teachers of the Future</span>
          </h1>
          <p className="hero-subtitle text-blue-100 text-center max-w-md mx-auto leading-relaxed">
            Private community for those who want to use AI in teaching competently, effectively, and without unnecessary information
          </p>
          
          {/* Stats */}
          <div className="flex justify-center space-x-8 mt-8">
            <div className="hero-stat text-center glass rounded-full px-4 py-2">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-xs text-blue-200">Members</div>
            </div>
            <div className="hero-stat text-center glass rounded-full px-4 py-2">
              <div className="text-2xl font-bold">100+</div>
              <div className="text-xs text-blue-200">Prompts</div>
            </div>
            <div className="hero-stat text-center glass rounded-full px-4 py-2">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-xs text-blue-200">AI Tools</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 relative z-10 bg-transparent">
        {/* Problem Section */}
        <div ref={problemRef} className="glass-neural-bright rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-800 rounded-full flex items-center justify-center mr-4 animate-neural-pulse">
              <span className="text-2xl">❓</span>
            </div>
            <h2 className="text-xl font-bold text-white text-glow">
              How to Keep Up with New Neural Networks?
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="problem-item border-l-4 border-cyan-400 pl-4 bg-cyan-500/10 rounded-r-lg p-3">
              <h3 className="font-medium text-white mb-1">Overload Problem</h3>
              <p className="text-cyan-100 text-sm">
                New neural networks appearing every day create a feeling that it's impossible to keep up with progress. 
                Teachers waste precious time trying to figure out countless tools.
              </p>
            </div>
            
            <div className="problem-item border-l-4 border-blue-400 pl-4 bg-blue-500/10 rounded-r-lg p-3">
              <h3 className="font-medium text-white mb-1">Choice Difficulties</h3>
              <p className="text-cyan-100 text-sm">
                It's not always clear which tools are truly useful for education. 
                Testing useless solutions wastes time and energy.
              </p>
            </div>
            
            <div className="problem-item border-l-4 border-slate-400 pl-4 bg-slate-500/10 rounded-r-lg p-3">
              <h3 className="font-medium text-slate-200 mb-1">Proper Foundation</h3>
              <p className="text-cyan-100 text-sm">
                To effectively use AI, you need to understand its capabilities and limitations. 
                Simply using a tool is not enough.
              </p>
            </div>
            
            <div className="problem-item border-l-4 border-blue-400 pl-4 bg-blue-500/10 rounded-r-lg p-3">
              <h3 className="font-medium text-white mb-1">Lack of Time</h3>
              <p className="text-cyan-100 text-sm">
                Teachers are very busy people and some simply don't have time 
                to go through lengthy training courses.
              </p>
            </div>
          </div>
        </div>

        {/* Solution Section */}
<div ref={solutionRef} className="glass-neural-bright rounded-xl p-6 mb-6 relative z-20">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center mr-4 animate-neural-pulse" style={{animationDelay: '0.5s'}}>
              <span className="text-2xl">✅</span>
            </div>
            <h2 className="text-xl font-bold text-white text-glow">
              AI for Teachers: Your Solution
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="solution-item flex items-start">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0 animate-neural-pulse">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Private Community</h3>
                <p className="text-cyan-100 text-sm">
                  Community for like-minded teachers striving to use AI competently and effectively in teaching.
                </p>
              </div>
            </div>
            
            <div className="solution-item flex items-start">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0 animate-neural-pulse" style={{animationDelay: '0.3s'}}>
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Verified Information</h3>
                <p className="text-cyan-100 text-sm">
                  Access to working solutions and verified information from a programmer 
                  who understands how neural networks "think".
                </p>
              </div>
            </div>
            
            <div className="solution-item flex items-start">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0 animate-neural-pulse" style={{animationDelay: '0.6s'}}>
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Targeted Solutions</h3>
                <p className="text-cyan-100 text-sm">
                  Every week short (up to 10 minutes) lessons, AI tricks, service reviews, 
                  ready-made prompts in "take and apply immediately" format.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div ref={audienceRef} className="glass-neural-bright rounded-xl p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center mr-4 animate-neural-pulse" style={{animationDelay: '1s'}}>
              <span className="text-2xl">👥</span>
            </div>
            <h2 className="text-xl font-bold text-white text-glow">
              Who Is This For?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="audience-card relative bg-gradient-to-r from-blue-500/20 to-slate-600/20 rounded-xl p-6 border border-blue-400/30 overflow-hidden hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-full -mr-10 -mt-10 animate-pulse"></div>
              <div className="relative">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3 animate-bounce">🌱</span>
                  <h3 className="font-bold text-white text-lg">AI Beginner</h3>
                </div>
                <p className="text-cyan-100 leading-relaxed">
                  Knowledge base with AI basics, simple instructions, ready-made prompts 
                  and support so you can start applying AI immediately without unnecessary complexity.
                </p>
              </div>
            </div>
            
            <div className="audience-card relative bg-gradient-to-r from-blue-500/20 to-slate-600/20 rounded-xl p-6 border border-blue-400/30 overflow-hidden hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/20 rounded-full -mr-10 -mt-10 animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="relative">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3 animate-bounce" style={{animationDelay: '0.2s'}}>💪</span>
                  <h3 className="font-bold text-white text-lg">Confident User</h3>
                </div>
                <p className="text-cyan-100 leading-relaxed">
                  Routine automation, best tools and advanced life hacks. 
                  We'll reveal new AI applications you didn't know about.
                </p>
              </div>
            </div>
            
            <div className="audience-card relative bg-gradient-to-r from-blue-500/20 to-slate-600/20 rounded-xl p-6 border border-blue-400/30 overflow-hidden hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-full -mr-10 -mt-10 animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="relative">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3 animate-bounce" style={{animationDelay: '0.4s'}}>🚀</span>
                  <h3 className="font-bold text-white text-lg">AI Guru</h3>
                </div>
                <p className="text-cyan-100 leading-relaxed">
                  Access to fresh trends, complex integrations and experience sharing with professionals. 
                  New ideas for masterful AI use.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Inside */}
        <div className="glass-neural-bright rounded-xl p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mr-4 animate-neural-pulse" style={{animationDelay: '1.5s'}}>
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-xl font-bold text-white text-glow">
              What Awaits You in the Community?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-4 mt-1 backdrop-blur-sm border border-blue-400/30">
                <span className="text-blue-300">🔍</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Neural Network Reviews</h3>
                <p className="text-cyan-100 text-sm">
                  Analysis and evaluation of new tools useful for education. That you definitely need to use.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-4 mt-1 backdrop-blur-sm border border-green-400/30">
                <span className="text-green-300">🧠</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Mastermind</h3>
                <p className="text-cyan-100 text-sm">
                  Personal call with Yaroslav where he'll answer your questions and share AI tricks.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-4 mt-1 backdrop-blur-sm border border-blue-400/30">
                <span className="text-blue-300">👥</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Teachers of the Future Community</h3>
                <p className="text-cyan-100 text-sm">
                  Chat for communication, sharing ideas and solutions with colleagues. Environment where everyone grows together.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center mr-4 mt-1 backdrop-blur-sm border border-orange-400/30">
                <span className="text-orange-300">📚</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Knowledge Base</h3>
                <p className="text-cyan-100 text-sm">
                  If you're just starting to learn neural networks, get a solid foundation and understanding of proper work with them.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mr-4 mt-1 backdrop-blur-sm border border-red-400/30">
                <span className="text-red-300">⚡</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Ready Prompts and Tricks</h3>
                <p className="text-cyan-100 text-sm">
                  Every week sections with useful prompts, new service reviews and AI application tricks.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 bg-slate-500/20 rounded-full flex items-center justify-center mr-4 mt-1 backdrop-blur-sm border border-slate-400/30">
                <span className="text-slate-300">🎨</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">All Types of AI</h3>
                <p className="text-cyan-100 text-sm">
                  We cover all areas of AI application in education: text, photo, video, audio, games, automation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="glass-neural-bright rounded-xl p-6 mb-6 text-white border border-green-400/30">
          <h2 className="text-lg font-semibold mb-4">
            🎯 Participation Results
          </h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-green-200 mr-3">✓</span>
              <span className="text-sm">80% time savings in lesson preparation</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-200 mr-3">✓</span>
              <span className="text-sm">Creative lessons that your students will love</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-200 mr-3">✓</span>
              <span className="text-sm">Master tools that 90% of teachers don't know how to use</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-200 mr-3">✓</span>
              <span className="text-sm">Be first to learn about education trends and AI tricks</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-200 mr-3">✓</span>
              <span className="text-sm">Use AI for marketing, automation and business</span>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="glass-neural-bright rounded-xl p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm border border-yellow-400/30">
              <span className="text-2xl">💬</span>
            </div>
            <h2 className="text-xl font-bold text-white text-glow">
              Reviews from My Product Users
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="glass-neural rounded-lg p-5 border-l-4 border-blue-400 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-blue-300/50 text-6xl font-serif">"</div>
              <div className="relative">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <h4 className="font-bold text-white">Maria</h4>
                </div>
                <p className="text-cyan-100 italic leading-relaxed">
                  "How to prepare students for exams, create a community and change your teaching approach by 180°"
                </p>
              </div>
            </div>
            
            <div className="glass-neural rounded-lg p-5 border-l-4 border-green-400 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-green-300/50 text-6xl font-serif">"</div>
              <div className="relative">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <h4 className="font-bold text-white">Anna</h4>
                </div>
                <p className="text-cyan-100 italic leading-relaxed">
                  "In these few weeks I learned more about methodology than in 5 years at university😁 
                  Learned to create quest games using neural networks."
                </p>
              </div>
            </div>
            
            <div className="glass-neural rounded-lg p-5 border-l-4 border-blue-400 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-blue-300/50 text-6xl font-serif">"</div>
              <div className="relative">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                  <h4 className="font-bold text-white">Eugenia</h4>
                </div>
                <p className="text-cyan-100 italic leading-relaxed">
                  "Now I can't imagine my lessons without neural networks. My students THEMSELVES suggested 
                  raising the price of my lessons!"
                </p>
              </div>
            </div>
            
            <div className="glass-neural rounded-lg p-5 border-l-4 border-orange-400 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-orange-300/50 text-6xl font-serif">"</div>
              <div className="relative">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">L</span>
                  </div>
                  <h4 className="font-bold text-white">Liz</h4>
                </div>
                <p className="text-cyan-100 italic leading-relaxed">
                  "The student was simply delighted with the lesson I generated - it turned out to be a real extravaganza!"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="glass-neural-bright rounded-xl p-6 mb-6 border border-orange-400/30">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm border border-yellow-400/30">
              <span className="text-2xl">💰</span>
            </div>
            <h2 className="text-xl font-bold text-white text-glow">
              Participation Cost
            </h2>
          </div>
          
          <div className="text-center">
            <div className="relative bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl p-6 mb-6 text-white overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.1%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%2230%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
              <div className="relative">
                <div className="flex items-center justify-center space-x-6 mb-3">
                  <span className="text-2xl font-bold line-through opacity-75">$499</span>
                  <div className="bg-white/20 rounded-full px-4 py-2">
                    <span className="text-4xl font-bold">$230</span>
                  </div>
                </div>
                <div className="bg-yellow-400 text-yellow-900 rounded-full px-4 py-1 text-sm font-bold inline-block mb-2">
                  54% DISCOUNT
                </div>
                <p className="text-orange-100">per month</p>
              </div>
            </div>
            
            <div className="glass-neural rounded-lg p-4 border border-blue-400/30">
              <div className="flex items-center justify-center mb-2">
                <span className="text-lg mr-2">📅</span>
                <p className="text-white font-medium">
                  Community start: 14th of each month
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4 mb-6">
          <button
            onClick={handleJoinClick}
            className="relative w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-5 px-6 rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden animate-neural-pulse"
          >
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-data-flow"></div>
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 animate-bounce">
                <span className="text-xl">👥</span>
              </div>
              <span className="text-lg">View all reviews and join</span>
            </div>
          </button>
          
          <button
            onClick={handleContactClick}
            className="relative w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-5 px-6 rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden animate-neural-pulse"
            style={{animationDelay: '0.5s'}}
          >
            <div className="absolute inset-0 bg-white/10 animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-data-flow" style={{animationDelay: '1s'}}></div>
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 animate-bounce" style={{animationDelay: '0.3s'}}>
                <span className="text-xl">💬</span>
              </div>
              <span className="text-lg">Pay for participation and ask a question</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
