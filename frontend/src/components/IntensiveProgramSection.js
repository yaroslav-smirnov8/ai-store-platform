import React, { useState } from 'react';

const IntensiveProgramSection = ({ program }) => {
  const [selectedModule, setSelectedModule] = useState(null);

  const moduleIcons = {
    'Introduction': '🚀',
    'Methodology': '📚',
    'Photo, Video': '🎥',
    'Audio': '🎵',
    'Games': '🎮',
    'Automation': '⚙️',
    'Bonus': '🎁'
  };

  const handleModuleClick = (module, index) => {
    setSelectedModule(selectedModule === index ? null : index);
  };

  return (
    <div>
      {/* Module Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {program.map((module, index) => (
          <button
            key={index}
            onClick={() => handleModuleClick(module, index)}
            className={`
              relative p-4 rounded-xl transition-all duration-300 hover:scale-105
              ${selectedModule === index 
                ? 'bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-2 border-cyan-400/50 shadow-lg' 
                : 'bg-white/10 hover:bg-white/20 border border-white/20'
              }
            `}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{moduleIcons[module.title] || '📖'}</div>
              <h4 className="text-white font-semibold text-sm leading-tight">{module.title}</h4>
            </div>
            {selectedModule === index && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-black text-xs font-bold">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Selected Module Content */}
      {selectedModule !== null && (
        <div className="bg-white/5 rounded-xl p-6 border border-cyan-400/30 animate-fadeInUp">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">{moduleIcons[program[selectedModule].title] || '📖'}</span>
            <h4 className="text-white font-bold text-xl">{program[selectedModule].title}</h4>
          </div>
          <ul className="space-y-3">
            {program[selectedModule].lessons.map((lesson, lessonIndex) => (
              <li key={lessonIndex} className="text-blue-100 text-sm flex items-start">
                <span className="text-cyan-400 mr-3 mt-1">•</span>
                <span>{lesson}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default IntensiveProgramSection;
