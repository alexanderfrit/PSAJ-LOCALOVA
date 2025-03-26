import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import {
	AddProducts,
	AdminHome,
	AdminOrderDetails,
	AdminSidebar,
	Orders,
	ViewProducts,
} from "../../components";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import AdminManagement from './AdminManagement';

const Admin = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
								<Route path="admin-management" element={<AdminManagement />} />
							</Routes>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Admin;
