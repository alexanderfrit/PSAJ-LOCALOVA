import { useState, useEffect } from "react";
import { Breadcrumbs, CheckoutSummary } from "../../components";
import { useNavigate } from "react-router-dom";
import { FaUser, FaPhone, FaMapMarkerAlt, FaCity, FaGlobe } from "react-icons/fa";
import { MdPinDrop } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress, saveBillingAddress } from "../../redux/slice/checkoutSlice";
import { getUserInformation } from "../../redux/slice/userSlice";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { motion } from "framer-motion";
import { RiArrowLeftSLine } from "react-icons/ri";

const defaultValues = {
	name: "",
	line1: "",
	line2: "",
	city: "",
	pin_code: "",
	country: "",
	phone: "",
};

const CheckoutDetails = () => {
	const { addresses } = useSelector((store) => store.user);
	const { isUserLoggedIn, userId } = useSelector((store) => store.auth);
	const [shippingAddress, setShippingAddress] = useState(defaultValues);
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Load user information if available AND fetch from Firestore directly
	useEffect(() => {
		dispatch(getUserInformation());
		
		// Fetch addresses directly from Firestore to ensure latest data
		const fetchUserAddresses = async () => {
			if (!isUserLoggedIn || !userId) return;
			
			try {
				setIsLoading(true);
				const userDocRef = doc(db, "users", userId);
				const userDoc = await getDoc(userDocRef);
				
				if (userDoc.exists() && userDoc.data().addresses) {
					const firestoreAddresses = userDoc.data().addresses;
					
					// Find the default address
					const defaultAddress = firestoreAddresses.find(addr => addr.isDefault);
					
					// If there's a default address, use it
					if (defaultAddress) {
						setShippingAddress({
							name: defaultAddress.name || '',
							line1: defaultAddress.line1 || '',
							line2: defaultAddress.line2 || '',
							city: defaultAddress.city || '',
							pin_code: defaultAddress.pin_code || '',
							country: defaultAddress.country || '',
							phone: defaultAddress.phone || '',
						});
					}
				}
			} catch (error) {
				console.error("Error fetching user addresses:", error);
			} finally {
				setIsLoading(false);
			}
		};
		
		fetchUserAddresses();
	}, [dispatch, isUserLoggedIn, userId]);

	// Also update form when addresses changes from Redux
	useEffect(() => {
		if (addresses && addresses.length > 0) {
			// Find the default address
			const defaultAddress = addresses.find(addr => addr.isDefault);
			
			// If there's a default address, use it
			if (defaultAddress) {
				setShippingAddress({
					name: defaultAddress.name || '',
					line1: defaultAddress.line1 || '',
					line2: defaultAddress.line2 || '',
					city: defaultAddress.city || '',
					pin_code: defaultAddress.pin_code || '',
					country: defaultAddress.country || '',
					phone: defaultAddress.phone || '',
				});
			}
		}
	}, [addresses]);

	function handleShipping(e) {
		const { name, value } = e.target;
		setShippingAddress({ ...shippingAddress, [name]: value });
	}

	function handleSubmit(e) {
		e.preventDefault();
		dispatch(saveShippingAddress(shippingAddress));
		dispatch(saveBillingAddress(shippingAddress));
		navigate("/checkout");
	}

	const AllFieldsRequired = Object.values(shippingAddress).every(Boolean);

	return (
		<motion.main 
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-gray-50 pt-28"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-center mb-6">
					<button
						onClick={() => navigate(-1)}
						className="flex items-center text-neutral/60 hover:text-primary transition-colors"
					>
						<RiArrowLeftSLine className="w-5 h-5 mr-1" />
						Back
					</button>
				</div>

				<div className="flex flex-col lg:flex-row gap-8">
					{/* Shipping Form */}
					<motion.div 
						initial={{ x: -20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						className="flex-1"
					>
						<div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
							<h1 className="text-2xl font-serif text-gray-900 mb-6">
								Shipping Details
							</h1>

							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Name Field */}
								<motion.div 
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className="form-control"
								>
									<label className="label">
										<span className="label-text flex items-center gap-2 text-gray-700 font-medium">
											<FaUser className="text-primary" />
											Full Name
										</span>
									</label>
									<input
										type="text"
										name="name"
										value={shippingAddress.name}
										onChange={handleShipping}
										className="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
										placeholder="Enter your full name"
										required
									/>
								</motion.div>

								{/* Phone Field */}
								<motion.div 
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 }}
									className="form-control"
								>
									<label className="label">
										<span className="label-text flex items-center gap-2 text-gray-700 font-medium">
											<FaPhone className="text-primary" />
											Phone Number
										</span>
									</label>
									<input
										type="tel"
										name="phone"
										value={shippingAddress.phone}
										onChange={handleShipping}
										className="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
										placeholder="Enter your phone number"
										required
									/>
								</motion.div>

								{/* Address Line 1 */}
								<motion.div 
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
									className="form-control"
								>
									<label className="label">
										<span className="label-text flex items-center gap-2 text-gray-700 font-medium">
											<FaMapMarkerAlt className="text-primary" />
											Address Line 1
										</span>
									</label>
									<input
										type="text"
										name="line1"
										value={shippingAddress.line1}
										onChange={handleShipping}
										className="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
										placeholder="Street address, P.O. box"
										required
									/>
								</motion.div>

								{/* Address Line 2 */}
								<motion.div 
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3 }}
									className="form-control"
								>
									<label className="label">
										<span className="label-text flex items-center gap-2 text-gray-700 font-medium">
											<FaMapMarkerAlt className="text-primary" />
											Address Line 2
										</span>
									</label>
									<input
										type="text"
										name="line2"
										value={shippingAddress.line2}
										onChange={handleShipping}
										className="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
										placeholder="Apartment, suite, unit, building, floor"
										required
									/>
								</motion.div>

								{/* City */}
								<motion.div 
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 }}
									className="form-control"
								>
									<label className="label">
										<span className="label-text flex items-center gap-2 text-gray-700 font-medium">
											<FaCity className="text-primary" />
											City
										</span>
									</label>
									<input
										type="text"
										name="city"
										value={shippingAddress.city}
										onChange={handleShipping}
										className="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
										placeholder="Enter your city"
										required
									/>
								</motion.div>

								{/* PIN Code */}
								<motion.div 
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 }}
									className="form-control"
								>
									<label className="label">
										<span className="label-text flex items-center gap-2 text-gray-700 font-medium">
											<MdPinDrop className="text-primary" />
											PIN Code
										</span>
									</label>
									<input
										type="text"
										name="pin_code"
										value={shippingAddress.pin_code}
										onChange={handleShipping}
										className="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
										placeholder="Enter your PIN code"
										required
									/>
								</motion.div>

								{/* Country */}
								<motion.div 
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.6 }}
									className="form-control"
								>
									<label className="label">
										<span className="label-text flex items-center gap-2 text-gray-700 font-medium">
											<FaGlobe className="text-primary" />
											Country
										</span>
									</label>
									<input
										type="text"
										name="country"
										value={shippingAddress.country}
										onChange={handleShipping}
										className="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
										placeholder="Enter your country"
										required
									/>
								</motion.div>

								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.7 }}
								>
									<button
										type="submit"
										className={`btn btn-primary w-full py-3 text-sm uppercase tracking-wider ${
											!AllFieldsRequired && 'btn-disabled'
										}`}
										disabled={!AllFieldsRequired}
									>
										Proceed to Payment
									</button>
								</motion.div>
							</form>
						</div>
					</motion.div>

					{/* Order Summary */}
					<motion.div 
						initial={{ x: 20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						className="lg:w-[400px]"
					>
						<div className="bg-white rounded-xl shadow-sm p-6 lg:p-8 sticky top-8">
							<h2 className="text-xl font-serif text-gray-900 mb-6">
								Order Summary
							</h2>
							<CheckoutSummary />
						</div>
					</motion.div>
				</div>
			</div>
		</motion.main>
	);
};

export default CheckoutDetails;
