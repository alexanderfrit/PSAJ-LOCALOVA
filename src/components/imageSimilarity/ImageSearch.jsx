import React, { useState, useRef, useCallback, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { RiUpload2Line, RiCloseLine, RiShoppingBag3Line, RiEyeLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slice/cartSlice";
import { toast } from "react-toastify";
import { toastConfig } from "../../utils/toastConfig";

const ImageSearch = ({ products }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [searchMetrics, setSearchMetrics] = useState(null);
  const [showMetrics, setShowMetrics] = useState(false);
  const fileInputRef = useRef(null);
  const modelRef = useRef(null);
  const dispatch = useDispatch();

  // Load MobileNet v3 model
  const loadModel = async () => {
    if (!modelRef.current) {
      setModelLoading(true);
      try {
        // Use MobileNet V3 instead of V1
        modelRef.current = await tf.loadGraphModel(
          'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1',
          { fromTFHub: true }
        );
        console.log('MobileNet V3 model loaded successfully');
      } catch (error) {
        console.error('Error loading model:', error);
        toast.error('Error loading advanced AI model. Please try again.', toastConfig.error);
        
        // Fallback to MobileNet V1 if V3 fails
        try {
          console.log('Attempting fallback to MobileNet V1...');
          modelRef.current = await tf.loadLayersModel(
            'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
          );
          console.log('Fallback model loaded successfully');
        } catch (fallbackError) {
          console.error('Error loading fallback model:', fallbackError);
        }
      } finally {
        setModelLoading(false);
      }
    }
    return modelRef.current;
  };

  // Extract features from an image - updated for MobileNet V3
  const extractFeatures = async (img) => {
    const model = await loadModel();
    if (!model) return null;

    try {
      // MobileNet V3 expects normalized inputs from -1 to 1
      const tensor = tf.tidy(() => {
        const imgTensor = tf.browser.fromPixels(img);
        const resized = tf.image.resizeBilinear(imgTensor, [224, 224]);
        // MobileNet V3 normalization: (pixel - 127.5) / 127.5
        const normalized = resized.toFloat().div(tf.scalar(127.5)).sub(tf.scalar(1));
        return normalized.expandDims(0);
      });

      // Get feature vector
      const features = model.predict(tensor);
      const featureArray = await features.data();
      
      tensor.dispose();
      features.dispose();
      
      return Array.from(featureArray);
    } catch (error) {
      console.error('Error extracting features:', error);
      return null;
    }
  };

  // Improved cosine similarity calculation with outlier handling
  const cosineSimilarity = (a, b) => {
    if (!a || !b || a.length !== b.length) return 0;
    
    // Skip abnormally low values (potential artifacts)
    const threshold = 1e-6;
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    
    for (let i = 0; i < a.length; i++) {
      if (Math.abs(a[i]) > threshold && Math.abs(b[i]) > threshold) {
        dotProduct += a[i] * b[i];
        magnitudeA += a[i] * a[i];
        magnitudeB += b[i] * b[i];
      }
    }
    
    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  };

  // Proxy image handling for CORS issues
  const proxyImage = async (url) => {
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error proxying image:', error);
      // Attempt direct access as fallback
      try {
        const directResponse = await fetch(url, { mode: 'no-cors' });
        const blob = await directResponse.blob();
        return URL.createObjectURL(blob);
      } catch (directError) {
        console.error('Direct image access failed:', directError);
        return null;
      }
    }
  };

  // Enhanced similarity function upgraded for MobileNet V3
  const enhancedSimilarity = (featuresA, featuresB, category) => {
    // MobileNet V3 has better feature representation in different feature map regions
    // Extract different parts of the feature vector based on furniture characteristics
    
    // Full feature similarity (overall shape and context)
    const baseSimilarity = cosineSimilarity(featuresA, featuresB);
    
    // Middle features (texture, pattern, material)
    const midStart = Math.floor(featuresA.length * 0.3);
    const midEnd = Math.floor(featuresA.length * 0.7);
    const midFeaturesA = featuresA.slice(midStart, midEnd);
    const midFeaturesB = featuresB.slice(midStart, midEnd);
    const midSimilarity = cosineSimilarity(midFeaturesA, midFeaturesB);
    
    // Early features (edges, basic structures)
    const earlyFeaturesA = featuresA.slice(0, Math.floor(featuresA.length * 0.25));
    const earlyFeaturesB = featuresB.slice(0, Math.floor(featuresB.length * 0.25));
    const earlySimilarity = cosineSimilarity(earlyFeaturesA, earlyFeaturesB);
    
    // Late features (high-level concepts)
    const lateFeaturesA = featuresA.slice(Math.floor(featuresA.length * 0.75));
    const lateFeaturesB = featuresB.slice(Math.floor(featuresB.length * 0.75));
    const lateSimilarity = cosineSimilarity(lateFeaturesA, lateFeaturesB);
    
    // Weight the similarities based on importance for furniture
    // Texture and materials (mid features) are most important for furniture
    return (
      baseSimilarity * 0.2 +  // Overall shape: 20%
      midSimilarity * 0.5 +   // Texture/material: 50%
      earlySimilarity * 0.1 + // Basic structure: 10%
      lateSimilarity * 0.2    // High-level concepts: 20%
    );
  };

  // Update handleImageUpload
  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setSimilarProducts([]);
    setSearchMetrics(null);
    setSelectedImage(URL.createObjectURL(file));

    const startTime = performance.now();
    let processedProductCount = 0;

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = URL.createObjectURL(file);
      await img.decode();

      const uploadedFeatures = await extractFeatures(img);
      if (!uploadedFeatures) {
        throw new Error('Failed to extract features from uploaded image');
      }

      // Batch process images for better performance
      const batchSize = 10;
      const similarityResults = [];
      
      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        
        // Process batch in parallel
        const batchResults = await Promise.all(
          batch.map(async (product) => {
            try {
              // Try to use the product image directly first
              let productImg = new Image();
              productImg.crossOrigin = 'anonymous';
              
              try {
                productImg.src = product.imageURL;
                await Promise.race([
                  productImg.decode(),
                  new Promise((_, reject) => setTimeout(() => reject(new Error('Image load timeout')), 3000))
                ]);
              } catch (directLoadError) {
                // If direct loading fails, try proxy
                const proxiedUrl = await proxyImage(product.imageURL);
                if (!proxiedUrl) return { product, similarity: 0 };
                
                productImg = new Image();
                productImg.crossOrigin = 'anonymous';
                productImg.src = proxiedUrl;
                await productImg.decode();
                URL.revokeObjectURL(proxiedUrl); // Clean up
              }

              const productFeatures = await extractFeatures(productImg);
              if (!productFeatures) return { product, similarity: 0 };

              const similarity = enhancedSimilarity(uploadedFeatures, productFeatures, product.category);
              processedProductCount++;
              
              return { product, similarity };
            } catch (error) {
              console.error(`Error processing product ${product.id}:`, error);
              return { product, similarity: 0 };
            }
          })
        );
        
        similarityResults.push(...batchResults);
      }

      // Use improved threshold based on distribution with outlier removal
      const validSimilarities = similarityResults
        .map(item => item.similarity)
        .filter(sim => sim > 0.1); // Filter out obvious non-matches
      
      // If no valid similarities found
      if (validSimilarities.length === 0) {
        setSimilarProducts([]);
        setSearchMetrics({
          searchTime: ((performance.now() - startTime) / 1000).toFixed(2),
          resultsCount: 0,
          productsProcessed: processedProductCount,
          averageSimilarity: 0,
          adaptiveThreshold: 0.2,
          categoryCoverage: 0
        });
        toast.info('No similar products found. Try a different image.', toastConfig.info);
        setIsLoading(false);
        return;
      }
      
      // Calculate statistics
      const meanSimilarity = validSimilarities.reduce((a, b) => a + b, 0) / validSimilarities.length;
      const stdDev = Math.sqrt(
        validSimilarities.reduce((sq, n) => sq + Math.pow(n - meanSimilarity, 2), 0) / validSimilarities.length
      );
      
      // Adaptive threshold with minimum quality floor
      const adaptiveThreshold = Math.max(0.2, meanSimilarity + (0.3 * stdDev));

      const topSimilar = similarityResults
        .filter(item => item.similarity > adaptiveThreshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 8)
        .map(item => ({
          ...item.product,
          similarityScore: (item.similarity * 100).toFixed(1) // Add the score for display
        }));

      setSimilarProducts(topSimilar);
      
      // Calculate metrics
      const endTime = performance.now();
      const metrics = {
        searchTime: ((endTime - startTime) / 1000).toFixed(2),
        resultsCount: topSimilar.length,
        productsProcessed: processedProductCount,
        averageSimilarity: topSimilar.length > 0 
          ? (similarityResults
              .filter(s => topSimilar.some(p => p.id === s.product.id))
              .reduce((sum, item) => sum + item.similarity, 0) / topSimilar.length).toFixed(3)
          : 0,
        adaptiveThreshold: adaptiveThreshold.toFixed(3),
        modelVersion: 'MobileNet V3 Small',
        categoryCoverage: calculateCategoryCoverage(topSimilar),
      };
      
      setSearchMetrics(metrics);
      
      if (topSimilar.length === 0) {
        toast.info('No similar products found. Try a different image.', toastConfig.info);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Error processing image. Please try again.', toastConfig.error);
    } finally {
      setIsLoading(false);
    }
  }, [products]);

  // Calculate category coverage (diversity metric)
  const calculateCategoryCoverage = (products) => {
    const categories = new Set();
    products.forEach(product => {
      if (product.category) categories.add(product.category);
    });
    return categories.size;
  };

  const add2CartFunction = (product) => {
    dispatch(addToCart(product));
    toast.success("Added to cart", toastConfig.success);
  };

  // Add a function to handle image removal
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setSimilarProducts([]);
    setSearchMetrics(null);
    
    // Reset the file input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20"
    >
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-serif text-neutral">
            Advanced Visual Product Search
          </h1>
          <p className="text-neutral/60 text-lg">
            Discover similar products from our luxury collection using our enhanced AI-powered image matching
          </p>
        </div>

        {/* Upload Section */}
        <div className="max-w-2xl mx-auto">
          <div className="relative bg-white border-2 border-dashed border-base-300 p-12">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            {selectedImage ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative"
              >
                <img
                  src={selectedImage}
                  alt="Uploaded"
                  className="max-h-80 mx-auto object-contain"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-4 -right-4 p-2 bg-primary text-white hover:bg-primary-focus transition-colors"
                >
                  <RiCloseLine className="w-5 h-5" />
                </button>
              </motion.div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto border-2 border-primary/20 flex items-center justify-center">
                  <RiUpload2Line className="w-8 h-8 text-primary/40" />
                </div>
                <div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white hover:bg-primary-focus transition-colors"
                  >
                    <RiUpload2Line className="w-5 h-5" />
                    Select Image
                  </button>
                </div>
                <p className="text-sm text-neutral/40">
                  Supported formats: JPG, PNG, WEBP
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Results Section */}
        <AnimatePresence mode="wait">
          {(isLoading || modelLoading) ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16"
            >
              {/* Luxury Loading Experience */}
              <div className="relative max-w-2xl mx-auto">
                {/* Decorative border frame */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 border border-primary/20"
                />
                
                {/* Content area with marble-inspired background */}
                <div className="relative py-16 px-8 sm:px-12 bg-gradient-to-b from-white to-base-100">
                  {/* Luxury brand-inspired logo animation */}
                  <div className="flex justify-center mb-10">
                    <div className="relative">
                      {/* Animated circle */}
                      <motion.div
                        animate={{ 
                          scale: [1, 1.05, 1],
                          opacity: [0.5, 0.8, 0.5] 
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut" 
                        }}
                        className="absolute -inset-5 rounded-full bg-primary/5"
                      />
                      
                      {/* Second animated circle */}
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          opacity: [0.3, 0.6, 0.3] 
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.5
                        }}
                        className="absolute -inset-10 rounded-full bg-primary/3"
                      />
                      
                      {/* Central emblem */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative w-20 h-20 bg-white border border-primary/30 flex items-center justify-center z-10"
                      >
                        <div className="w-12 h-12 border border-primary/20 flex items-center justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-t border-r border-primary/40"
                          />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Elegant typography */}
                  <div className="text-center space-y-6">
                    <motion.h3 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="font-serif text-2xl text-neutral tracking-wide"
                    >
                      {modelLoading ? 'Preparing Analysis' : 'Analyzing Your Selection'}
                    </motion.h3>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="flex flex-col items-center gap-6"
                    >
                      <p className="text-neutral/60 font-light max-w-md mx-auto leading-relaxed">
                        {modelLoading 
                          ? 'Initializing our advanced visual recognition system to deliver precise results.' 
                          : 'Identifying aesthetic elements, textures, and design principles to find matching pieces.'}
                      </p>
                      
                      {/* Elegant progress indicator */}
                      <div className="w-full max-w-xs mt-4">
                        <div className="h-px w-full bg-primary/10 relative overflow-hidden">
                          <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ 
                              x: ['-100%', '100%', '-100%']
                            }}
                            transition={{ 
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                          />
                          <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ 
                              x: ['0%', '200%', '0%']
                            }}
                            transition={{ 
                              duration: 3.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.3
                            }}
                            className="absolute top-0 left-0 h-full w-1/4 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Luxury details - subtle animated dots */}
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          opacity: [0.3, 1, 0.3],
                          scale: [0.8, 1, 0.8]
                        }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.4,
                          ease: "easeInOut"
                        }}
                        className="w-1.5 h-1.5 bg-primary/40"
                      />
                    ))}
                  </div>
                </div>
                
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/40" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/40" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/40" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/40" />
              </div>
            </motion.div>
          ) : similarProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-2xl font-serif text-neutral inline-block border-b-2 border-primary/20 pb-2">
                  Similar Products
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                {similarProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group bg-white"
                  >
                    <Link 
                      to={`/product-details/${product.id}`} 
                      className="block relative overflow-hidden"
                    >
                      <div className="aspect-[3/4] bg-base-200/50">
                        <LazyLoadImage
                          src={product.imageURL}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          effect="blur"
                        />
                        
                        {/* Similarity score badge */}
                        {product.similarityScore && (
                          <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 text-xs">
                            {product.similarityScore}% match
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-6 space-y-4 border border-t-0 border-base-300 group-hover:border-primary/20 transition-colors">
                      <div>
                        <h3 className="font-serif text-lg text-neutral group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-primary font-medium mt-2">
                          {formatPrice(product.price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => add2CartFunction(product)}
                          className="flex-1 py-3 px-4 bg-primary text-white hover:bg-primary-focus transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                        >
                          <RiShoppingBag3Line className="w-4 h-4" />
                          Add to Cart
                        </button>
                        <Link
                          to={`/product-details/${product.id}`}
                          className="p-3 border border-base-300 hover:border-primary hover:text-primary transition-colors"
                        >
                          <RiEyeLine className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Metrics Panel */}
        {searchMetrics && similarProducts.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-neutral font-medium">Search Quality Metrics</h3>
              <button 
                onClick={() => setShowMetrics(!showMetrics)}
                className="text-primary text-sm"
              >
                {showMetrics ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            
            {showMetrics && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white border border-base-300 p-4 text-sm"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-neutral/60">Search Time</p>
                    <p className="font-medium">{searchMetrics.searchTime}s</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-neutral/60">Results Found</p>
                    <p className="font-medium">{searchMetrics.resultsCount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-neutral/60">Average Similarity</p>
                    <p className="font-medium">{searchMetrics.averageSimilarity}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-neutral/60">Category Coverage</p>
                    <p className="font-medium">{searchMetrics.categoryCoverage}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-neutral/60">Adaptive Threshold</p>
                    <p className="font-medium">{searchMetrics.adaptiveThreshold}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-neutral/60">AI Model</p>
                    <p className="font-medium">{searchMetrics.modelVersion}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ImageSearch; 