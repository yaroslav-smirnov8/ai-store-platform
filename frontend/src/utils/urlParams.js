/**
 * Utility functions for handling URL parameters
 */

// Valid course types
export const VALID_COURSE_TYPES = ['regular', 'intensive'];
export const DEFAULT_COURSE_TYPE = 'intensive';

/**
 * Get course type from URL parameters
 * @returns {string} Course type ('regular' | 'intensive')
 */
export const getCourseTypeFromUrl = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const typeFromUrl = urlParams.get('type');
    
    // Validate and return type or default
    if (VALID_COURSE_TYPES.includes(typeFromUrl)) {
      return typeFromUrl;
    }
    
    return DEFAULT_COURSE_TYPE;
  } catch (error) {
    console.warn('Error reading course type from URL:', error);
    return DEFAULT_COURSE_TYPE;
  }
};

/**
 * Update URL with course type parameter without page reload
 * @param {string} type - Course type ('regular' | 'intensive')
 */
export const updateUrlWithCourseType = (type) => {
  try {
    // Validate type
    if (!VALID_COURSE_TYPES.includes(type)) {
      console.warn('Invalid course type:', type);
      return;
    }

    const url = new URL(window.location);
    
    // Set or update the type parameter
    url.searchParams.set('type', type);
    
    // Update URL without page reload using replaceState
    window.history.replaceState(
      { courseType: type },
      '',
      url.toString()
    );
  } catch (error) {
    console.error('Error updating URL with course type:', error);
  }
};

/**
 * Remove course type parameter from URL
 */
export const removeCourseTypeFromUrl = () => {
  try {
    const url = new URL(window.location);
    url.searchParams.delete('type');
    
    window.history.replaceState(
      {},
      '',
      url.toString()
    );
  } catch (error) {
    console.error('Error removing course type from URL:', error);
  }
};

/**
 * Validate course type parameter
 * @param {string} type - Course type to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidCourseType = (type) => {
  return VALID_COURSE_TYPES.includes(type);
};

/**
 * Get all URL parameters as an object
 * @returns {Object} Object with all URL parameters
 */
export const getAllUrlParams = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    
    for (const [key, value] of urlParams.entries()) {
      params[key] = value;
    }
    
    return params;
  } catch (error) {
    console.error('Error getting URL parameters:', error);
    return {};
  }
};

/**
 * Listen for URL changes (popstate events)
 * @param {Function} callback - Callback function to call when URL changes
 * @returns {Function} Cleanup function to remove event listener
 */
export const listenForUrlChanges = (callback) => {
  const handlePopState = (event) => {
    const courseType = getCourseTypeFromUrl();
    callback(courseType, event);
  };

  window.addEventListener('popstate', handlePopState);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
};