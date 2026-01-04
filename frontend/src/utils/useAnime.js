import { useEffect, useRef } from 'react';

// Custom hook for Anime.js animations
export const useAnime = (animationConfig, dependencies = []) => {
  const elementRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (elementRef.current && window.anime) {
      // Stop previous animation if exists
      if (animationRef.current) {
        animationRef.current.pause();
      }

      // Create new animation
      animationRef.current = window.anime({
        targets: elementRef.current,
        ...animationConfig
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, dependencies);

  return elementRef;
};

// Predefined animation presets for the store
export const storeAnimations = {
  // Card entrance animation
  cardEntrance: {
    translateY: [50, 0],
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 800,
    easing: 'easeOutElastic(1, .8)',
    delay: (el, i) => i * 100
  },

  // Button hover animation
  buttonHover: {
    scale: [1, 1.05],
    duration: 300,
    easing: 'easeOutQuad'
  },

  // Price pulse animation
  pricePulse: {
    scale: [1, 1.1, 1],
    duration: 1000,
    easing: 'easeInOutQuad',
    loop: true
  },

  // Icon bounce animation
  iconBounce: {
    translateY: [0, -10, 0],
    duration: 1500,
    easing: 'easeInOutSine',
    loop: true,
    direction: 'alternate'
  },

  // Slide in from left
  slideInLeft: {
    translateX: [-100, 0],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutCubic',
    delay: (el, i) => i * 150
  },

  // Fade in up with bounce
  fadeInUpBounce: {
    translateY: [30, 0],
    opacity: [0, 1],
    scale: [0.9, 1],
    duration: 700,
    easing: 'easeOutBack',
    delay: (el, i) => i * 100
  },

  // Stagger animation for lists
  staggerFadeIn: {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 500,
    easing: 'easeOutQuart',
    delay: window.anime?.stagger(100)
  },

  // Hero text animation
  heroText: {
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 1000,
    easing: 'easeOutExpo',
    delay: 300
  },

  // Loading spinner
  loadingSpinner: {
    rotate: '1turn',
    duration: 1000,
    easing: 'linear',
    loop: true
  },

  // Success animation
  successPulse: {
    scale: [1, 1.2, 1],
    duration: 600,
    easing: 'easeInOutQuad'
  },

  // SVG path drawing animation
  drawSVG: {
    strokeDashoffset: [window.anime?.setDashoffset, 0],
    duration: 2000,
    easing: 'easeInOutSine'
  },

  // Morphing shapes
  morphShape: {
    d: [
      'M20,20 L50,20 L35,50 Z',
      'M20,20 L80,20 L50,80 Z'
    ],
    duration: 1000,
    easing: 'easeInOutQuart'
  },

  // Shopping cart bounce
  cartBounce: {
    scale: [1, 1.3, 1],
    rotate: [0, 10, -10, 0],
    duration: 500,
    easing: 'easeOutBounce'
  },

  // Price drop effect
  priceDrop: {
    translateY: [-20, 0],
    scale: [0.8, 1.1, 1],
    opacity: [0, 1],
    color: ['#000', '#e74c3c', '#27ae60'],
    duration: 800,
    easing: 'easeOutElastic(1, .8)'
  },

  // Notification popup
  notificationSlide: {
    translateX: [300, 0],
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutBack'
  },

  // Loading wave
  loadingWave: {
    translateX: [-100, 100],
    scale: [0.8, 1.2, 0.8],
    duration: 1500,
    easing: 'easeInOutSine',
    loop: true,
    direction: 'alternate'
  },

  // Magnetic hover effect
  magneticHover: {
    scale: [1, 1.1],
    rotate: [-2, 2],
    duration: 300,
    easing: 'easeOutQuart'
  }
};

// Helper function to animate elements on scroll
export const animateOnScroll = (selector, animation) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && window.anime) {
        window.anime({
          targets: entry.target,
          ...animation
        });
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll(selector).forEach(el => {
    observer.observe(el);
  });

  return observer;
};

// Page transition animations
export const pageTransitions = {
  fadeIn: {
    opacity: [0, 1],
    duration: 500,
    easing: 'easeOutQuart'
  },

  slideFromRight: {
    translateX: [100, 0],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutCubic'
  },

  slideFromLeft: {
    translateX: [-100, 0],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutCubic'
  }
};

// Advanced e-commerce specific animations
export const ecommerceAnimations = {
  // Product image gallery swipe
  imageSwipe: {
    translateX: ['-100%', '0%'],
    scale: [1.1, 1],
    duration: 400,
    easing: 'easeOutCubic'
  },

  // Add to cart celebration
  addToCartCelebration: (target) => {
    const tl = window.anime.timeline();
    tl.add({
      targets: target,
      scale: [1, 1.2, 1],
      rotate: [0, 360],
      duration: 600,
      easing: 'easeOutBack'
    }).add({
      targets: target,
      translateY: [0, -20, 0],
      duration: 400,
      easing: 'easeOutBounce'
    }, '-=200');
    return tl;
  },

  // Star rating animation
  starRating: {
    scale: [0, 1.3, 1],
    rotate: [0, 180, 360],
    duration: 500,
    delay: (el, i) => i * 100,
    easing: 'easeOutElastic(1, .8)'
  },

  // Currency flip animation
  currencyFlip: {
    rotateY: [0, 180, 360],
    scale: [1, 0.8, 1],
    duration: 800,
    easing: 'easeInOutBack'
  },

  // Discount badge pulse
  discountPulse: {
    scale: [1, 1.15, 1],
    rotate: [0, 5, -5, 0],
    duration: 1200,
    easing: 'easeInOutSine',
    loop: true
  },

  // Search results reveal
  searchReveal: {
    height: [0, 'auto'],
    opacity: [0, 1],
    duration: 400,
    easing: 'easeOutQuart'
  },

  // Checkout progress animation
  progressBar: (progress) => ({
    width: `${progress}%`,
    duration: 800,
    easing: 'easeOutQuart'
  })
};

// Interactive animation helpers
export const interactiveHelpers = {
  // Magnetic cursor effect
  magneticCursor: (element, strength = 20) => {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      window.anime({
        targets: element,
        translateX: x / strength,
        translateY: y / strength,
        duration: 300,
        easing: 'easeOutQuart'
      });
    });

    element.addEventListener('mouseleave', () => {
      window.anime({
        targets: element,
        translateX: 0,
        translateY: 0,
        duration: 500,
        easing: 'easeOutElastic(1, .3)'
      });
    });
  },

  // Parallax scroll effect
  parallaxScroll: (selector, speed = 0.5) => {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const elements = document.querySelectorAll(selector);
      
      elements.forEach(el => {
        const rate = scrolled * -speed;
        window.anime({
          targets: el,
          translateY: rate,
          duration: 0
        });
      });
    });
  }
};
