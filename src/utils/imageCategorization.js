import { categories } from './adminProductCategories';

// Imagga API configuration for Vite
const IMAGGA_API_KEY = import.meta.env.VITE_IMAGGA_API_KEY || "acc_a3ec5296cc10d08"; 
const IMAGGA_API_SECRET = import.meta.env.VITE_IMAGGA_API_SECRET || "073f0e652471247436bd6bc4b5eed119";
const IMAGGA_ENDPOINT = "https://api.imagga.com/v2/tags";

/**
 * Categorize image using Imagga API
 * @param {string} imageUrl - URL of the image to analyze
 * @returns {Promise<Object>} The categorization result
 */
export const categorizeImage = async (imageUrl) => {
  try {
    // Check if this is a base64 image URL (invalid for Imagga API)
    if (imageUrl.startsWith('data:image')) {
      throw new Error("Base64 image data cannot be processed. Please provide a hosted image URL.");
    }
    
    // Call Imagga API
    const tags = await getImageTags(imageUrl);
    
    if (!tags || tags.length === 0) {
      console.log("No tags returned from Imagga API");
      return {
        categoryId: null,
        category: null,
        tags: [],
        confidence: 0
      };
    }
    
    console.log("Imagga tags:", tags);
    
    // Return all tags directly from Imagga
    return {
      tags: tags,
      rawTags: tags,
      // We'll keep these properties for backward compatibility
      categoryId: null,
      category: null
    };
  } catch (error) {
    console.error("Error in image categorization:", error);
    return {
      categoryId: null,
      category: null,
      tags: [],
      error: error.message
    };
  }
};

/**
 * Get tags for an image using Imagga API
 * @param {string} imageUrl - URL of the image to analyze
 * @returns {Promise<Array>} Array of tags with confidence
 */
const getImageTags = async (imageUrl) => {
  try {
    // Validate URL format
    if (!imageUrl.startsWith('http')) {
      throw new Error("Invalid image URL. URL must start with http:// or https://");
    }
    
    // Encode credentials for Basic Auth
    const credentials = btoa(`${IMAGGA_API_KEY}:${IMAGGA_API_SECRET}`);
    
    // Pass the URL to Imagga API
    const response = await fetch(`${IMAGGA_ENDPOINT}?image_url=${encodeURIComponent(imageUrl)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Imagga API error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    
    // Extract tags from response
    if (data && data.result && data.result.tags) {
      // Return tags with confidence > 30%
      return data.result.tags
        .filter(tag => tag.confidence > 30)
        .map(tag => ({
          tag: tag.tag.en,
          confidence: tag.confidence
        }));
    }
    
    return [];
  } catch (error) {
    console.error("Error getting image tags from Imagga:", error);
    throw error;
  }
}; 