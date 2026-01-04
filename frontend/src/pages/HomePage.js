import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI } from '../utils/api';
import { useAnime, storeAnimations } from '../utils/useAnime';
import AnimatedBackground from '../components/AnimatedBackground';

const HomePage = () => {
  const heroRef = useRef(null);
  const expertSectionRef = useRef(null);
  const quickActionsRef = useRef(null);
  const ctaRef = useRef(null);

  useLayoutEffect(() => {
    // Track page view
    analyticsAPI.trackClick({
      page: 'home',
      action: 'page_view',
      meta_data: {}
    }).catch(console.error);

    // Simple, clean animations without complex transforms
    if (window.anime) {
      // Hero icon
      window.anime({
        targets: heroRef.current?.querySelector('.hero-icon'),
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 800,
        easing: 'easeOutQuart'
      });

      // Hero title
      setTimeout(() => {
        window.anime({
          targets: heroRef.current?.querySelector('.hero-title'),
          opacity: [0, 1],
          duration: 600,
          easing: 'easeOutQuart'
        });
      }, 200);

      // Hero subtitle
      setTimeout(() => {
        window.anime({
          targets: heroRef.current?.querySelector('.hero-subtitle'),
          opacity: [0, 1],
          duration: 600,
          easing: 'easeOutQuart'
        });
      }, 400);

      // Hero stats
      setTimeout(() => {
        window.anime({
          targets: heroRef.current?.querySelectorAll('.hero-stat'),
          opacity: [0, 1],
          duration: 500,
          delay: window.anime.stagger(100),
          easing: 'easeOutQuart'
        });
      }, 600);

      // Expert items
      setTimeout(() => {
        window.anime({
          targets: expertSectionRef.current?.querySelectorAll('.expert-item'),
          opacity: [0, 1],
          duration: 600,
          delay: window.anime.stagger(150),
          easing: 'easeOutQuart'
        });
      }, 800);

      // Action cards
      setTimeout(() => {
        window.anime({
          targets: quickActionsRef.current?.querySelectorAll('.action-card'),
          opacity: [0, 1],
          duration: 600,
          delay: window.anime.stagger(100),
          easing: 'easeOutQuart'
        });
      }, 1000);

      // CTA section
      setTimeout(() => {
        window.anime({
          targets: ctaRef.current,
          opacity: [0, 1],
          duration: 600,
          easing: 'easeOutQuart'
        });
      }, 1200);
    }
  }, []);

  // Removed Telegram user - now pure web app

  const handleLinkClick = (action) => {
    analyticsAPI.trackClick({
      page: 'home',
      action: action,
      meta_data: {}
    }).catch(console.error);
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground variant="neural" />
      
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/60 via-slate-700/60 to-slate-800/60 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative text-white p-8">
          <div className="text-center">
            <div className="hero-icon w-24 h-24 bg-white bg-opacity-20 rounded-full mx-auto mb-6 flex items-center justify-center backdrop-blur-lg border border-white border-opacity-30 opacity-0">
              <span className="text-4xl">🤖</span>
            </div>
            <h1 className="hero-title text-4xl font-extrabold mb-3 opacity-0" style={{color: 'white'}}>
              Yaroslav Smirnov
            </h1>
            <p className="hero-subtitle text-blue-100 text-base mb-6 font-medium opacity-0">
              Programmer and English teacher with 9+ years of experience
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="hero-stat glass rounded-full px-4 py-2 opacity-0">
                <span className="mr-2">📚</span>500+ students
              </div>
              <div className="hero-stat glass rounded-full px-4 py-2 opacity-0">
                <span className="mr-2">⭐</span>4.9/5 rating
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
      </div>

      <div className="p-6 relative z-10">
        {/* About Section */}
        <div ref={expertSectionRef} className="glass-neural-bright p-8 mb-8 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white mb-6 text-center text-glow">
            About AI for Teachers Project
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="expert-item text-center opacity-0 no-flicker smooth-animate hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800 rounded-3xl mx-auto mb-6 flex items-center justify-center animate-neural-pulse shadow-2xl border border-white/20 hover:shadow-blue-500/25 no-flicker">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <h3 className="font-bold text-white text-lg mb-2 text-glow">Project Founder</h3>
              <h4 className="font-semibold text-blue-300 text-base mb-4 bg-blue-500/10 rounded-full px-4 py-1 inline-block border border-blue-400/20">AI for Teachers</h4>
              <p className="text-blue-100 text-sm leading-relaxed px-2">Implementing neural networks and automation tools into lessons and teaching workflow</p>
            </div>
            <div className="expert-item text-center opacity-0 no-flicker smooth-animate hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 rounded-3xl mx-auto mb-6 flex items-center justify-center animate-neural-pulse shadow-2xl border border-white/20 hover:shadow-slate-500/25 no-flicker" style={{animationDelay: '0.3s'}}>
                <span className="text-white text-2xl">👨‍💻</span>
              </div>
              <h3 className="font-bold text-white text-lg mb-2 text-glow">Mentor</h3>
              <h4 className="font-semibold text-slate-300 text-base mb-4 bg-slate-500/10 rounded-full px-4 py-1 inline-block border border-slate-400/20">in Programming</h4>
              <p className="text-slate-100 text-sm leading-relaxed px-2">At a major programming school. Main skill - explaining complex things in simple terms</p>
            </div>
            <div className="expert-item text-center opacity-0 no-flicker smooth-animate hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800 rounded-3xl mx-auto mb-6 flex items-center justify-center animate-neural-pulse shadow-2xl border border-white/20 hover:shadow-blue-500/25 no-flicker" style={{animationDelay: '0.6s'}}>
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="font-bold text-white text-lg mb-2 text-glow">My Mission</h3>
              <h4 className="font-semibold text-blue-300 text-base mb-4 bg-blue-500/10 rounded-full px-4 py-1 inline-block border border-blue-400/20">Education of the Future</h4>
              <p className="text-blue-100 text-sm leading-relaxed px-2">Create education of the future where every student is engaged and every teacher is at peak creativity</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-8 mb-10" ref={quickActionsRef}>
          <Link
            to="/free-lessons"
            onClick={() => handleLinkClick('free_lessons_click')}
            className="action-card glass-neural-bright p-8 text-center group hover:scale-110 transition-all duration-500 rounded-3xl shadow-2xl hover:shadow-emerald-500/25 border border-white/10 backdrop-blur-xl opacity-0 no-flicker smooth-animate hover:border-emerald-400/30"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 rounded-3xl mx-auto mb-6 flex items-center justify-center animate-float-enhanced shadow-2xl border border-white/20 group-hover:shadow-emerald-400/50 no-flicker">
              <span className="text-2xl">🎁</span>
            </div>
            <h3 className="font-bold text-white mb-3 text-lg text-glow">Free Lessons</h3>
            <p className="text-cyan-100 text-sm mb-4 leading-relaxed">Try our teaching quality</p>
            <div className="mt-4 bg-emerald-500/20 rounded-full px-6 py-2 text-emerald-300 font-semibold text-sm group-hover:bg-emerald-400/30 group-hover:text-emerald-200 transition-all duration-300 border border-emerald-400/30">
              Start for Free →
            </div>
          </Link>
          
          <Link
            to="/courses"
            onClick={() => handleLinkClick('courses_click')}
            className="action-card glass-neural-bright p-8 text-center group hover:scale-110 transition-all duration-500 rounded-3xl shadow-2xl hover:shadow-blue-500/25 border border-white/10 backdrop-blur-xl opacity-0 no-flicker smooth-animate hover:border-blue-400/30"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-slate-600 to-slate-700 rounded-3xl mx-auto mb-6 flex items-center justify-center animate-float-enhanced shadow-2xl border border-white/20 group-hover:shadow-blue-400/50 no-flicker" style={{animationDelay: '0.5s'}}>
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="font-bold text-white mb-3 text-lg text-glow">Courses</h3>
            <p className="text-cyan-100 text-sm mb-4 leading-relaxed">Full immersion in AI</p>
            <div className="mt-4 bg-blue-500/20 rounded-full px-6 py-2 text-blue-300 font-semibold text-sm group-hover:bg-blue-400/30 group-hover:text-blue-200 transition-all duration-300 border border-blue-400/30">
              Choose Course →
            </div>
          </Link>
        </div>

        {/* CTA Section */}
        <div ref={ctaRef} className="glass-neural-bright rounded-3xl mb-8 p-10 text-center opacity-0 shadow-2xl border border-white/10 backdrop-blur-xl">
          <div className="animate-fadeInUp">
            <h2 className="text-2xl font-bold mb-3 text-white text-glow">
              Ready to Start Learning?
            </h2>
            <p className="text-cyan-100 mb-6 text-base">
              Choose the right format and start growing today
            </p>
            <Link
              to="/courses"
              onClick={() => handleLinkClick('cta_courses_click')}
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 text-white font-extrabold py-4 px-10 rounded-xl hover:from-blue-500 hover:to-blue-700 transition-all duration-300 hover:scale-105 animate-neural-pulse shadow-lg hover:shadow-xl"
            >
              View Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
