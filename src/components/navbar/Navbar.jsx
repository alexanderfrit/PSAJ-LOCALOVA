import React, { useEffect, useState } from "react";
import { RiShoppingBag3Line, RiUser3Line, RiMenu2Line, RiCloseLine, RiArrowRightSLine } from "react-icons/ri";
import { Link, NavLink, useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminOnlyLink } from "../adminRoute/AdminRoute";
// firebase
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { removeActiveUser, setActiveUser } from "../../redux/slice/authSlice";
import { calculateSubtotal, calculateTotalQuantity } from "../../redux/slice/cartSlice";
import { formatPrice } from "../../utils/formatPrice";
import { motion, AnimatePresence } from "framer-motion";
import LogoSvg from "../../assets/LocaLova.svg";
import { toastConfig } from "../../utils/toastConfig";
import { isAdmin } from "../../utils/adminUtils";

const Navbar = () => {
  const { isUserLoggedIn, userName, email } = useSelector((store) => store.auth);
  const { totalAmount, totalQuantity, cartItems } = useSelector((store) => store.cart);
  const [displayName, setDisplayName] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [navHistory, setNavHistory] = useState([]);
  const navigationType = useNavigationType();

  // Check if user is admin - UPDATED VERSION
  const userIsAdmin = isAdmin(email);

  const pathnames = location.pathname.split('/').filter((x) => x);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.photoURL && user.photoURL.includes('googleusercontent.com')) {
          const url = new URL(user.photoURL);
          url.searchParams.set('sz', '160');
          setUserPhoto(url.href);
        } else {
          setUserPhoto(user.photoURL);
        }

        if (displayName == null) {
          setDisplayName(user.email.split("@")[0]);
        }
        dispatch(
          setActiveUser({
            email: user.email,
            userName: user.displayName ? user.displayName : displayName,
            userId: user.uid,
            photoURL: user.photoURL
          })
        );
      } else {
        setUserPhoto(null);
        setDisplayName("");
        dispatch(removeActiveUser());
      }
    });
  }, [dispatch, displayName]);

  function logOutUser() {
    signOut(auth)
      .then(() => {
        toast.success("Logged out successfully", toastConfig.success);
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }

  useEffect(() => {
    dispatch(calculateTotalQuantity());
    dispatch(calculateSubtotal());
  }, [dispatch, cartItems]);

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsCartOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  // Navigation history tracking
  useEffect(() => {
    const newEntry = {
      pathname: location.pathname,
      state: location.state,
      timestamp: Date.now(),
      key: location.key
    };

    setNavHistory(prev => {
      let updatedHistory;
      
      if (navigationType === 'POP') {
        const historyIndex = prev.findIndex(entry => entry.key === location.key);
        updatedHistory = historyIndex >= 0 ? prev.slice(0, historyIndex + 1) : prev;
      } else {
        updatedHistory = navigationType === 'PUSH' 
          ? [...prev, newEntry] 
          : [...prev.slice(0, -1), newEntry];
      }

      // Keep only last 5 entries
      return updatedHistory.slice(-5);
    });
  }, [location, navigationType]);

  // Generate breadcrumbs from navigation history
  useEffect(() => {
    const buildBreadcrumbs = () => {
      const crumbs = navHistory.map((entry, index) => {
        const pathnames = entry.pathname.split('/').filter(x => x);
        const customName = entry.state?.breadcrumbName || 
          pathnames[pathnames.length - 1]?.replace(/-/g, ' ') || 
          'Home';

        return {
          path: entry.pathname,
          name: customName,
          isCurrent: index === navHistory.length - 1,
          state: entry.state,
          key: entry.key
        };
      });

      // Ensure home is always first
      if (!crumbs[0] || crumbs[0].path !== '/') {
        crumbs.unshift({
          path: '/',
          name: 'Home',
          isCurrent: false,
          key: 'root'
        });
      }

      setBreadcrumbs(crumbs);
    };

    buildBreadcrumbs();
  }, [navHistory]);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-screen ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-white'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={LogoSvg} alt="LocaLova" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLink 
              to="/"
              end
              className={({ isActive }) => `
                text-sm font-medium tracking-wider uppercase
                ${isActive ? 'text-primary' : 'text-neutral hover:text-primary'}
                transition-colors duration-200
              `}
            >
              Home
            </NavLink>
            
            {userIsAdmin && (
              <NavLink 
                to="/admin/home"
                className={({ isActive }) => `
                  text-sm font-medium tracking-wider uppercase
                  ${isActive ? 'text-primary' : 'text-neutral hover:text-primary'}
                  transition-colors duration-200
                `}
              >
                Dashboard
              </NavLink>
            )}

            <NavLink 
              to="/all"
              className={({ isActive }) => `
                text-sm font-medium tracking-wider uppercase
                ${isActive ? 'text-primary' : 'text-neutral hover:text-primary'}
                transition-colors duration-200
              `}
            >
              Collection
            </NavLink>

            <NavLink 
              to="/image-search"
              className={({ isActive }) => `
                text-sm font-medium tracking-wider uppercase
                ${isActive ? 'text-primary' : 'text-neutral hover:text-primary'}
                transition-colors duration-200
              `}
            >
              Visual Search
            </NavLink>

            <NavLink 
              to="/contact"
              className={({ isActive }) => `
                text-sm font-medium tracking-wider uppercase
                ${isActive ? 'text-primary' : 'text-neutral hover:text-primary'}
                transition-colors duration-200
              `}
            >
              Contact
            </NavLink>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="p-2 hover:text-primary transition-colors relative"
              >
                <RiShoppingBag3Line className="w-6 h-6" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-white text-xs font-medium">
                    {totalQuantity}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              <AnimatePresence>
                {isCartOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-[280px] sm:w-[340px] md:w-[360px] bg-white shadow-xl border border-base-300 max-h-[80vh] overflow-auto"
                    style={{ 
                      maxWidth: "calc(100vw - 32px)",
                      right: "-8px"
                    }}
                  >
                    <div className="p-4 sm:p-6">
                      {/* Cart Header */}
                      <div className="flex justify-between items-center border-b border-base-300 pb-4">
                        <h3 className="font-medium text-neutral">Shopping Cart</h3>
                        <span className="text-primary font-medium">{totalQuantity} items</span>
                      </div>

                      {/* Cart Items */}
                      {cartItems.length === 0 ? (
                        <div className="py-8 text-center">
                          <RiShoppingBag3Line className="w-12 h-12 mx-auto text-neutral/30 mb-3" />
                          <p className="text-neutral/60">Your cart is empty</p>
                        </div>
                      ) : (
                        <>
                          <div className="py-4 max-h-[50vh] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
                            {cartItems.map((item) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex gap-4 group"
                              >
                                {/* Product Image */}
                                <Link 
                                  to={`/product-details/${item.id}`}
                                  className="relative aspect-square w-16 sm:w-20 bg-base-200/50 flex-shrink-0 overflow-hidden"
                                  onClick={() => setIsCartOpen(false)}
                                >
                                  <img 
                                    src={item.imageURL} 
                                    alt={item.name}
                                    className="w-full h-full object-contain p-2 transition-transform group-hover:scale-105"
                                  />
                                </Link>

                                {/* Product Details */}
                                <div className="flex-1 min-w-0">
                                  <Link 
                                    to={`/product-details/${item.id}`}
                                    className="block text-sm font-medium text-neutral hover:text-primary transition-colors line-clamp-2"
                                    onClick={() => setIsCartOpen(false)}
                                  >
                                    {item.name}
                                  </Link>
                                  <div className="mt-1 flex items-center gap-2 text-sm">
                                    <span className="text-primary font-medium">
                                      {formatPrice(item.price)}
                                    </span>
                                    <span className="text-neutral/40">×</span>
                                    <span className="text-neutral/60">
                                      {item.qty}
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Cart Footer */}
                          <div className="border-t border-base-300 mt-4 pt-4 space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-neutral font-medium">Subtotal</span>
                              <span className="text-primary font-medium text-lg">
                                {formatPrice(totalAmount)}
                              </span>
                            </div>

                            <div>
                              <Link 
                                to="/cart"
                                onClick={() => setIsCartOpen(false)}
                                className="block w-full py-3 px-4 bg-primary text-white hover:bg-primary-focus transition-colors duration-200 text-center uppercase text-sm tracking-wider"
                              >
                                View Cart
                              </Link>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 hover:text-primary transition-colors"
              >
                {userPhoto ? (
                  <img 
                    src={userPhoto} 
                    alt={userName}
                    className="w-6 h-6 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <RiUser3Line className="w-6 h-6" />
                )}
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white shadow-xl border border-base-300"
                  >
                    {isUserLoggedIn ? (
                      <div className="p-2">
                        <div className="px-3 py-2 text-sm text-neutral/60">
                          Welcome, {userName}
                        </div>
                        <Link 
                          to="/my-information"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-3 py-2 text-sm text-neutral hover:text-primary transition-colors"
                        >
                          My Information
                        </Link>
                        <Link 
                          to="/my-orders"
                          className="block px-3 py-2 text-sm text-neutral hover:text-primary transition-colors"
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={logOutUser}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="p-2">
                        <label 
                          htmlFor="my-modal-4"
                          className="block px-3 py-2 text-sm text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                          Login
                        </label>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 lg:hidden hover:text-primary transition-colors"
            >
              {isMenuOpen ? (
                <RiCloseLine className="w-6 h-6" />
              ) : (
                <RiMenu2Line className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="border-t border-base-300 w-full">
          <nav className="w-full py-3">
            <div className="px-4 sm:px-6 lg:px-8">
              <ol className="flex items-center space-x-2 overflow-x-auto">
                {breadcrumbs.slice(-5).map((crumb, index, arr) => {
                  const isFirst = index === 0;
                  const isLast = index === arr.length - 1;
                  
                  return (
                    <li key={crumb.key} className="flex items-center">
                      {!isFirst && <RiArrowRightSLine className="text-neutral/40 w-4 h-4 mx-2" />}
                      {isLast ? (
                        <span className="text-sm text-primary font-medium capitalize">
                          {crumb.name}
                        </span>
                      ) : (
                        <Link 
                          to={{
                            pathname: crumb.path,
                            state: { 
                              breadcrumbName: crumb.name,
                              fromHistory: true 
                            }
                          }}
                          className="text-neutral/60 hover:text-primary transition-colors text-sm capitalize"
                        >
                          {crumb.name}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-base-300 bg-white"
          >
            <div className="p-4 space-y-4">
              <Link 
                to="/"
                className="block py-2 text-neutral hover:text-primary transition-colors"
              >
                Home
              </Link>
              
              {userIsAdmin && (
                <Link 
                  to="/admin/home"
                  className="block py-2 text-neutral hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              )}

              <Link 
                to="/all"
                className="block py-2 text-neutral hover:text-primary transition-colors"
              >
                Collection
              </Link>

              <Link 
                to="/image-search"
                className="block py-2 text-neutral hover:text-primary transition-colors"
              >
                Visual Search
              </Link>

              <Link 
                to="/contact"
                className="block py-2 text-neutral hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
