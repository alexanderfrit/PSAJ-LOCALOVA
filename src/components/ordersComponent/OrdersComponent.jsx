import React from "react";
import { formatPrice } from "../../utils/formatPrice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RiArchiveLine, RiTruckLine, RiShieldCheckLine, RiStarLine, RiExternalLinkLine } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";

const OrdersComponent = ({ orders, user, admin }) => {
	const navigate = useNavigate();

	function handleUserClick(orderId) {
		navigate(`/order-details/${orderId}`);
	}
	function handleAdminClick(orderId) {
		navigate(`/admin/order-details/${orderId}`);
	}
	
	function handleReviewClick(e, productIds) {
		e.stopPropagation(); // Prevent triggering the order click
		// Navigate to review page with the first product
		if (productIds && productIds.length > 0) {
			navigate(`/review-product/${productIds[0]}`);
		}
	}

	const getStatusIcon = (status) => {
		switch (status) {
			case "Order Placed":
				return <RiArchiveLine className="text-2xl text-primary" />;
			case "Processing":
			case "Processing...":
				return <TbTruckDelivery className="text-2xl text-yellow-500" />;
			case "Shipped":
			case "Item(s) Shipped":
				return <RiTruckLine className="text-2xl text-blue-500" />;
			case "Delivered":
			case "Item(s) Delivered":
				return <RiShieldCheckLine className="text-2xl text-green-600" />;
			default:
				return <RiArchiveLine className="text-2xl text-primary" />;
		}
	};

	return (
		<motion.main 
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen pt-20"
		>
			{!orders.length ? (
				<motion.div 
					initial={{ scale: 0.95 }}
					animate={{ scale: 1 }}
					className="flex flex-col items-center justify-center py-16"
				>
					<RiArchiveLine className="text-7xl text-neutral/20 mb-6" />
					<h1 className="text-2xl font-serif text-neutral/80">No Orders Found</h1>
					<p className="text-neutral/60 mt-2">Your order history is empty</p>
				</motion.div>
			) : (
				<div className="space-y-6">
					<motion.div 
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						className="bg-white border border-base-300 p-6"
					>
						<p className="text-lg text-neutral/80">
							Click on order to {" "}
							{admin ? (
								<span className="font-medium text-primary">Change Order Status</span>
							) : (
								<span className="font-medium text-primary">Track Order Status</span>
							)}
						</p>
					</motion.div>

					{orders.map((order, index) => {
						const { id, orderDate, orderAmount, orderStatus, email, cartItems } = order;
						// Extract product IDs for review functionality
						const productIds = cartItems ? cartItems.map(item => item.id) : [];
						// Check if order is delivered - this enables review functionality
						const isDelivered = orderStatus === "Item(s) Delivered" || orderStatus === "Delivered";
						
						return (
							<motion.section
								key={index}
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: index * 0.1 }}
								onClick={() => {
									user ? handleUserClick(id) : handleAdminClick(id);
								}}
								className="group bg-white border border-base-300 hover:border-primary transition-colors duration-200 cursor-pointer"
							>
								<div className="p-6 space-y-6">
									{/* Order Header */}
									<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-base-300">
										<div className="flex items-center gap-4">
											<motion.div 
												whileHover={{ scale: 1.1 }}
												className="p-3 bg-base-200/50 group-hover:bg-primary/5 transition-colors"
											>
												{getStatusIcon(orderStatus)}
											</motion.div>
											<div>
												<p className="text-sm text-neutral/60">Order ID</p>
												<p className="font-medium text-neutral">{id}</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-sm text-neutral/60">Order Total</p>
											<p className="font-medium text-primary">{formatPrice(orderAmount)}</p>
										</div>
									</div>

									{/* Order Details */}
									<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
										<div>
											<p className="text-sm text-neutral/60">Order Date</p>
											<p className="font-medium text-neutral mt-1">{orderDate}</p>
										</div>
										<div>
											<p className="text-sm text-neutral/60">Ship To</p>
											<p className="font-medium text-neutral mt-1">
												{email ? email.split("@")[0] : "N/A"}
											</p>
										</div>
										<div>
											<p className="text-sm text-neutral/60">Status</p>
											<p className={`font-medium mt-1 ${
												orderStatus === "Item(s) Delivered" || orderStatus === "Delivered" 
													? "text-green-600" 
													: "text-blue-600"
											}`}>
												{orderStatus}
											</p>
										</div>
									</div>
									
									{/* Review button - only show for delivered orders and for users (not admin) */}
									{user && isDelivered && (
										<div className="pt-4 border-t border-base-300 flex justify-end">
											<motion.button
												whileTap={{ scale: 0.98 }}
												onClick={(e) => handleReviewClick(e, productIds)}
												className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm transition-all hover:bg-primary-focus"
											>
												<RiStarLine className="w-4 h-4" />
												Write a Review
												<RiExternalLinkLine className="w-4 h-4" />
											</motion.button>
										</div>
									)}
								</div>
							</motion.section>
						);
					})}
				</div>
			)}
		</motion.main>
	);
};

export default OrdersComponent;
