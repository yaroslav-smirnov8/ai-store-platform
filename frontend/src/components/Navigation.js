import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/courses', icon: '📚', label: 'Courses' },
    { path: '/community', icon: '👥', label: 'Community' },
    { path: '/bot', icon: '🤖', label: 'Bot' },
    { path: '/contact', icon: '📞', label: 'Contact' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50" style={{transform: 'translateZ(0)'}}>
      <div className="glass-nav border-t border-blue-400/30 px-4 py-3 backdrop-blur-xl bg-gradient-to-r from-slate-900/20 via-blue-900/20 to-slate-900/20">
        <div className="flex justify-around">
          {navItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 will-change-transform ${
                location.pathname === item.path
                  ? 'text-white bg-blue-500 shadow-lg shadow-blue-500/50 scale-110 animate-neural-pulse'
                  : 'text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-400/30 hover:to-slate-500/30 hover:shadow-lg hover:shadow-blue-400/25 hover:scale-105'
              }`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <span className={`text-lg mb-1 transition-all duration-300 ${
                location.pathname === item.path ? 'animate-bounce' : ''
              }`}>
                {item.icon}
              </span>
              <span className="text-xs font-semibold">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
