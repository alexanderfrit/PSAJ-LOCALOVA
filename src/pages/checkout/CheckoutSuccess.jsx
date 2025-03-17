import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPrice } from "../../utils/formatPrice";
import { 
	RiShieldCheckLine, 
	RiMapPin2Line, 
	RiUser3Line, 
	RiPhoneLine,
	RiArrowRightLine
} from "react-icons/ri";

const CheckoutSuccess = () => {
	const location = useLocation();
	const orderDetails = location.state || {};
	const { orderAmount, shippingAddress } = orderDetails;

	return (
		<motion.main
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-base-200/50 pt-28"
		>
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					className="bg-white border border-base-300 rounded-xl shadow-sm overflow-hidden"
				>
					{/* Success Header */}
					<div className="bg-primary/5 border-b border-base-300 p-8">
						<div className="flex flex-col items-center text-center">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ 
									type: "spring",
									stiffness: 260,
									damping: 20 
								}}
								className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-xl mb-6"
							>
								<RiShieldCheckLine className="text-3xl text-primary" />
							</motion.div>
							<motion.h1
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.2 }}
								className="text-3xl font-serif text-neutral mb-3"
							>
								Order Confirmed
							</motion.h1>
							<motion.p
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.3 }}
								className="text-neutral/60"
							>
								Thank you for your purchase
							</motion.p>
						</div>
					</div>

					{/* Order Details */}
					<div className="p-8">
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.4 }}
							className="space-y-6"
						>
							{/* Amount */}
							<div className="text-center p-6 bg-base-200/50 rounded-lg">
								<p className="text-sm text-neutral/60 mb-1">Order Amount</p>
								<p className="text-3xl font-serif text-primary">
									{formatPrice(orderAmount)}
								</p>
							</div>

							{/* Shipping Details */}
							<div className="space-y-4">
								<h2 className="text-lg font-medium text-neutral">
									Shipping Information
								</h2>
								
								<div className="space-y-3">
									<motion.div 
										initial={{ x: -20, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ delay: 0.5 }}
										className="flex items-center gap-3 text-neutral/80"
									>
										<RiUser3Line className="text-primary w-5 h-5" />
										<span>{shippingAddress.name}</span>
									</motion.div>

									<motion.div 
										initial={{ x: -20, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ delay: 0.6 }}
										className="flex items-center gap-3 text-neutral/80"
									>
										<RiPhoneLine className="text-primary w-5 h-5" />
										<span>{shippingAddress.phone}</span>
									</motion.div>

									<motion.div 
										initial={{ x: -20, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ delay: 0.7 }}
										className="flex items-start gap-3 text-neutral/80"
									>
										<RiMapPin2Line className="text-primary w-5 h-5 mt-1" />
										<div className="space-y-1">
											<p>{shippingAddress.line1}</p>
											{shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
											<p>{shippingAddress.city}, {shippingAddress.country}</p>
										</div>
									</motion.div>
								</div>
							</div>

							{/* Action Buttons */}
							<motion.div
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.8 }}
								className="flex flex-col sm:flex-row gap-4 pt-6"
							>
								<Link 
									to="/my-orders" 
									className="btn btn-primary flex-1 gap-2"
								>
									Track Order
									<RiArrowRightLine className="w-5 h-5" />
								</Link>
								<Link 
									to="/all" 
									className="btn btn-outline flex-1 hover:text-primary hover:border-primary"
								>
									Continue Shopping
								</Link>
							</motion.div>
						</motion.div>
					</div>
				</motion.div>
			</div>
		</motion.main>
	);
};

export default CheckoutSuccess;
