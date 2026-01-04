import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI } from '../utils/api';
// Removed Telegram dependencies - now pure web app
import AnimatedBackground from '../components/AnimatedBackground';

const FreeLessonsPage = () => {
  useEffect(() => {
    // Track page view
    analyticsAPI.trackClick({
      page: 'free-lessons',
      action: 'page_view',
      meta_data: {}
    }).catch(console.error);
  }, []);

  const handleLessonClick = async (lessonId, lessonTitle) => {
    // Track lesson click
    await analyticsAPI.trackClick({
      page: 'free-lessons',
      action: 'lesson_click',
      meta_data: { lesson_id: lessonId, lesson_title: lessonTitle }
    }).catch(console.error);
  };

  const handleTryMoreClick = async () => {
    // Track CTA click
    await analyticsAPI.trackClick({
      page: 'free-lessons',
      action: 'try_more_click',
      meta_data: {}
    }).catch(console.error);
  };

  const freeLessons = [
    {
      id: 1,
      title: "React Basics: Components and Props",
      description: "Learn basic React concepts and create your first component",
      duration: "15 min",
      type: "video",
      difficulty: "Beginner",
      topics: ["React", "JavaScript", "Frontend"]
    },
    {
      id: 2,
      title: "REST API: Principles and Best Practices",
      description: "Learn how to properly design RESTful APIs",
      duration: "20 min",
      type: "text",
      difficulty: "Intermediate",
      topics: ["API", "Backend", "HTTP"]
    },
    {
      id: 3,
      title: "Git: Essential Commands for Team Work",
      description: "Master basic Git commands for effective collaboration",
      duration: "12 min",
      type: "interactive",
      difficulty: "Beginner",
      topics: ["Git", "DevOps", "Teamwork"]
    },
    {
      id: 4,
      title: "CSS Flexbox: Modern Layout",
      description: "Learn Flexbox to create responsive layouts",
      duration: "18 min",
      type: "video",
      difficulty: "Beginner",
      topics: ["CSS", "Frontend", "Layout"]
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return '🎥';
      case 'text': return '📖';
      case 'interactive': return '🎮';
      default: return '📚';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen pb-20 relative">
      <AnimatedBackground variant="neural" />
      <div className="max-w-md mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl text-white">🎁</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 text-glow">
            Free Lessons
          </h1>
          <p className="text-cyan-100 text-sm">
            Try our approach to learning completely free
          </p>
        </div>

        {/* Lessons */}
        <div className="space-y-4 mb-8">
          {freeLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="glass-neural-bright rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 border border-blue-400/30"
              onClick={() => handleLessonClick(lesson.id, lesson.title)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getTypeIcon(lesson.type)}</span>
                  <div>
                    <h3 className="font-semibold text-white text-sm leading-tight">
                      {lesson.title}
                    </h3>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-xs text-cyan-200">{lesson.duration}</span>
                      <span className="text-xs text-cyan-300">•</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                        {lesson.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-cyan-100 text-sm mb-3 leading-relaxed">
                {lesson.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {lesson.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-cyan-200">Click to view</span>
                  <span className="text-blue-400">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="glass-neural-bright rounded-xl p-6 mb-6 border border-green-400/30">
          <h2 className="text-lg font-semibold text-white mb-4 text-glow">
            Why Try It?
          </h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span className="text-cyan-100 text-sm">No hidden fees</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span className="text-cyan-100 text-sm">Quality content from experts</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span className="text-cyan-100 text-sm">Practical examples and assignments</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span className="text-cyan-100 text-sm">Lifetime access</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-neural rounded-xl p-4 text-center border border-yellow-400/30">
            <div className="text-2xl font-bold text-yellow-600 mb-1">4</div>
            <div className="text-xs text-cyan-200">Free lessons</div>
          </div>
          <div className="glass-neural rounded-xl p-4 text-center border border-blue-400/30">
            <div className="text-2xl font-bold text-blue-600 mb-1">65</div>
            <div className="text-xs text-cyan-200">Minutes of content</div>
          </div>
          <div className="glass-neural rounded-xl p-4 text-center border border-green-400/30">
            <div className="text-2xl font-bold text-green-600 mb-1">∞</div>
            <div className="text-xs text-cyan-200">Access</div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white text-center">
          <h2 className="text-lg font-semibold mb-2">
            Liked it? There's more!
          </h2>
          <p className="text-yellow-100 text-sm mb-4">
            Our paid courses offer even more practice and depth
          </p>
          <Link
            to="/courses"
            onClick={handleTryMoreClick}
            className="inline-block w-full bg-white text-blue-600 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View All Courses
          </Link>
        </div>

        {/* Testimonial */}
        <div className="mt-6 glass-neural-bright rounded-xl p-6 border border-blue-400/30">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold">SJ</span>
            </div>
            <div>
              <p className="text-cyan-100 text-sm italic mb-2">
                "Free lessons helped me understand if this learning style suits me.
                Quality exceeded expectations!"
              </p>
              <div className="text-xs text-cyan-200">
                — Sarah Johnson, React course student
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeLessonsPage;
