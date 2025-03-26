import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { RiShoppingBag3Line, RiArrowRightLine, RiSearchEyeLine, RiArrowDownLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// Format price to IDR
const formatToIDR = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const Hero = () => {
  const scrollRef = useRef(null);
  const backgroundRef = useRef(null);
  const parallaxRef = useRef(null);
  const { products } = useSelector((store) => store.product);
  
  // Get a sampling of product images for the parallax grid
  const featuredProducts = products
    .filter(product => product.imageURL)
    .slice(0, 12);
  
  // Split products for left and right columns
  const leftColumnProducts = featuredProducts.filter((_, i) => i % 2 === 0);
  const rightColumnProducts = featuredProducts.filter((_, i) => i % 2 === 1);
  
  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (backgroundRef.current) {
        const scrollPosition = window.scrollY;
        backgroundRef.current.style.transform = `translateY(${scrollPosition * 0.2}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll animation for parallax grid
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"]
  });
  
  const leftColumnY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const rightColumnY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  
  // Scroll to parallax section
  const scrollToParallax = () => {
    if (parallaxRef.current) {
      parallaxRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Main Hero Section */}
      <div className="min-h-screen relative">
        {/* Background Elements */}
        <div ref={backgroundRef} className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral/10 via-base-200/5 to-transparent opacity-70" />
          <div className="absolute inset-0 bg-[url('/src/assets/luxury-marble-texture.jpg')] bg-cover bg-fixed opacity-10" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          
          {/* Decorative Elements */}
          <motion.div 
            className="absolute top-1/3 right-[5%] w-[30vw] h-[30vw] rounded-full bg-primary/5 blur-[80px]"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div 
            className="absolute bottom-1/4 left-[10%] w-[20vw] h-[20vw] rounded-full bg-secondary/5 blur-[60px]"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        {/* Content Container */}
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 pt-32 pb-24 lg:pt-40 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-10 lg:pr-8">
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-5"
                >
                  <span className="text-primary/70 uppercase tracking-[0.3em] text-sm font-light border border-primary/20 py-2 px-4">Localova Curated</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-5xl md:text-6xl xl:text-7xl font-serif tracking-tight text-neutral leading-[1.1]"
                >
                  <span className="block">Experience</span>
                  
                  {/* Replace rotating categories with static elegant heading */}
                  <div className="mt-3">
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="text-primary inline-block relative"
                    >
                      Timeless Elegance
                      <motion.div 
                        className="absolute bottom-1 left-0 h-[2px] bg-primary/30" 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </motion.span>
                  </div>
                  
                  
                </motion.h1>
              </div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-neutral/60 leading-relaxed max-w-2xl"
              >
                Discover our exquisite collection of artisan-crafted furniture, each piece telling its own story. Elevate your home with designs that blend timeless elegance with contemporary comfort.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-6"
              >
                <Link 
                  to="/all" 
                  className="group flex items-center justify-center gap-3 px-10 py-4 bg-primary text-white hover:bg-primary-focus transition-all duration-300 relative overflow-hidden shadow-lg shadow-primary/10"
                >
                  <span className="absolute inset-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
                  <RiShoppingBag3Line className="text-xl relative z-10" />
                  <span className="font-medium tracking-wide relative z-10">Explore Collection</span>
                  <RiArrowRightLine className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
                </Link>
                
                <Link 
                  to="/image-search" 
                  className="group px-10 py-4 border border-primary/30 text-primary hover:border-primary transition-all duration-300 font-medium tracking-wide flex items-center justify-center gap-3"
                >
                  <RiSearchEyeLine className="text-xl" />
                  <span>Visual Search</span>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex items-center gap-6 pt-2"
              >
                {['Artisan Crafted', 'Sustainable', 'Unique Designs'].map((feature, index) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    <span className="text-sm text-neutral/60">{feature}</span>
                  </div>
                ))}
              </motion.div>
            </div>
            
            {/* Right Column - Image Gallery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              <div className="aspect-[4/5] relative">
                {/* Main Feature Image */}
                <motion.div
                  className="absolute inset-0 rounded-lg overflow-hidden"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img 
                    src="/src/assets/luxury-furniture-main.jpg" 
                    alt="Luxury furniture showcase" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral/20 to-transparent" />
                </motion.div>
                
                {/* Decorative Frame */}
                <motion.div 
                  className="absolute inset-0 border border-primary/20 rounded-lg"
                  style={{ transform: "translate(20px, 20px)" }}
                />
                
                {/* Small Feature Image 1 - FIXED POSITION - moved right to avoid overlap */}
                <motion.div
                  className="absolute -bottom-10 left-10 w-48 h-48 rounded-lg overflow-hidden shadow-xl shadow-neutral/10 hidden md:block"
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, 2, 0]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img 
                    src="/src/assets/luxury-furniture-detail1.jpg" 
                    alt="Furniture detail" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1631679706909-1844bbd07221?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=792&q=80";
                    }}
                  />
                </motion.div>
                
                {/* Small Feature Image 2 - FIXED POSITION - moved down to avoid navbar */}
                <motion.div
                  className="absolute -top-0 -right-8 w-36 h-36 rounded-lg overflow-hidden shadow-xl shadow-neutral/10 hidden md:block"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, -2, 0]
                  }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img 
                    src="/src/assets/luxury-furniture-detail2.jpg" 
                    alt="Furniture detail" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=958&q=80";
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Bottom Scroll Indicator with enhanced clickable interaction */}
        <motion.div 
          ref={scrollRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          onClick={scrollToParallax}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-neutral/40 text-sm tracking-widest flex items-center gap-1">
            SCROLL
            <RiArrowDownLine className="animate-bounce h-4 w-4" />
          </span>
          <motion.div 
            className="w-0.5 h-10 bg-primary/20"
            animate={{ 
              scaleY: [0, 1, 0],
              originY: 0
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>

      {/* Parallax Grid Scroll Section */}
      <div 
        ref={parallaxRef}
        className="py-24 bg-neutral-50 relative overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-primary/10 to-transparent" />
        </div>
        
        {/* Section title */}
        <div className="text-center mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-neutral">
              Our Curated Collection
            </h2>
            <motion.div 
              className="h-[2px] bg-primary/30 mt-2" 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </motion.div>
          <p className="text-neutral/60 mt-4 max-w-2xl mx-auto px-4">
            Explore our handpicked selection of premium furniture pieces, each crafted with meticulous attention to detail and design.
          </p>
        </div>
        
        {/* Parallax columns */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 overflow-hidden">
          {/* Left Column - Scrolls up */}
          <motion.div 
            style={{ y: leftColumnY }}
            className="space-y-4 md:space-y-6"
          >
            {leftColumnProducts.length > 0 ? leftColumnProducts.map((product, index) => (
              <motion.div
                key={product.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-lg shadow-md shadow-neutral/5"
                whileHover={{ y: -5 }}
              >
                <Link to={`/product-details/${product.id}`}>
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                    <LazyLoadImage
                      src={product.imageURL}
                      alt={product.name || "Luxury furniture"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      effect="blur"
                      width="100%"
                      height="100%"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral/80 via-neutral/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 p-4 w-full text-white">
                      <h3 className="font-medium truncate">{product.name || "Luxury Item"}</h3>
                      <p className="text-white/80 text-sm">{formatToIDR(product.price || 1000000)}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )) : (
              // Fallback content if no products
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="aspect-[4/3] bg-neutral-100 rounded-lg animate-pulse" />
              ))
            )}
          </motion.div>
          
          {/* Right Column - Scrolls down */}
          <motion.div 
            style={{ y: rightColumnY }}
            className="space-y-4 md:space-y-6 md:mt-20"
          >
            {rightColumnProducts.length > 0 ? rightColumnProducts.map((product, index) => (
              <motion.div
                key={product.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="group relative overflow-hidden rounded-lg shadow-md shadow-neutral/5"
                whileHover={{ y: -5 }}
              >
                <Link to={`/product-details/${product.id}`}>
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                    <LazyLoadImage
                      src={product.imageURL}
                      alt={product.name || "Luxury furniture"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      effect="blur"
                      width="100%"
                      height="100%"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral/80 via-neutral/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 p-4 w-full text-white">
                      <h3 className="font-medium truncate">{product.name || "Luxury Item"}</h3>
                      <p className="text-white/80 text-sm">{formatToIDR(product.price || 1000000)}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )) : (
              // Fallback content if no products
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="aspect-[4/3] bg-neutral-100 rounded-lg animate-pulse" />
              ))
            )}
          </motion.div>
        </div>
        
        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-20"
        >
          <Link 
            to="/all"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white hover:bg-primary-focus transition-all duration-300 relative group"
          >
            <span>View All Collections</span>
            <RiArrowRightLine className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
