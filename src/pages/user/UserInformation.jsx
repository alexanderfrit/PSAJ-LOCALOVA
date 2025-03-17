import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaPhone, FaCity, FaGlobe, FaSave, FaPlus, FaTrash } from "react-icons/fa";
import { BsStar, BsStarFill, BsGeoAlt, BsPinMap, BsHouseDoor } from "react-icons/bs";
import { MdPinDrop, MdLocationOn, MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { saveUserInformation } from "../../redux/slice/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import { RiArrowLeftSLine, RiMapPinLine, RiUser3Line, RiMapPin2Line, RiPhoneLine, RiHomeGearLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { toastConfig } from "../../utils/toastConfig";
import { db } from "../../firebase/config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const defaultAddressValues = {
  id: null,
  name: "",
  line1: "",
  line2: "",
  city: "",
  pin_code: "",
  country: "",
  phone: "",
  isDefault: false,
};

// Fixed animation variants with proper easing values
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.6,
      ease: "easeOut"
    }
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  },
};

const UserInformation = () => {
  // Get user data from Redux
  const { addresses } = useSelector((store) => store.user);
  const { isUserLoggedIn, email, userId } = useSelector((store) => store.auth);
  
  // State for all addresses and current form
  const [userAddresses, setUserAddresses] = useState(addresses || []);
  const [currentAddress, setCurrentAddress] = useState(defaultAddressValues);
  const [editMode, setEditMode] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  
  // Fetch addresses from Firestore on component mount
  useEffect(() => {
    if (isUserLoggedIn && userId) {
      fetchAddressesFromFirestore();
    }
  }, [isUserLoggedIn, userId]);
  
  // Fetch addresses from Firestore
  const fetchAddressesFromFirestore = async () => {
    try {
      setIsLoading(true);
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists() && userDoc.data().addresses) {
        const firestoreAddresses = userDoc.data().addresses;
        setUserAddresses(firestoreAddresses);
        dispatch(saveUserInformation(firestoreAddresses));
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load your saved addresses", toastConfig.error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save addresses to Firestore
  const saveAddressesToFirestore = async (addresses) => {
    if (!isUserLoggedIn || !userId) {
      toast.warning("Please log in to save addresses", toastConfig.warning);
      return;
    }
    
    try {
      setIsLoading(true);
      const userDocRef = doc(db, "users", userId);
      
      // Check if user document exists
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create a new user document if it doesn't exist
        await setDoc(userDocRef, {
          email,
          addresses: addresses,
          updatedAt: new Date()
        });
      } else {
        // Update existing user document
        await updateDoc(userDocRef, {
          addresses: addresses,
          updatedAt: new Date()
        });
      }
      
      toast.success("Addresses saved to your account", toastConfig.success);
    } catch (error) {
      console.error("Error saving addresses:", error);
      toast.error("Failed to save addresses to your account", toastConfig.error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialize map when shown
  useEffect(() => {
    if (showMap && mapRef.current && !mapInstance.current) {
      initializeMap();
    }
  }, [showMap]);
  
  // Initialize map with OpenStreetMap and Leaflet
  const initializeMap = () => {
    if (!window.L) {
      // If Leaflet is not loaded, load it dynamically
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = createMap;
      document.head.appendChild(script);
    } else {
      createMap();
    }
  };
  
  // Create the actual map instance
  const createMap = () => {
    const L = window.L;
    
    // Default to Indonesia coordinates
    const defaultPosition = [-6.2088, 106.8456]; // Jakarta, Indonesia
    
    // Create map instance
    mapInstance.current = L.map(mapRef.current).setView(defaultPosition, 11);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance.current);
    
    // Add a marker that can be moved
    markerRef.current = L.marker(defaultPosition, { draggable: true }).addTo(mapInstance.current);
    
    // When marker is moved, get the address
    markerRef.current.on('dragend', handleMarkerDragEnd);
    
    // Allow clicking on map to place marker
    mapInstance.current.on('click', (e) => {
      markerRef.current.setLatLng(e.latlng);
      handleMarkerDragEnd();
    });
    
    // Add search control
    const searchControl = L.Control.extend({
      options: {
        position: 'topleft'
      },
      onAdd: function() {
        const container = L.DomUtil.create('div', 'leaflet-control leaflet-control-search');
        container.innerHTML = `
          <div style="background:white; padding:10px; box-shadow:0 2px 15px rgba(0,0,0,0.15)">
            <input type="text" id="map-search" placeholder="Search location..." 
              style="width:240px; padding:8px 12px; border:1px solid #ddd; outline:none;" />
            <button id="map-search-btn" style="margin-left:5px; padding:8px 12px; background:#4096ff; color:white; border:none; cursor:pointer">
              Search
            </button>
          </div>
        `;
        
        setTimeout(() => {
          document.getElementById('map-search-btn').addEventListener('click', handleSearch);
          document.getElementById('map-search').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          });
        }, 0);
        
        return container;
      }
    });
    
    mapInstance.current.addControl(new searchControl());
  };
  
  // Search for an address and place marker
  const handleSearch = () => {
    const searchInput = document.getElementById('map-search');
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) return;
    
    // Use Nominatim for geocoding (OpenStreetMap's geocoding service)
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const result = data[0];
          const latlng = L.latLng(result.lat, result.lon);
          
          // Move marker and map view
          markerRef.current.setLatLng(latlng);
          mapInstance.current.setView(latlng, 16);
          
          // Get address details
          getAddressFromCoordinates(latlng.lat, latlng.lng);
        } else {
          toast.info("No locations found for that search.", toastConfig.info);
        }
      })
      .catch(error => {
        console.error("Error searching location:", error);
        toast.error("Error searching for location.", toastConfig.error);
      });
  };
  
  // Handle marker being moved
  const handleMarkerDragEnd = () => {
    const position = markerRef.current.getLatLng();
    getAddressFromCoordinates(position.lat, position.lng);
  };
  
  // Reverse geocoding - get address from coordinates
  const getAddressFromCoordinates = (lat, lng) => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.address) {
          const address = data.address;
          
          // Update form with address details
          setCurrentAddress(prev => ({
            ...prev,
            line1: address.road || address.pedestrian || address.footway || '',
            line2: address.suburb || address.neighbourhood || '',
            city: address.city || address.town || address.village || '',
            pin_code: address.postcode || '',
            country: address.country || '',
          }));
          
          toast.success("Location details updated", toastConfig.success);
        }
      })
      .catch(error => {
        console.error("Error getting address:", error);
        toast.error("Couldn't get address details for this location.", toastConfig.error);
      });
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isUserLoggedIn) {
      toast.warning("Please log in to save addresses", toastConfig.warning);
      return;
    }
    
    let updatedAddresses = [];
    
    // Generate a unique ID if adding a new address
    const addressToSave = {
      ...currentAddress,
      id: currentAddress.id || `addr_${Date.now()}`,
    };
    
    if (editMode) {
      // Update existing address
      updatedAddresses = userAddresses.map(addr => 
        addr.id === addressToSave.id ? addressToSave : addr
      );
      
      // If this address is set as default, unset all others
      if (addressToSave.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          isDefault: addr.id === addressToSave.id
        }));
      }
    } else {
      // Add new address
      // If this is the first address or marked as default, make sure it's the only default
      if (addressToSave.isDefault || userAddresses.length === 0) {
        updatedAddresses = userAddresses.map(addr => ({
          ...addr,
          isDefault: false
        }));
        addressToSave.isDefault = true;
      }
      
      updatedAddresses = [...userAddresses, addressToSave];
    }
    
    // Make sure at least one address is set as default
    if (!updatedAddresses.some(addr => addr.isDefault)) {
      updatedAddresses[0].isDefault = true;
    }
    
    // Update state and save to Firestore
    setUserAddresses(updatedAddresses);
    await saveAddressesToFirestore(updatedAddresses);
    
    // Reset form and edit mode
    setCurrentAddress(defaultAddressValues);
    setEditMode(false);
    setShowForm(false);
    setShowMap(false);
    
    // Also update in Redux
    dispatch(saveUserInformation(updatedAddresses));
  };
  
  // Set an address as default
  const handleSetDefault = async (id) => {
    const updatedAddresses = userAddresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    
    setUserAddresses(updatedAddresses);
    await saveAddressesToFirestore(updatedAddresses);
    dispatch(saveUserInformation(updatedAddresses));
    toast.success("Default address updated", toastConfig.success);
  };
  
  // Delete an address
  const handleDeleteAddress = async (id) => {
    let updatedAddresses = userAddresses.filter(addr => addr.id !== id);
    
    // If we deleted the default address, set another as default
    if (userAddresses.find(addr => addr.id === id)?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }
    
    setUserAddresses(updatedAddresses);
    await saveAddressesToFirestore(updatedAddresses);
    dispatch(saveUserInformation(updatedAddresses));
    toast.success("Address deleted", toastConfig.success);
  };
  
  // Edit an address
  const handleEditAddress = (id) => {
    const addressToEdit = userAddresses.find(addr => addr.id === id);
    if (addressToEdit) {
      setCurrentAddress(addressToEdit);
      setEditMode(true);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Clean up map instance on unmount
  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);
  
  return (
    <motion.main className="min-h-screen bg-base-100/50 pt-48 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex items-center justify-between mb-8 relative z-30">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="mr-4 text-neutral/70 hover:text-primary"
            >
              <RiArrowLeftSLine className="w-6 h-6" />
            </button>
            <h1 className="text-2xl md:text-3xl font-serif text-neutral">Address Information</h1>
          </div>
          
          {!showForm && (
            <button 
              onClick={() => {
                setCurrentAddress(defaultAddressValues);
                setEditMode(false);
                setShowForm(true);
              }}
              className="btn bg-primary text-white border-none hover:bg-primary-focus px-4 py-2 relative z-30"
            >
              <FaPlus className="mr-2" />
              <span className="hidden sm:inline">Add New Address</span>
            </button>
          )}
        </div>
        
        {/* Address form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="bg-white shadow-md mb-10"
            >
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {editMode ? "Edit Address" : "Add New Address"}
                  </h2>
                  <button 
                    onClick={() => {
                      setShowForm(false);
                      setCurrentAddress(defaultAddressValues);
                      setEditMode(false);
                    }}
                    className="h-8 w-8 flex items-center justify-center border border-neutral/10 hover:bg-neutral/5"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Map Toggle */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowMap(!showMap)}
                      className="flex items-center text-primary hover:underline"
                    >
                      <RiMapPinLine className="mr-1" />
                      {showMap ? "Hide Map" : "Use Map to Fill Address"}
                    </button>
                  </div>
                  
                  {/* Map Container */}
                  <AnimatePresence>
                    {showMap && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "400px" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="overflow-hidden relative mt-4 mb-6"
                      >
                        <div 
                          ref={mapRef} 
                          className="h-[400px] w-full relative z-10" 
                          style={{ zIndex: 20 }}
                        ></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Address Name */}
                    <div className="md:col-span-2">
                      <label className="block mb-2 font-medium text-neutral/80">
                        <RiHomeGearLine className="inline mr-2" />
                        Address Label
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={currentAddress.name}
                        onChange={handleChange}
                        placeholder="Home, Office, etc."
                        className="w-full px-4 py-3 border border-neutral/20 focus:border-primary focus:outline-none"
                        required
                      />
                    </div>
                    
                    {/* Address Line 1 */}
                    <div className="md:col-span-2">
                      <label className="block mb-2 font-medium text-neutral/80">
                        <BsGeoAlt className="inline mr-2" />
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        name="line1"
                        value={currentAddress.line1}
                        onChange={handleChange}
                        placeholder="Street address"
                        className="w-full px-4 py-3 border border-neutral/20 focus:border-primary focus:outline-none"
                        required
                      />
                    </div>
                    
                    {/* Address Line 2 */}
                    <div className="md:col-span-2">
                      <label className="block mb-2 font-medium text-neutral/80">
                        <BsPinMap className="inline mr-2" />
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        name="line2"
                        value={currentAddress.line2}
                        onChange={handleChange}
                        placeholder="Apartment, suite, unit, etc. (optional)"
                        className="w-full px-4 py-3 border border-neutral/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                    
                    {/* City */}
                    <div>
                      <label className="block mb-2 font-medium text-neutral/80">
                        <FaCity className="inline mr-2" />
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={currentAddress.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full px-4 py-3 border border-neutral/20 focus:border-primary focus:outline-none"
                        required
                      />
                    </div>
                    
                    {/* Postal Code */}
                    <div>
                      <label className="block mb-2 font-medium text-neutral/80">
                        <MdPinDrop className="inline mr-2" />
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="pin_code"
                        value={currentAddress.pin_code}
                        onChange={handleChange}
                        placeholder="Postal / ZIP code"
                        className="w-full px-4 py-3 border border-neutral/20 focus:border-primary focus:outline-none"
                        required
                      />
                    </div>
                    
                    {/* Country */}
                    <div>
                      <label className="block mb-2 font-medium text-neutral/80">
                        <FaGlobe className="inline mr-2" />
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={currentAddress.country}
                        onChange={handleChange}
                        placeholder="Country"
                        className="w-full px-4 py-3 border border-neutral/20 focus:border-primary focus:outline-none"
                        required
                      />
                    </div>
                    
                    {/* Phone */}
                    <div>
                      <label className="block mb-2 font-medium text-neutral/80">
                        <RiPhoneLine className="inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={currentAddress.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                        className="w-full px-4 py-3 border border-neutral/20 focus:border-primary focus:outline-none"
                        required
                      />
                    </div>
                    
                    {/* Default Address Checkbox */}
                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={currentAddress.isDefault}
                          onChange={handleChange}
                          className="checkbox checkbox-primary"
                        />
                        <span className="text-neutral">Set as default address</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Form Actions */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="btn bg-primary text-white border-none hover:bg-primary-focus flex-1 py-3 px-6"
                      disabled={!currentAddress.name || !currentAddress.line1 || !currentAddress.city || !currentAddress.country || !currentAddress.phone || isLoading}
                    >
                      {isLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <>
                          <FaSave className="mr-2" />
                          {editMode ? "Update Address" : "Save Address"}
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentAddress(defaultAddressValues);
                        setEditMode(false);
                        setShowForm(false);
                      }}
                      className="btn btn-outline border-neutral/30 text-neutral hover:bg-neutral/5 hover:border-neutral/50 py-3 px-6"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved Addresses Section */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        ) : userAddresses.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {userAddresses.map((address) => (
              <motion.div 
                key={address.id}
                variants={itemVariants}
                className={`bg-white shadow-md p-6 ${address.isDefault ? 'border-l-4 border-l-primary' : ''}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg flex items-center">
                    {address.name}
                    {address.isDefault && (
                      <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5">
                        Default
                      </span>
                    )}
                  </h3>
                  <div className="flex gap-3">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="text-neutral hover:text-primary"
                        title="Set as default"
                      >
                        <BsStar className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEditAddress(address.id)}
                      className="text-neutral hover:text-primary"
                      title="Edit address"
                    >
                      <MdEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-neutral hover:text-red-500"
                      title="Delete address"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-neutral/80">
                  <p className="flex items-start">
                    <RiPhoneLine className="w-4 h-4 mt-0.5 mr-3 text-primary/70" />
                    <span>{address.phone}</span>
                  </p>
                  <p className="flex items-start">
                    <RiMapPin2Line className="w-4 h-4 mt-0.5 mr-3 text-primary/70" />
                    <span>
                      {address.line1}
                      {address.line2 && <span>, {address.line2}</span>}
                    </span>
                  </p>
                  <p className="flex items-start">
                    <FaCity className="w-4 h-4 mt-0.5 mr-3 text-primary/70" />
                    <span>{address.city}, {address.pin_code}</span>
                  </p>
                  <p className="flex items-start">
                    <FaGlobe className="w-4 h-4 mt-0.5 mr-3 text-primary/70" />
                    <span>{address.country}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white shadow-md p-8 text-center"
          >
            <RiMapPin2Line className="mx-auto mb-4 w-16 h-16 text-neutral/30" />
            <h3 className="text-xl font-medium mb-2">No Addresses Saved</h3>
            <p className="text-neutral/70 mb-6">Add a new address to save your delivery information.</p>
            
            {!showForm && (
              <button
                onClick={() => {
                  setCurrentAddress(defaultAddressValues);
                  setEditMode(false);
                  setShowForm(true);
                }}
                className="btn bg-primary text-white border-none hover:bg-primary-focus py-3 px-6"
              >
                <FaPlus className="mr-2" />
                Add New Address
              </button>
            )}
          </motion.div>
        )}
      </div>
    </motion.main>
  );
};

export default UserInformation; 