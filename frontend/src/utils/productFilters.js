/**
 * Product filtering utilities for course types
 */

// Product type mappings
export const PRODUCT_TYPE_MAPPINGS = {
  regular: 'course',
  intensive: 'intensive'
};

/**
 * Filter products by course type
 * @param {Array} products - Array of product objects
 * @param {string} courseType - Course type ('regular' | 'intensive')
 * @returns {Array} Filtered array of products
 */
export const filterProductsByType = (products, courseType) => {
  if (!Array.isArray(products)) {
    console.warn('Products is not an array:', products);
    return [];
  }

  if (!courseType) {
    console.warn('Course type is not provided');
    return products;
  }

  const productType = PRODUCT_TYPE_MAPPINGS[courseType];
  
  if (!productType) {
    console.warn('Invalid course type:', courseType);
    return [];
  }

  try {
    return products.filter(product => {
      if (!product || typeof product !== 'object') {
        console.warn('Invalid product object:', product);
        return false;
      }

      return product.type === productType;
    });
  } catch (error) {
    console.error('Error filtering products:', error);
    return [];
  }
};

/**
 * Get product count by type
 * @param {Array} products - Array of product objects
 * @param {string} courseType - Course type ('regular' | 'intensive')
 * @returns {number} Number of products of the specified type
 */
export const getProductCountByType = (products, courseType) => {
  const filteredProducts = filterProductsByType(products, courseType);
  return filteredProducts.length;
};

/**
 * Get all product types available in the products array
 * @param {Array} products - Array of product objects
 * @returns {Array} Array of unique product types
 */
export const getAvailableProductTypes = (products) => {
  if (!Array.isArray(products)) {
    return [];
  }

  try {
    const types = products
      .filter(product => product && product.type)
      .map(product => product.type);
    
    return [...new Set(types)];
  } catch (error) {
    console.error('Error getting available product types:', error);
    return [];
  }
};

/**
 * Check if products are available for a specific course type
 * @param {Array} products - Array of product objects
 * @param {string} courseType - Course type ('regular' | 'intensive')
 * @returns {boolean} True if products are available, false otherwise
 */
export const hasProductsForType = (products, courseType) => {
  return getProductCountByType(products, courseType) > 0;
};

/**
 * Get products statistics by type
 * @param {Array} products - Array of product objects
 * @returns {Object} Statistics object with counts for each type
 */
export const getProductsStatistics = (products) => {
  if (!Array.isArray(products)) {
    return {
      regular: 0,
      intensive: 0,
      total: 0
    };
  }

  try {
    const stats = {
      regular: getProductCountByType(products, 'regular'),
      intensive: getProductCountByType(products, 'intensive'),
      total: products.length
    };

    return stats;
  } catch (error) {
    console.error('Error calculating products statistics:', error);
    return {
      regular: 0,
      intensive: 0,
      total: 0
    };
  }
};

/**
 * Sort products by creation date (newest first)
 * @param {Array} products - Array of product objects
 * @returns {Array} Sorted array of products
 */
export const sortProductsByDate = (products) => {
  if (!Array.isArray(products)) {
    return [];
  }

  try {
    return [...products].sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA; // Newest first
    });
  } catch (error) {
    console.error('Error sorting products by date:', error);
    return products;
  }
};

/**
 * Filter and sort products by type
 * @param {Array} products - Array of product objects
 * @param {string} courseType - Course type ('regular' | 'intensive')
 * @param {boolean} sortByDate - Whether to sort by creation date
 * @returns {Array} Filtered and optionally sorted array of products
 */
export const filterAndSortProducts = (products, courseType, sortByDate = true) => {
  let filteredProducts = filterProductsByType(products, courseType);
  
  if (sortByDate) {
    filteredProducts = sortProductsByDate(filteredProducts);
  }
  
  return filteredProducts;
};