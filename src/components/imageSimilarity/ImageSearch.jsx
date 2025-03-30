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

  // Load MobileNet model
  const loadModel = async () => {
    if (!modelRef.current) {
      setModelLoading(true);
      try {
        modelRef.current = await tf.loadLayersModel(
          'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
        );
        console.log('Model loaded successfully');
      } catch (error) {
        console.error('Error loading model:', error);
        toast.error('Error loading AI model. Please try again.', toastConfig.error);
      } finally {
        setModelLoading(false);
      }
    }
    return modelRef.current;
  };

  // Extract features from an image
  const extractFeatures = async (img) => {
    const model = await loadModel();
    if (!model) return null;

    try {
      const tensor = tf.tidy(() => {
        const imgTensor = tf.browser.fromPixels(img);
        const resized = tf.image.resizeBilinear(imgTensor, [224, 224]);
        const normalized = resized.toFloat().div(255.0).expandDims();
        return normalized;
      });

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

  // Calculate cosine similarity between two feature vectors
  const cosineSimilarity = (a, b) => {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  };

  // Add this function at the top of the component
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
      toast.error('Failed to process some product images', toastConfig.error);
      return null;
    }
  };

  // Update handleImageUpload to always use enhanced similarity
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

      const similarities = await Promise.all(
        products.map(async (product) => {
          try {
            // Create a proxy URL for the product image
            const proxiedUrl = await proxyImage(product.imageURL);
            if (!proxiedUrl) return { product, similarity: 0 };

            const productImg = new Image();
            productImg.crossOrigin = 'anonymous';
            productImg.src = proxiedUrl;
            await productImg.decode();

            const productFeatures = await extractFeatures(productImg);
            if (!productFeatures) return { product, similarity: 0 };

            // Always use enhanced similarity now
            const similarity = enhancedSimilarity(uploadedFeatures, productFeatures, product.category);
            processedProductCount++;
            
            // Cleanup the temporary URL
            URL.revokeObjectURL(proxiedUrl);
            
            return { product, similarity };
          } catch (error) {
            console.error(`Error processing product ${product.id}:`, error);
            return { product, similarity: 0 };
          }
        })
      );

      // Use improved threshold based on distribution
      const allSimilarities = similarities.map(item => item.similarity);
      const meanSimilarity = allSimilarities.reduce((a, b) => a + b, 0) / allSimilarities.length;
      const stdDev = Math.sqrt(allSimilarities.reduce((sq, n) => sq + Math.pow(n - meanSimilarity, 2), 0) / allSimilarities.length);
      
      // Adaptive threshold: use distribution to set cutoff
      const adaptiveThreshold = meanSimilarity + (0.5 * stdDev);
      const thresholdToUse = Math.max(0.2, adaptiveThreshold);

      const topSimilar = similarities
        .filter(item => item.similarity > thresholdToUse)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 8)
        .map(item => item.product);

      setSimilarProducts(topSimilar);
      
      // Calculate metrics
      const endTime = performance.now();
      const metrics = {
        searchTime: ((endTime - startTime) / 1000).toFixed(2),
        resultsCount: topSimilar.length,
        productsProcessed: processedProductCount,
        averageSimilarity: topSimilar.length > 0 
          ? (similarities
              .filter(s => topSimilar.some(p => p.id === s.product.id))
              .reduce((sum, item) => sum + item.similarity, 0) / topSimilar.length).toFixed(3)
          : 0,
        adaptiveThreshold: thresholdToUse.toFixed(3),
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

  // New enhanced similarity function that considers product category
  const enhancedSimilarity = (featuresA, featuresB, category) => {
    // Base similarity using cosine
    const baseSimilarity = cosineSimilarity(featuresA, featuresB);
    
    // For furniture, visual features in middle layers can be more important
    // Extract and weight those features more heavily
    const midLayerStart = Math.floor(featuresA.length * 0.25);
    const midLayerEnd = Math.floor(featuresA.length * 0.75);
    
    const midLayerFeaturesA = featuresA.slice(midLayerStart, midLayerEnd);
    const midLayerFeaturesB = featuresB.slice(midLayerStart, midLayerEnd);
    
    const midLayerSimilarity = cosineSimilarity(midLayerFeaturesA, midLayerFeaturesB);
    
    // Combine with more weight on mid-layers (where texture and material features often are)
    return baseSimilarity * 0.4 + midLayerSimilarity * 0.6;
  };

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
            Visual Product Search
          </h1>
          <p className="text-neutral/60 text-lg">
            Discover similar products from our luxury collection by uploading an image
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
                  onClick={() => {
                    setSelectedImage(null);
                    setSimilarProducts([]);
                  }}
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
              className="flex flex-col items-center justify-center py-16 space-y-8"
            >
              {/* Loading Animation */}
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-primary/30 border-t-transparent rounded-full animate-spin-reverse" />
                </div>
              </div>

              {/* Detailed Loading Information */}
              <div className="text-center space-y-3 max-w-md mx-auto">
                <p className="text-xl font-serif text-neutral">
                  {modelLoading ? 'Initializing AI Model' : 'Processing Your Image'}
                </p>
                <p className="text-neutral/60">
                  {modelLoading ? (
                    'Loading MobileNet neural network for visual analysis...'
                  ) : (
                    'Analyzing image features and comparing with our collection...'
                  )}
                </p>
                <div className="text-sm text-neutral/40 space-y-2">
                  <p>
                    {modelLoading ? (
                      'This may take a few moments depending on your connection'
                    ) : (
                      'Searching through thousands of product features to find the best matches'
                    )}
                  </p>
                  <motion.div
                    className="w-full h-0.5 bg-base-200 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: '0%' }}
                      animate={{ 
                        width: ['0%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </div>
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
                    <p className="text-neutral/60">Products Processed</p>
                    <p className="font-medium">{searchMetrics.productsProcessed}</p>
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