import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import CourseTypeSelector from '../components/CourseTypeSelector';
// EmptyState removed - no longer needed
import ErrorBoundary from '../components/ErrorBoundary';
import InstructorSection from '../components/InstructorSection';
import LearningModulesSection from '../components/LearningModulesSection';
import CourseBenefitsSection from '../components/CourseBenefitsSection';
import AnimatedBackground from '../components/AnimatedBackground';
import TestimonialsSection from '../components/TestimonialsSection';
import PricingSection from '../components/PricingSection';
import FAQSection from '../components/FAQSection';
import IntensiveProgramSection from '../components/IntensiveProgramSection';
import { productsAPI, ordersAPI, paymentsAPI, analyticsAPI } from '../utils/api';
// Removed Telegram dependencies - now pure web app
import { getCourseTypeFromUrl, updateUrlWithCourseType, listenForUrlChanges, DEFAULT_COURSE_TYPE } from '../utils/urlParams';
import { filterAndSortProducts, hasProductsForType } from '../utils/productFilters';
import { courseData } from '../data/courseData';

const CoursesPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseType, setCourseType] = useState(null); // Will be set in useEffect
  const [expandedSections, setExpandedSections] = useState({});
  const navigate = useNavigate();

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    if (!courseType) return [];
    return filterAndSortProducts(products, courseType);
  }, [products, courseType]);

  // Initialize course type from URL or set default
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const typeFromUrl = urlParams.get('type');

    if (typeFromUrl && ['regular', 'intensive'].includes(typeFromUrl)) {
      setCourseType(typeFromUrl);
    } else {
      // Set default course type if no parameter is specified
      setCourseType(DEFAULT_COURSE_TYPE);
      // Update URL with default type to maintain consistency
      updateUrlWithCourseType(DEFAULT_COURSE_TYPE);
    }
  }, []);

  // Load products and setup
  useEffect(() => {
    loadProducts();

    // Track page view
    analyticsAPI.trackClick({
      page: 'courses',
      action: 'page_view',
      meta_data: { course_type: courseType || 'none' }
    }).catch(console.error);

    // Cleanup - no Telegram button to hide anymore
    return () => { };
  }, [courseType]);

  // Listen for URL changes (browser back/forward)
  useEffect(() => {
    const cleanup = listenForUrlChanges((newType) => {
      setCourseType(newType);
    });

    return cleanup;
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      // Filter only courses and intensives
      const courseProducts = response.data.filter(
        product => product.type === 'course' || product.type === 'intensive'
      );
      setProducts(courseProducts);
    } catch (err) {
      setError('Failed to load courses');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (newType) => {
    try {
      setCourseType(newType);
      updateUrlWithCourseType(newType);

      // Track course type selection
      analyticsAPI.trackClick({
        page: 'courses',
        action: 'course_type_selected',
        meta_data: {
          course_type: newType,
          previous_type: courseType
        }
      }).catch(error => {
        console.error('Analytics tracking error:', error);
      });
    } catch (error) {
      console.error('Error changing course type:', error);
      // Fallback to default type if error occurs
      setCourseType('intensive');
    }
  };

  // handleSwitchToIntensive removed - no longer needed

  const handleBuyClick = async (product, paymentType) => {
    // Pure web app - no Telegram required

    try {
      // Track purchase intent
      await analyticsAPI.trackClick({
        page: 'courses',
        action: 'buy_click',
        product_id: product.id,
        meta_data: {
          payment_type: paymentType,
          course_type: courseType
        }
      });

      // Create order
      const orderData = {
        product_id: product.id,
        payment_type: paymentType,
        installment_months: paymentType === 'installment' ? product.installment_months : null
      };

      const orderResponse = await ordersAPI.create(orderData);
      const order = orderResponse.data;

      // Create payment
      const paymentData = {
        order_id: order.id,
        return_url: `${window.location.origin}/payment-success`
      };

      const paymentResponse = await paymentsAPI.create(paymentData);
      const payment = paymentResponse.data;

      // Redirect to payment
      if (payment.confirmation_url) {
        window.location.href = payment.confirmation_url;
      } else {
        alert('Error creating payment');
      }
    } catch (err) {
      console.error('Error creating order/payment:', err);
      alert('Error processing order. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading courses..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center p-6">
          <div className="text-4xl mb-4">😔</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-3">
            <button
              onClick={loadProducts}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <div className="text-sm text-gray-500">
              Selected type: {courseType === 'regular' ? 'Courses' : 'Intensives'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Synthwave Animated Background */}
      <div className="fixed inset-0" style={{ zIndex: -1 }}>
        <AnimatedBackground variant="neural" />
      </div>

      {/* Enhanced AI Education Hero */}
      <div className="relative overflow-hidden min-h-[40vh] flex items-center">
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-slate-600/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-cyan-500/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative text-white p-8 w-full">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-2xl animate-float">
                  <span className="text-4xl">🧠</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-sm">⚡</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="inline-block bg-gradient-to-r from-blue-500/20 to-slate-600/20 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-500/30 mb-4">
                <span className="text-emerald-300 text-sm font-semibold uppercase tracking-wider">AI for Language Teachers</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Next Generation Courses
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Learn AI tools that revolutionize language teaching and make your lessons unforgettable
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-lg">📈</span>
                </div>
                <div className="text-sm text-blue-200">300% efficiency increase</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-slate-700 rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-lg">🎯</span>
                </div>
                <div className="text-sm text-blue-200">Personalization for each student</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-lg">⚡</span>
                </div>
                <div className="text-sm text-blue-200">Automation of routine tasks</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>
      {/* AI Stats Section - Compact */}
      <div className="px-6 -mt-8 relative z-10 mb-16">
        <div className="grid grid-cols-4 gap-3 max-w-3xl mx-auto">
          <div className="bg-white/15 backdrop-blur-md rounded-lg p-3 text-center border border-white/20 shadow-lg hover:bg-white/25 transition-all duration-300">
            <div className="text-xl font-bold text-white">{courseData.stats.students}</div>
            <div className="text-xs text-blue-200 uppercase tracking-wide">Teachers</div>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-lg p-3 text-center border border-white/20 shadow-lg hover:bg-white/25 transition-all duration-300">
            <div className="text-xl font-bold text-white">{courseData.stats.aiTools}</div>
            <div className="text-xs text-blue-200 uppercase tracking-wide">AI Tools</div>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-lg p-3 text-center border border-white/20 shadow-lg hover:bg-white/25 transition-all duration-300">
            <div className="text-xl font-bold text-white">{courseData.stats.satisfaction}</div>
            <div className="text-xs text-blue-200 uppercase tracking-wide">Satisfied</div>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-lg p-3 text-center border border-white/20 shadow-lg hover:bg-white/25 transition-all duration-300">
            <div className="text-xl font-bold text-white">{courseData.stats.support}</div>
            <div className="text-xs text-blue-200 uppercase tracking-wide">Support</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Course Type Selector */}
        <ErrorBoundary>
          <CourseTypeSelector
            selectedType={courseType}
            onTypeChange={handleTypeChange}
          />
        </ErrorBoundary>

        {/* Featured Intensive Section - only show for intensive courses */}
        {courseType === 'intensive' && (
          <div className="mb-12 animate-fadeInUp">
            <div className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-slate-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.1%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

              {/* Floating Elements */}
              <div className="absolute inset-0">
                <div className="absolute top-8 right-8 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-8 left-8 w-16 h-16 bg-cyan-400/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-slate-400/20 rounded-full blur-md animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>

              <div className="relative p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-block bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold px-4 py-2 rounded-full text-sm uppercase tracking-wider mb-4">
                    🔥 Special offer
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {courseData.intensive.title}
                  </h2>
                  <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed mb-4">
                    {courseData.intensive.subtitle}
                  </p>
                  <div className="mt-4 bg-gradient-to-r from-blue-400/20 to-slate-500/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30">
                    <p className="text-yellow-100 font-semibold">
                      <span className="text-yellow-400 text-xl mr-2">⚡</span>
                      {courseData.intensive.description}
                    </p>
                  </div>
                </div>

                {/* Instructor Section */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                  <h3 className="text-white font-bold text-xl mb-4 text-center">
                    My name is {courseData.intensive.instructor.name}
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courseData.intensive.instructor.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-yellow-400 mr-3 mt-1 font-bold">{index + 1}</span>
                        <span className="text-blue-100 text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                  <h3 className="text-white font-bold text-xl mb-4 text-center">
                    What will you get from the intensive?
                  </h3>
                  <ul className="space-y-3">
                    {courseData.intensive.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-400 mr-3 mt-1">✓</span>
                        <span className="text-blue-100 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Program */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                  <h3 className="text-white font-bold text-xl mb-6 text-center">
                    Intensive program:
                  </h3>
                  <IntensiveProgramSection program={courseData.intensive.program} />
                </div>

                {/* Benefits */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                  <div className="text-center mb-6">
                    <p className="text-white font-bold text-lg">
                      Neural networks are the future of education, which is already here. Become a teacher of the future who is 1000 steps ahead of your colleagues, just as my students have already done
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {courseData.intensive.benefits.map((benefit, index) => (
                      <div key={index} className="text-center">
                        <div className="text-3xl mb-2">{benefit.icon}</div>
                        <h4 className="text-white font-bold mb-2">{benefit.title}</h4>
                        <p className="text-blue-100 text-sm">{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonials */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                  <h3 className="text-white font-bold text-lg mb-4 text-center">Reviews from my students</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courseData.intensive.testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-sm">⭐</span>
                          ))}
                        </div>
                        <p className="text-blue-100 italic text-sm mb-2 line-clamp-4">
                          "{testimonial.text.substring(0, 150)}..."
                        </p>
                        <p className="text-white font-semibold text-xs">{testimonial.author}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-4">
                    <button className="bg-white/20 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300">
                      All reviews and student work
                    </button>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-white font-bold text-xl mb-6 text-center">Pricing Plans</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Loner Plan */}
                    <div className="bg-white/5 rounded-xl p-6">
                      <div className="text-center mb-4">
                        <h4 className="text-white font-bold text-lg mb-2">{courseData.intensive.pricing.loner.name}</h4>
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <span className="text-lg text-gray-300 line-through">{courseData.intensive.pricing.loner.originalPrice}$</span>
                          <span className="text-2xl font-bold text-white">{courseData.intensive.pricing.loner.currentPrice}$</span>
                        </div>
                      </div>
                      <ul className="space-y-2 mb-4">
                        {courseData.intensive.pricing.loner.features.map((feature, index) => (
                          <li key={index} className="text-blue-100 text-sm flex items-start">
                            <span className={`mr-2 ${feature.includes('❌') ? 'text-red-400' : 'text-green-400'}`}>•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-4 rounded-lg hover:scale-105 transition-all duration-300">
                        Buy
                      </button>
                    </div>

                    {/* Guide Plan */}
                    <div className="bg-gradient-to-br from-blue-500/20 to-slate-600/20 rounded-xl p-6 border-2 border-blue-400/50">
                      <div className="text-center mb-4">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">
                          POPULAR
                        </div>
                        <h4 className="text-white font-bold text-lg mb-2">{courseData.intensive.pricing.guide.name}</h4>
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <span className="text-lg text-gray-300 line-through">{courseData.intensive.pricing.guide.originalPrice}$</span>
                          <span className="text-2xl font-bold text-white">{courseData.intensive.pricing.guide.currentPrice}$</span>
                        </div>
                      </div>
                      <ul className="space-y-2 mb-4">
                        {courseData.intensive.pricing.guide.features.map((feature, index) => (
                          <li key={index} className="text-blue-100 text-sm flex items-start">
                            <span className="text-green-400 mr-2">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-2 px-4 rounded-lg hover:scale-105 transition-all duration-300">
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Course Content - Collapsible Sections */}
        {courseType === 'regular' && (
          <div className="space-y-8">
            {/* Course Overview - Always Visible */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                🧠 Neural Networks Course for Language Teachers
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div className="p-3">
                  <div className="text-2xl mb-2">🤖</div>
                  <div className="text-sm text-blue-200">AI Tools</div>
                </div>
                <div className="p-3">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm text-blue-200">Practice</div>
                </div>
                <div className="p-3">
                  <div className="text-2xl mb-2">✨</div>
                  <div className="text-sm text-blue-200">Lessons</div>
                </div>
                <div className="p-3">
                  <div className="text-2xl mb-2">🤝</div>
                  <div className="text-sm text-blue-200">Support</div>
                </div>
                <div className="p-3">
                  <div className="text-2xl mb-2">📚</div>
                  <div className="text-sm text-blue-200">Materials</div>
                </div>
              </div>
            </div>

            {/* Instructor Section - Collapsible */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg overflow-hidden">
              <button
                onClick={() => toggleSection('instructor')}
                className="w-full p-6 text-left hover:bg-white/5 transition-colors duration-200 flex items-center justify-between"
              >
                <h3 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-3">👨‍🏫</span>
                  About the instructor
                </h3>
                <span className={`text-white transform transition-transform duration-200 ${expandedSections.instructor ? 'rotate-180' : ''
                  }`}>
                  ▼
                </span>
              </button>
              {expandedSections.instructor && (
                <div className="px-6 pb-6 border-t border-white/10">
                  <ErrorBoundary>
                    <InstructorSection />
                  </ErrorBoundary>
                </div>
              )}
            </div>

            {/* Learning Modules - Collapsible */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg overflow-hidden">
              <button
                onClick={() => toggleSection('modules')}
                className="w-full p-6 text-left hover:bg-white/5 transition-colors duration-200 flex items-center justify-between"
              >
                <h3 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-3">📚</span>
                  Course program
                </h3>
                <span className={`text-white transform transition-transform duration-200 ${expandedSections.modules ? 'rotate-180' : ''
                  }`}>
                  ▼
                </span>
              </button>
              {expandedSections.modules && (
                <div className="px-6 pb-6 border-t border-white/10">
                  <ErrorBoundary>
                    <LearningModulesSection />
                  </ErrorBoundary>
                </div>
              )}
            </div>

            {/* Benefits - Collapsible */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg overflow-hidden">
              <button
                onClick={() => toggleSection('benefits')}
                className="w-full p-6 text-left hover:bg-white/5 transition-colors duration-200 flex items-center justify-between"
              >
                <h3 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-3">🎯</span>
                  Course benefits
                </h3>
                <span className={`text-white transform transition-transform duration-200 ${expandedSections.benefits ? 'rotate-180' : ''
                  }`}>
                  ▼
                </span>
              </button>
              {expandedSections.benefits && (
                <div className="px-6 pb-6 border-t border-white/10">
                  <ErrorBoundary>
                    <CourseBenefitsSection />
                  </ErrorBoundary>
                </div>
              )}
            </div>

            {/* Testimonials - Collapsible */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg overflow-hidden">
              <button
                onClick={() => toggleSection('testimonials')}
                className="w-full p-6 text-left hover:bg-white/5 transition-colors duration-200 flex items-center justify-between"
              >
                <h3 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-3">💬</span>
                  Student reviews
                </h3>
                <span className={`text-white transform transition-transform duration-200 ${expandedSections.testimonials ? 'rotate-180' : ''
                  }`}>
                  ▼
                </span>
              </button>
              {expandedSections.testimonials && (
                <div className="px-6 pb-6 border-t border-white/10">
                  <ErrorBoundary>
                    <TestimonialsSection />
                  </ErrorBoundary>
                </div>
              )}
            </div>

            {/* Pricing - Collapsible */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg overflow-hidden">
              <button
                onClick={() => toggleSection('pricing')}
                className="w-full p-6 text-left hover:bg-white/5 transition-colors duration-200 flex items-center justify-between"
              >
                <h3 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-3">💰</span>
                  Pricing plans
                </h3>
                <span className={`text-white transform transition-transform duration-200 ${expandedSections.pricing ? 'rotate-180' : ''
                  }`}>
                  ▼
                </span>
              </button>
              {expandedSections.pricing && (
                <div className="px-6 pb-6 border-t border-white/10">
                  <ErrorBoundary>
                    <PricingSection />
                  </ErrorBoundary>
                </div>
              )}
            </div>

            {/* Reviews and Videos - Collapsible */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg overflow-hidden">
              <button
                onClick={() => toggleSection('reviews')}
                className="w-full p-6 text-left hover:bg-white/5 transition-colors duration-200 flex items-center justify-between"
              >
                <h3 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-3">⭐</span>
                  Reviews and videos
                </h3>
                <span className={`text-white transform transition-transform duration-200 ${expandedSections.reviews ? 'rotate-180' : ''
                  }`}>
                  ▼
                </span>
              </button>
              {expandedSections.reviews && (
                <div className="px-6 pb-6 border-t border-white/10">
                  <div className="space-y-6">
                    {/* Video Reviews */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">📹 Video Reviews</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Video 1 */}
                        <div className="bg-white/5 rounded-lg p-4 text-center">
                          <video
                            controls
                            className="w-full rounded-lg"
                          >
                            <source src="/videos/course/IMG_2078.MOV" type="video/mp4" />
                            Your browser does not support video
                          </video>
                        </div>
                        {/* Video 2 */}
                        <div className="bg-white/5 rounded-lg p-4 text-center">
                          <video
                            controls
                            className="w-full rounded-lg"
                          >
                            <source src="/videos/course/IMG_2114.MOV" type="video/mp4" />
                            Your browser does not support video
                          </video>
                        </div>
                        {/* Video 3 */}
                        <div className="bg-white/5 rounded-lg p-4 text-center">
                          <video
                            controls
                            className="w-full rounded-lg"
                          >
                            <source src="/videos/course/IMG_2162.MOV" type="video/mp4" />
                            Your browser does not support video
                          </video>
                        </div>
                      </div>
                    </div>

                    {/* Image Reviews */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">💬 Student Reviews</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Review images */}
                        {[
                          'image (17).png',
                          'image (18).png',
                          'image (19).png',
                          'image (21).png',
                          'image (22).png',
                          'image (30).png',
                          'image (31).png',
                          'Remove-bg.ai_1716661621241 (1).png'
                        ].map((filename, index) => (
                          <div key={index} className="bg-white/5 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg">
                            <img
                              src={`/images/revs/course/${filename}`}
                              alt={`Review ${index + 1}`}
                              className="w-full h-auto"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<div class="p-4 text-center text-white/50">Image not found</div>';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* FAQ - Collapsible */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg overflow-hidden">
              <button
                onClick={() => toggleSection('faq')}
                className="w-full p-6 text-left hover:bg-white/5 transition-colors duration-200 flex items-center justify-between"
              >
                <h3 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-3">❓</span>
                  Frequently asked questions
                </h3>
                <span className={`text-white transform transition-transform duration-200 ${expandedSections.faq ? 'rotate-180' : ''
                  }`}>
                  ▼
                </span>
              </button>
              {expandedSections.faq && (
                <div className="px-6 pb-6 border-t border-white/10">
                  <ErrorBoundary>
                    <FAQSection />
                  </ErrorBoundary>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products - only show when course type is selected */}
        {courseType ? (
          <ErrorBoundary>
            {filteredProducts.length === 0 ? (
              null
            ) : (
              <div className="space-y-8 transition-all duration-300 animate-fadeInUp">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard
                      product={product}
                      onBuyClick={handleBuyClick}
                    />
                  </div>
                ))}
              </div>
            )}
          </ErrorBoundary>
        ) : (
          // Initial state - show call to action to select course type
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 text-center py-12 px-6">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-700 rounded-3xl mx-auto mb-6 flex items-center justify-center animate-float">
                <span className="text-4xl text-white">🎯</span>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
                Choose Your Learning Format
              </h2>
              <p className="text-gray-600 text-base mb-6">
                Select the course type above to see available programs
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-blue-600 mb-1">📚 Courses</div>
                    <div className="text-gray-600">Complete learning</div>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-600 mb-1">🚀 Intensives</div>
                    <div className="text-gray-600">Fast-track learning</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Info - Compact */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <span className="mr-2">💡</span>
              What Awaits You?
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-blue-200">
                <span className="text-cyan-400 mr-2">✓</span>
                Practical assignments
              </li>
              <li className="flex items-center text-blue-200">
                <span className="text-cyan-400 mr-2">✓</span>
                Expert feedback
              </li>
              <li className="flex items-center text-blue-200">
                <span className="text-cyan-400 mr-2">✓</span>
                Private community
              </li>
              <li className="flex items-center text-blue-200">
                <span className="text-cyan-400 mr-2">✓</span>
                Certificate
              </li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <span className="mr-2">🤝</span>
              Support
            </h3>
            <p className="text-blue-200 text-sm mb-4">
              Have questions? We're always ready to help!
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="bg-gradient-to-r from-blue-600 to-blue-800 py-2 px-4 text-white text-sm font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
