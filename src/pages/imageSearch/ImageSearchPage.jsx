import React, { useState } from 'react';
import { ImageSearch } from '../../components';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiDownload2Line, 
  RiShieldCheckLine, 
  RiFileWarningLine, 
  RiQuestionLine,
  RiCheckboxCircleLine,
  RiChromeLine,
  RiPlugLine,
  RiArrowRightSLine,
  RiUpload2Line,
  RiLinkM,
  RiCropLine,
  RiInformationLine,
  RiComputerLine
} from 'react-icons/ri';

const ImageSearchPage = () => {
  const { products } = useSelector((store) => store.product);
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'extension'

  // Replace these with your actual links
  const extensionDownloadUrl = "https://drive.google.com/file/d/19TCx4cOM2mrmlRfm7-OnPkId9xDWvpBj/view?usp=sharing";
  const virusTotalReportUrl = "https://www.virustotal.com/gui/file/3065fd8dc75f2fea0b786a78827a90067f4bc07c82036f8e4d2c4792f54896ec/detection";
  
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
            <h3 className="font-medium text-amber-800">Desktop Only Extension</h3>
            <p className="text-amber-700 text-sm mt-1">
              This browser extension is designed to work only on desktop computers and is not compatible with mobile devices.
            </p>
          </div>
        </motion.div>

        {/* Tab Navigation - Refined */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex border border-neutral/10 shadow-sm" role="group">
            <button
              type="button"
              className={`px-8 py-3 text-sm font-medium tracking-wide transition-all duration-300 ${
                activeTab === 'search'
                  ? 'bg-primary text-white'
                  : 'bg-white text-neutral hover:bg-neutral/5'
              }`}
              onClick={() => setActiveTab('search')}
            >
              Visual Search
            </button>
            <button
              type="button"
              className={`px-8 py-3 text-sm font-medium tracking-wide transition-all duration-300 ${
                activeTab === 'extension'
                  ? 'bg-primary text-white'
                  : 'bg-white text-neutral hover:bg-neutral/5'
              }`}
              onClick={() => setActiveTab('extension')}
            >
              Browser Extension
            </button>
          </div>
        </div>

        {/* Content Area with AnimatePresence for smooth transitions */}
        <AnimatePresence mode="wait">
          {activeTab === 'search' ? (
            <motion.div
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ImageSearch products={products} />
            </motion.div>
          ) : (
            <motion.div 
              key="extension"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white shadow-xl"
            >
              {/* Luxury Header Banner */}
              <div className="bg-[url('/src/assets/luxury-marble-texture.jpg')] bg-cover bg-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/80 backdrop-blur-sm"></div>
                <div className="relative p-10 sm:p-16 z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <h1 className="text-3xl sm:text-4xl font-serif font-light text-white tracking-wide">
                      Localova <span className="font-normal">Visual Search</span>
                    </h1>
                    <div className="w-20 h-[1px] bg-white/40 mt-4"></div>
                    <p className="mt-4 text-white/90 max-w-2xl font-light leading-relaxed">
                      Discover furniture that matches your aesthetic, directly from any website. 
                      Our premium extension brings the power of visual AI to your browsing experience.
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Main Content - Redesigned for luxury */}
              <div className="p-8 sm:p-12 lg:p-16">
                <div className="grid lg:grid-cols-2 gap-12">
                  {/* Left Column - Download and Security */}
                  <div className="space-y-12">
                    {/* Download Section - Elegant styling */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="border border-neutral/10 p-8"
                    >
                      <div className="flex items-start gap-6">
                        <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <RiDownload2Line className="text-primary text-xl" />
                        </div>
                        <div>
                          <h2 className="text-xl font-serif text-neutral mb-4">
                            Download Extension
                          </h2>
                          <p className="text-neutral/70 mb-6 leading-relaxed">
                            Our extension is not available on the Chrome Web Store as this is a school project. 
                            Download directly from our secure link.
                          </p>
                          <a
                            href={extensionDownloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white hover:bg-primary-focus transition-all duration-300 group"
                          >
                            <span className="font-medium tracking-wide">Download Extension</span>
                            <RiArrowRightSLine className="transition-transform duration-300 group-hover:translate-x-1" />
                          </a>
                        </div>
                      </div>
                    </motion.div>

                    {/* Security Verification - Replace iframe with custom display */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="border border-neutral/10 p-8"
                    >
                      <div className="flex items-start gap-6">
                        <div className="w-12 h-12 bg-green-50 flex items-center justify-center flex-shrink-0">
                          <RiShieldCheckLine className="text-green-600 text-xl" />
                        </div>
                        <div className="w-full">
                          <h2 className="text-xl font-serif text-neutral mb-4">
                            Security Verification
                          </h2>
                          <p className="text-neutral/70 mb-6 leading-relaxed">
                            We prioritize your security and privacy. Our extension has been thoroughly 
                            scanned with VirusTotal to ensure it's completely safe to use.
                          </p>
                          
                          {/* Custom VirusTotal Results Display - No iframe */}
                          <div className="border border-neutral/10 mb-6">
                            <div className="p-4 bg-neutral/5 font-medium border-b border-neutral/10 flex items-center justify-between">
                              <span>VirusTotal Scan Results</span>
                              <div className="flex items-center gap-3 text-green-600">
                                <RiCheckboxCircleLine className="text-xl" />
                                <span className="font-medium text-sm">Safe to use</span>
                              </div>
                            </div>
                            <div className="p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                                  <RiShieldCheckLine className="text-green-600 text-2xl" />
                                </div>
                                <div>
                                  <div className="font-medium">0/64 Security Vendors</div>
                                  <div className="text-sm text-neutral/60">No malicious content detected</div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                                <div className="border border-neutral/10 p-3 text-center">
                                  <div className="text-sm font-medium">File Type</div>
                                  <div className="text-xs text-neutral/60 mt-1">Chrome Extension</div>
                                </div>
                                <div className="border border-neutral/10 p-3 text-center">
                                  <div className="text-sm font-medium">Size</div>
                                  <div className="text-xs text-neutral/60 mt-1">1.09 MB</div>
                                </div>
                                <div className="border border-neutral/10 p-3 text-center">
                                  <div className="text-sm font-medium">Last Analyzed</div>
                                  <div className="text-xs text-neutral/60 mt-1">March 29, 2025</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <a
                            href={virusTotalReportUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary-focus transition-colors inline-flex items-center gap-2 border-b border-primary/30 pb-0.5"
                          >
                            View complete VirusTotal report
                            <RiArrowRightSLine />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Column - Installation Instructions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="border border-neutral/10 p-8"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <RiChromeLine className="text-primary text-xl" />
                      </div>
                      <div>
                        <h2 className="text-xl font-serif text-neutral mb-4">
                          Installation Instructions
                        </h2>
                        <p className="text-neutral/70 mb-6 leading-relaxed">
                          Since this extension is not from the Chrome Web Store, you'll need to install 
                          it in developer mode. Follow these steps:
                        </p>
                        <div className="space-y-8">
                          <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 bg-primary text-white flex items-center justify-center">
                                1
                              </div>
                              <div className="w-[1px] h-full bg-neutral/10 my-2 flex-1"></div>
                            </div>
                            <div>
                              <h3 className="font-medium text-neutral">Download and extract the extension</h3>
                              <p className="text-sm text-neutral/70 mt-2 leading-relaxed">
                                After downloading, extract the ZIP file to a location on your computer that you'll remember.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 bg-primary text-white flex items-center justify-center">
                                2
                              </div>
                              <div className="w-[1px] h-full bg-neutral/10 my-2 flex-1"></div>
                            </div>
                            <div>
                              <h3 className="font-medium text-neutral">Open Chrome Extensions page</h3>
                              <p className="text-sm text-neutral/70 mt-2 leading-relaxed">
                                Type <code className="bg-neutral/5 px-2 py-0.5">chrome://extensions</code> in your browser address bar and press Enter.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 bg-primary text-white flex items-center justify-center">
                                3
                              </div>
                              <div className="w-[1px] h-full bg-neutral/10 my-2 flex-1"></div>
                            </div>
                            <div>
                              <h3 className="font-medium text-neutral">Enable Developer Mode</h3>
                              <p className="text-sm text-neutral/70 mt-2 leading-relaxed">
                                Toggle the "Developer mode" switch in the top-right corner of the extensions page.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 bg-primary text-white flex items-center justify-center">
                                4
                              </div>
                              <div className="w-[1px] h-full bg-neutral/10 my-2 flex-1"></div>
                            </div>
                            <div>
                              <h3 className="font-medium text-neutral">Load unpacked extension</h3>
                              <p className="text-sm text-neutral/70 mt-2 leading-relaxed">
                                Click the "Load unpacked" button and select the folder where you extracted the extension files.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 bg-primary text-white flex items-center justify-center">
                                5
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium text-neutral">Start using the extension</h3>
                              <p className="text-sm text-neutral/70 mt-2 leading-relaxed">
                                Click the extension icon in the top-right corner of your browser (in the pinned extensions section).
                                From there, you can choose one of three search methods:
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                <div className="border border-neutral/10 p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <RiUpload2Line className="text-primary" />
                                    <span className="font-medium text-sm">Upload File</span>
                                  </div>
                                  <p className="text-xs text-neutral/60">Upload an image from your device</p>
                                </div>
                                <div className="border border-neutral/10 p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <RiLinkM className="text-primary" />
                                    <span className="font-medium text-sm">Image URL</span>
                                  </div>
                                  <p className="text-xs text-neutral/60">Search using an image URL</p>
                                </div>
                                <div className="border border-neutral/10 p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <RiCropLine className="text-primary" />
                                    <span className="font-medium text-sm">Select Area</span>
                                  </div>
                                  <p className="text-xs text-neutral/60">Draw a circle to search specific areas</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* FAQ Section - Redesigned */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mt-12 border border-neutral/10 p-8"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <RiQuestionLine className="text-primary text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif text-neutral mb-6">
                        Frequently Asked Questions
                      </h2>
                      <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
                        <div className="border-l-2 border-primary/20 pl-4">
                          <h3 className="font-medium text-neutral">Is this extension safe to use?</h3>
                          <p className="text-sm text-neutral/70 mt-2 leading-relaxed">
                            Yes, the extension has been scanned with VirusTotal and is safe to use. The source code is also available for inspection.
                          </p>
                        </div>
                        <div className="border-l-2 border-primary/20 pl-4">
                          <h3 className="font-medium text-neutral">What permissions does the extension require?</h3>
                          <p className="text-sm text-neutral/70 mt-2 leading-relaxed">
                            The extension only requires permission to access the current tab and send requests to our API when you explicitly right-click an image.
                          </p>
                        </div>
                        <div className="border-l-2 border-primary/20 pl-4">
                          <h3 className="font-medium text-neutral">Will this extension slow down my browser?</h3>
                          <p className="text-sm text-neutral/70 mt-2 leading-relaxed">
                            No, the extension is lightweight and only activates when you click on the extension icon.
                          </p>
                        </div>
                        <div className="border-l-2 border-primary/20 pl-4">
                          <h3 className="font-medium text-neutral">How accurate is the image search?</h3>
                          <p className="text-sm text-neutral/70 mt-2 leading-relaxed">
                            The extension uses TensorFlow.js for image recognition and provides results based on visual similarity. Accuracy depends on the image quality.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImageSearchPage;