import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import {
	AddProducts,
	AdminHome,
	AdminOrderDetails,
	AdminSidebar,
	Orders,
	ViewProducts,
} from "../../components";
import { RiMenuLine, RiCloseLine, RiComputerLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

const Admin = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const navigate = useNavigate();

	// Check if device is mobile
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 1024); // 1024px is the lg breakpoint
		};

		// Initial check
		checkMobile();

		// Add resize listener
		window.addEventListener('resize', checkMobile);

		// Cleanup
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// If mobile, show message and redirect after delay
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
					
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => navigate('/')}
						className="w-full py-3 px-4 bg-primary text-white rounded-md hover:bg-primary-focus transition-colors duration-200"
					>
						Return to Home
					</motion.button>
				</div>
			</motion.div>
		);
	}

	return (
		<div className="min-h-screen bg-base-200/50">
			<div className="flex min-h-screen">
				{/* Mobile Sidebar Toggle */}
				<button
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className="lg:hidden fixed top-[10rem] left-4 z-50 p-3 bg-primary text-white shadow-lg"
				>
					{isSidebarOpen ? (
						<RiCloseLine className="w-6 h-6" />
					) : (
						<RiMenuLine className="w-6 h-6" />
					)}
				</button>

				{/* Sidebar - Desktop */}
				<div className="hidden lg:block w-64 xl:w-80">
					<div className="bg-base-100 border-r-2 border-primary shadow-lg sticky top-[7rem] h-[calc(100vh-7rem)]">
						<AdminSidebar />
					</div>
				</div>

				{/* Sidebar - Mobile */}
				<AnimatePresence>
					{isSidebarOpen && (
						<motion.div
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ type: "tween" }}
							className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
							onClick={() => setIsSidebarOpen(false)}
						>
							<motion.div
								initial={{ x: "-100%" }}
								animate={{ x: 0 }}
								exit={{ x: "-100%" }}
								transition={{ type: "tween" }}
								className="w-64 h-full bg-base-100 border-r-2 border-primary shadow-lg"
								onClick={(e) => e.stopPropagation()}
							>
								<AdminSidebar onClose={() => setIsSidebarOpen(false)} />
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Main Content */}
				<div className="flex-1">
					<div 
						className="min-h-screen bg-base-100/90 backdrop-blur-sm overflow-y-auto"
						style={{
							paddingTop: '6rem',
							minHeight: 'calc(100vh - 6rem)'
						}}
					>
						<div className="p-4 sm:p-6 xl:p-8">
							<Routes>
								<Route path="home" element={<AdminHome />} />
								<Route path="all-products" element={<ViewProducts />} />
								<Route path="add-product/:id" element={<AddProducts />} />
								<Route path="orders" element={<Orders />} />
								<Route path="order-details/:id" element={<AdminOrderDetails />} />
							</Routes>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Admin;
