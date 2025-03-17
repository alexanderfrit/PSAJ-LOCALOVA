import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import LogoSvg from "../../assets/LocaLova.svg";

const Loader = () => {
  return ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-neutral/10 backdrop-blur-sm z-50"
    >
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white w-full max-w-sm border border-base-300 shadow-2xl"
        >
          <div className="p-8 space-y-8">
            {/* Logo Section - Optimized */}
            <div className="flex justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.02, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <img 
                  src={LogoSvg} 
                  alt="LocaLova" 
                  className="h-12 w-auto" 
                  width="120"
                  height="48"
                  loading="eager"
                />
              </motion.div>
            </div>

            {/* Loading Animation - Simplified for better performance */}
            <div className="space-y-6">
              <div className="h-0.5 w-full bg-base-200 overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ 
                    width: ["0%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>

              <div className="text-center">
                <motion.p
                  animate={{ 
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-sm text-neutral/60"
                >
                  Loading...
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>,
    document.getElementById("loader")
  );
};

export default Loader;
