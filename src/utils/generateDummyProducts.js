import { categories } from "./adminProductCategories";
import axios from "axios";

// Furniture brands
const furnitureBrands = [
  "Acme Furniture", "Ashley HomeStore", "Bernhardt", "Crate & Barrel", 
  "Ethan Allen", "Flexsteel", "Herman Miller", "IKEA", "La-Z-Boy", 
  "Restoration Hardware", "West Elm", "Pottery Barn"
];

// Descriptions
const descriptionsStart = [
  "Elegantly crafted", "Beautifully designed", "Meticulously constructed", 
  "Expertly built", "Premium quality", "Contemporary styled", "Classic design"
];

const descriptionsMiddle = [
  "featuring sustainable materials", "with durable construction", 
  "with attention to detail", "showcasing exceptional craftsmanship"
];

const descriptionsEnd = [
  "Perfect for any home décor.", "Ideal for modern living spaces.", 
  "Brings warmth to any room.", "A statement piece for your home."
];

// Helper functions
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomPrice = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) * 1000;
const getRandomDescription = () => {
  return `${getRandomElement(descriptionsStart)} ${getRandomElement(descriptionsMiddle)}. ${getRandomElement(descriptionsEnd)}`;
};

// Function to fetch random furniture images from Pexels
const fetchFurnitureImages = async (count) => {
  // Your Pexels API key - register at https://www.pexels.com/api/ 
  const PEXELS_API_KEY = 'IH6WsmdRVw6Pp7cgLhISZzrHlNhbWIMa9LLTVfsG23j0NLvV94dXctv7'; 
  
  // Map categories to search terms for better image matching
  const categorySearchTerms = {
    "Sofas & Couches": "sofa",
    "Sectionals": "sectional sofa",
    "Accent Chairs": "accent chair",
    "Coffee Tables": "coffee table",
    "TV Stands": "tv stand",
    "Beds & Headboards": "bed",
    "Dining Tables": "dining table",
    "Dining Chairs": "dining chair",
    "Desks": "desk",
    "Office Chairs": "office chair",
    "Bookcases & Shelving": "bookcase"
    // Add more mappings as needed
  };
  
  // Get all search terms or use defaults
  const searchTerms = Object.values(categorySearchTerms).length > 0 
    ? Object.values(categorySearchTerms) 
    : ['furniture', 'sofa', 'chair', 'table', 'bed', 'desk'];
  
  try {
    // Get a random search term for variety
    const searchTerm = getRandomElement(searchTerms);
    
    // Make API request to Pexels
    const response = await axios.get(
      `https://api.pexels.com/v1/search?query=${searchTerm}&per_page=80&orientation=landscape`,
      {
        headers: {
          Authorization: PEXELS_API_KEY
        }
      }
    );
    
    // Extract image URLs from response
    const photos = response.data.photos;
    
    // Return random selections from the results
    return photos.map(photo => photo.src.large);
    
  } catch (error) {
    console.error("Error fetching images:", error);
    // Fallback to placeholder if API fails
    return Array(count).fill("https://via.placeholder.com/800x600?text=Furniture");
  }
};

// Main function to generate dummy products
export const generateDummyProducts = async (count = 10) => {
  const dummyProducts = [];
  
  // Fetch random furniture images
  const imageUrls = await fetchFurnitureImages(count);
  
  for (let i = 0; i < count; i++) {
    const category = getRandomElement(categories);
    const productName = `${getRandomElement(["Premium", "Luxury", "Designer", "Classic"])} ${category.name}`;
    
    dummyProducts.push({
      name: productName,
      imageURL: imageUrls[i % imageUrls.length], // Use modulo in case we get fewer images than requested
      price: getRandomPrice(1, 50),
      category: category.name,
      brand: getRandomElement(furnitureBrands),
      description: getRandomDescription()
    });
  }
  
  return dummyProducts;
}; 