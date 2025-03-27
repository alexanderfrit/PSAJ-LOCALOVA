import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RiComputerLine } from "react-icons/ri";
import { motion } from "framer-motion";

const AdminRoute = ({ children }) => {
  const { email } = useSelector((store) => store.auth);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // First check if user is admin
  if (email !== import.meta.env.VITE_ADMIN_KEY) {
    return (
      <section className="flex flex-col items-center justify-center w-full page gap-5">
        <h2 className="text-4xl font-bold">PERMISSION DENIED</h2>
        <p className="text-xl">This page can only be viewed by admin.</p>
        <Link to="/" className="btn btn-error btn-outline btn-lg">
          &larr; Take me back home
        </Link>
      </section>
    );
  }

  // Then check if device is mobile
  if (isMobile) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-base-200/50 flex items-center justify-center px-4"
      >
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <RiComputerLine className="w-10 h-10 text-primary" />
          </motion.div>
          
          <h2 className="text-2xl font-semibold text-neutral mb-4">
            Desktop Access Only
          </h2>
          
          <p className="text-neutral/60 mb-6">
            The admin dashboard is optimized for desktop viewing. Please access this section from a desktop or laptop computer for the best experience.
          </p>
          
          <Link 
            to="/"
            className="block w-full py-3 px-4 bg-primary text-white rounded-md hover:bg-primary-focus transition-colors duration-200"
          >
            Return to Home
          </Link>
        </div>
      </motion.div>
    );
  }

  return children;
};

export const AdminOnlyLink = ({ children }) => {
  const { email } = useSelector((store) => store.auth);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (email === import.meta.env.VITE_ADMIN_KEY && !isMobile) return children;
  return null;
};

export default AdminRoute;
