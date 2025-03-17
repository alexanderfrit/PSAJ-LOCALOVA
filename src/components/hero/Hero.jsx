import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiShoppingBag3Line, RiArrowRightLine } from "react-icons/ri";
import heroImage from "../../assets/asset_hero_section.svg";

const tags = ["Electronics", "Fashion", "Home Decor", "Accessories", "Gadgets"];

const Hero = () => {
   const [tagName, setTagName] = useState("");
   const [fadeOut, setFadeOut] = useState(false);
   const intervalRef = useRef(null);

   useEffect(() => {
      let currentIndex = 0;
      
      // Set initial tag
      setTagName(tags[0]);
      
      // Use requestAnimationFrame for smoother animations
      const startInterval = () => {
         intervalRef.current = setInterval(() => {
            setFadeOut(true);
            setTimeout(() => {
               currentIndex = (currentIndex + 1) % tags.length;
               setTagName(tags[currentIndex]);
               setFadeOut(false);
            }, 500);
         }, 3000);
      };
      
      startInterval();
      
      return () => {
         if (intervalRef.current) {
            clearInterval(intervalRef.current);
         }
      };
   }, []);

   return (
      <main className="bg-gradient-to-br from-primary/5 via-base-200/50 to-transparent min-h-screen">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pt-20 pb-16 text-center lg:pt-32 lg:text-left">
               <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                  <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="lg:col-span-6 space-y-8"
                     transition={{ duration: 0.5 }}
                  >
                     <div className="space-y-4">
                        <motion.h1 
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ duration: 0.5 }}
                           className="text-4xl font-serif tracking-tight text-neutral sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl"
                        >
                           <span className="block">Discover Amazing</span>
                           <AnimatePresence mode="wait">
                              <motion.span
                                 key={tagName}
                                 initial={{ opacity: 0, y: 20 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 exit={{ opacity: 0, y: -20 }}
                                 transition={{ duration: 0.4 }}
                                 className="block text-primary mt-2"
                              >
                                 {tagName}
                                 <span className="inline-block ml-2">✨</span>
                              </motion.span>
                           </AnimatePresence>
                        </motion.h1>
                        
                        <motion.p 
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           transition={{ delay: 0.2, duration: 0.4 }}
                           className="text-lg text-neutral/60 sm:text-xl max-w-3xl"
                        >
                           Explore our curated collection of premium products. Find exactly what you're looking for with our easy-to-use search and filtering options.
                        </motion.p>
                     </div>

                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 sm:items-center"
                     >
                        <Link 
                           to="/all" 
                           className="group flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white hover:bg-primary/90 transition-colors duration-300"
                        >
                           <RiShoppingBag3Line className="text-xl" />
                           <span className="font-medium tracking-wide">Start Shopping</span>
                           <RiArrowRightLine className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                        
                        <Link 
                           to="/about" 
                           className="px-8 py-4 border border-primary/20 text-primary hover:bg-primary/5 transition-colors duration-300 font-medium tracking-wide"
                        >
                           Learn More
                        </Link>
                     </motion.div>

                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        className="grid grid-cols-3 gap-4 sm:gap-6"
                     >
                        {['Fast Delivery', 'Quality Products', 'Best Prices'].map((feature, index) => (
                           <motion.div
                              key={feature}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                              className="bg-white/80 backdrop-blur-sm p-4 border border-primary/10 hover:border-primary/20 transition-colors duration-300"
                           >
                              <p className="text-sm font-medium text-neutral">{feature}</p>
                           </motion.div>
                        ))}
                     </motion.div>
                  </motion.div>
                  
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: 0.2, duration: 0.5 }}
                     className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6"
                  >
                     <div className="relative">
                        <motion.img 
                           src={heroImage} 
                           alt="Shopping Illustration" 
                           className="w-full h-full object-contain"
                           width="600"
                           height="600"
                           animate={{ 
                              y: [0, -10, 0],
                           }}
                           transition={{ 
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut" 
                           }}
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent -z-10" />
                        <motion.div 
                           className="absolute inset-0 border-2 border-primary/10 -z-10"
                           style={{ transform: "translate(20px, 20px)" }}
                        />
                     </div>
                  </motion.div>
               </div>
            </div>
         </div>
      </main>
   );
};

export default Hero;
