import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../login/Login";
import Register from "../register/Register";

const Modal = () => {
   const [isLogin, setIsLogin] = useState(true);

   return (
      <>
         <input type="checkbox" id="my-modal-4" className="modal-toggle" />
         <label htmlFor="my-modal-4" className="modal cursor-pointer">
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="relative bg-white border-2 border-primary/10 shadow-2xl min-w-[320px] sm:w-[460px]"
            >
               {/* Background Decorative Elements */}
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
               <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent transform rotate-45 translate-x-16 -translate-y-16" />
               
               {/* Tab Navigation */}
               <div className="relative flex border-b border-base-300">
                  <motion.button
                     whileTap={{ scale: 0.98 }}
                     onClick={() => setIsLogin(true)}
                     className={`flex-1 px-8 py-4 text-sm font-medium tracking-wide transition-colors duration-200
                        ${isLogin 
                           ? 'text-primary border-b-2 border-primary' 
                           : 'text-neutral/60 hover:text-primary'
                        }`}
                  >
                     LOGIN
                  </motion.button>
                  <motion.button
                     whileTap={{ scale: 0.98 }}
                     onClick={() => setIsLogin(false)}
                     className={`flex-1 px-8 py-4 text-sm font-medium tracking-wide transition-colors duration-200
                        ${!isLogin 
                           ? 'text-primary border-b-2 border-primary' 
                           : 'text-neutral/60 hover:text-primary'
                        }`}
                  >
                     REGISTER
                  </motion.button>
               </div>

               {/* Content with Fixed Height Container */}
               <div className="relative h-[600px] overflow-hidden"> {/* Fixed height container */}
                  <AnimatePresence mode="wait">
                     <motion.div
                        key={isLogin ? 'login' : 'register'}
                        initial={{ opacity: 0, x: isLogin ? -20 : 20, position: 'absolute', width: '100%' }}
                        animate={{ opacity: 1, x: 0, position: 'absolute', width: '100%' }}
                        exit={{ opacity: 0, x: isLogin ? 20 : -20, position: 'absolute', width: '100%' }}
                        transition={{ 
                           type: "spring",
                           stiffness: 300,
                           damping: 30
                        }}
                        className="h-full"
                     >
                        {isLogin ? <Login /> : <Register />}
                     </motion.div>
                  </AnimatePresence>
               </div>
            </motion.div>
         </label>
      </>
   );
};

export default Modal;
