import React from 'react';
import { ImageSearch } from '../../components';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  RiDownload2Line, 
  RiShieldCheckLine,
  RiChromeLine,
  RiArrowRightSLine,
  RiCropLine,
  RiComputerLine,
  RiCheckboxCircleLine
} from 'react-icons/ri';

const ImageSearchPage = () => {
  const { products } = useSelector((store) => store.product);
  
  // Replace with your actual links
  const extensionDownloadUrl = "https://drive.google.com/uc?export=download&id=19TCx4cOM2mrmlRfm7-OnPkId9xDWvpBj";
  const virusTotalReportUrl = "https://www.virustotal.com/gui/file/0b4961f9730e6a78d935ee819cce6736f94b6360a0a0f88e84d47cf489033c0e?nocache=1";
  
  return (
    <div className="min-h-screen pt-36 sm:pt-40 pb-16 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop-only Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 border-l-4 border-amber-400 bg-amber-50 p-4 flex items-start gap-3"
        >
          <RiComputerLine className="text-amber-500 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Desktop Only</h3>
            <p className="text-amber-700 text-sm">
              This extension works only on desktop computers.
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl"
        >
          {/* Header Banner */}
          <div className="bg-[url('/src/assets/luxury-marble-texture.jpg')] bg-cover bg-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/80 backdrop-blur-sm"></div>
            <div className="relative p-10 sm:p-16 z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl sm:text-4xl font-serif font-light text-white tracking-wide">
                  Find furniture that matches your vision
                </h1>
                <div className="w-20 h-[1px] bg-white/40 mt-4"></div>
                <p className="mt-4 text-white/90 max-w-2xl font-light leading-relaxed">
                  Simply select any area on a webpage to find similar furniture.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8 sm:p-12 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Download Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="border border-neutral/10 p-8"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <RiDownload2Line className="text-primary text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif text-neutral mb-3">
                      Download Extension
                    </h2>
                    <p className="text-neutral/70 mb-4">
                      Secure browser extension for visual furniture search.
                    </p>
                    
                    {/* Security Tag */}
                    <div className="mb-6 flex items-center gap-2 text-green-600 text-sm">
                      <RiShieldCheckLine />
                      <span>Virus scanned & secure</span>
                      <a href={virusTotalReportUrl} target="_blank" rel="noopener noreferrer" className="underline ml-1">
                        View report
                      </a>
                    </div>
                    
                    <a
                      href={extensionDownloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white hover:bg-primary-focus transition-all duration-300 group"
                    >
                      <span className="font-medium tracking-wide">Download Now</span>
                      <RiArrowRightSLine className="transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* How It Works */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="border border-neutral/10 p-8"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <RiCropLine className="text-primary text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif text-neutral mb-3">
                      Select Area Search
                    </h2>
                    <p className="text-neutral/70 mb-6">
                      Draw a circle around any furniture in your browser to find similar items.
                    </p>
                    
                    <div className="bg-neutral/5 p-4 rounded-sm">
                      <h3 className="font-medium mb-2 flex items-center">
                        <span className="inline-block w-5 h-5 bg-primary text-white flex items-center justify-center text-xs mr-2">1</span>
                        Click the extension icon
                      </h3>
                      <h3 className="font-medium my-3 flex items-center">
                        <span className="inline-block w-5 h-5 bg-primary text-white flex items-center justify-center text-xs mr-2">2</span>
                        Choose "Select Area" option
                      </h3>
                      <h3 className="font-medium flex items-center">
                        <span className="inline-block w-5 h-5 bg-primary text-white flex items-center justify-center text-xs mr-2">3</span>
                        Draw circle around furniture
                      </h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Installation Steps - Enhanced Luxury Version */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 border border-neutral/10 bg-white overflow-hidden"
            >
              <div className="bg-neutral/5 border-b border-neutral/10 p-5 sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                    <RiChromeLine className="text-primary text-xl" />
                  </div>
                  <h2 className="text-xl font-serif text-neutral">
                    Chrome Installation
                  </h2>
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                <p className="text-neutral/70 mb-8 max-w-2xl font-light">
                  Follow these steps to install the extension in Chrome developer mode.
                </p>
                
                <div className="relative">
                  {/* Vertical connector line */}
                  <div className="absolute left-[39px] top-10 bottom-10 w-[1px] bg-neutral/10 hidden sm:block"></div>
                  
                  {/* Step 1 */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-start gap-5 mb-8 group"
                  >
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 flex-shrink-0 group-hover:border-primary/30 transition-all duration-300">
                      <span className="font-serif text-2xl text-primary">01</span>
                    </div>
                    <div className="sm:pt-3">
                      <h3 className="text-lg font-medium text-neutral mb-2">Extract the ZIP file</h3>
                      <p className="text-neutral/70 leading-relaxed">
                        After downloading, locate and extract the ZIP file to a folder that you can easily find.
                      </p>
                    </div>
                  </motion.div>
                  
                  {/* Step 2 */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-start gap-5 mb-8 group"
                  >
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 flex-shrink-0 group-hover:border-primary/30 transition-all duration-300">
                      <span className="font-serif text-2xl text-primary">02</span>
                    </div>
                    <div className="sm:pt-3">
                      <h3 className="text-lg font-medium text-neutral mb-2">Open Chrome Extensions</h3>
                      <p className="text-neutral/70 leading-relaxed">
                        Type <span className="font-mono bg-neutral/5 px-2 py-0.5 text-sm">chrome://extensions</span> in your browser address bar and press Enter.
                      </p>
                    </div>
                  </motion.div>
                  
                  {/* Step 3 */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                    className="flex flex-col sm:flex-row items-start gap-5 mb-8 group"
                  >
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 flex-shrink-0 group-hover:border-primary/30 transition-all duration-300">
                      <span className="font-serif text-2xl text-primary">03</span>
                    </div>
                    <div className="sm:pt-3">
                      <h3 className="text-lg font-medium text-neutral mb-2">Enable Developer Mode</h3>
                      <p className="text-neutral/70 leading-relaxed">
                        Find and toggle on the "Developer mode" switch located in the top-right corner.
                      </p>
                    </div>
                  </motion.div>
                  
                  {/* Step 4 */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-start gap-5 mb-8 group"
                  >
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 flex-shrink-0 group-hover:border-primary/30 transition-all duration-300">
                      <span className="font-serif text-2xl text-primary">04</span>
                    </div>
                    <div className="sm:pt-3">
                      <h3 className="text-lg font-medium text-neutral mb-2">Load the Extension</h3>
                      <p className="text-neutral/70 leading-relaxed">
                        Click "Load unpacked" button, then select the extracted extension folder from step 1.
                      </p>
                    </div>
                  </motion.div>
                  
                  {/* Step 5 */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.9 }}
                    className="flex flex-col sm:flex-row items-start gap-5 group"
                  >
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 flex-shrink-0 group-hover:border-primary/30 transition-all duration-300">
                      <span className="font-serif text-2xl text-primary">05</span>
                    </div>
                    <div className="sm:pt-3">
                      <h3 className="text-lg font-medium text-neutral mb-2">Pin to Chrome Toolbar</h3>
                      <p className="text-neutral/70 leading-relaxed">
                        Click the puzzle icon in Chrome's toolbar, find the extension and click the pin icon for easy access.
                      </p>
                    </div>
                  </motion.div>
                </div>
                
                {/* Success message */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.0 }}
                  className="mt-10 pt-8 border-t border-neutral/10 flex items-center gap-3 text-primary"
                >
                  <RiCheckboxCircleLine className="text-xl" />
                  <span className="font-light">Installation complete. You're ready to search for furniture anywhere on the web.</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImageSearchPage;