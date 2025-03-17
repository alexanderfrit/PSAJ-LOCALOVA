import React, { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";
import { useNavigate } from "react-router-dom";
// firebase
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { motion } from "framer-motion";
import { RiShoppingBagLine, RiTimeLine, RiTruckLine, RiCheckboxCircleLine } from "react-icons/ri";
import { toastConfig } from "../../utils/toastConfig";

const ChangeOrderStatus = ({ order, orderId }) => {
	const [status, setStatus] = useState("");
	const [isLoading, setIsloading] = useState(false);
	const navigate = useNavigate();

	const statusOptions = [
		{ value: "orderPlaced", label: "Order Placed", icon: <RiShoppingBagLine /> },
		{ value: "Processing...", label: "Processing", icon: <RiTimeLine /> },
		{ value: "Item(s) Shipped", label: "Shipped", icon: <RiTruckLine /> },
		{ value: "Item(s) Delivered", label: "Delivered", icon: <RiCheckboxCircleLine /> },
	];

	const changeStatus = async (e) => {
		e.preventDefault();
		setIsloading(true);
		
		const orderDetails = {
			userId: order.userId,
			email: order.email,
			orderDate: order.orderDate,
			orderTime: order.orderTime,
			orderAmount: order.orderAmount,
			orderStatus: status,
			cartItems: order.cartItems,
			shippingAddress: order.shippingAddress,
			createdAt: order.createdAt,
			editedAt: Timestamp.now().toDate(),
		};

		try {
			await setDoc(doc(db, "orders", orderId), orderDetails);
			setIsloading(false);
			toast.success(`Order status updated to ${status}`, toastConfig.success);
			navigate("/admin/orders");
		} catch (error) {
			toast.error(error.message, toastConfig.error);
			setIsloading(false);
		}
	};

	return (
		<>
			{isLoading && <Loader />}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="w-full max-w-md mx-auto"
			>
				<div className="bg-base-100 border border-base-300 p-6 space-y-6">
					{/* Header */}
					<div className="space-y-2">
						<h2 className="text-2xl font-serif text-neutral">Update Order Status</h2>
						<p className="text-neutral/60">Order ID: {orderId}</p>
					</div>

					{/* Status Selection */}
					<form onSubmit={changeStatus} className="space-y-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{statusOptions.map((option) => (
								<motion.label
									key={option.value}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className={`
										flex items-center gap-3 p-4 cursor-pointer border
										${status === option.value 
											? 'border-primary bg-primary/5 text-primary' 
											: 'border-base-300 hover:border-primary/30'}
										transition-colors duration-200
									`}
								>
									<input
										type="radio"
										name="status"
										value={option.value}
										checked={status === option.value}
										onChange={(e) => setStatus(e.target.value)}
										className="hidden"
									/>
									<span className="text-xl">{option.icon}</span>
									<span className="font-medium">{option.label}</span>
								</motion.label>
							))}
						</div>

						{/* Current Status */}
						<div className="p-4 bg-base-200/50 border border-base-300">
							<p className="text-sm text-neutral/60">Current Status</p>
							<p className="text-neutral font-medium mt-1">{order.orderStatus || "Not Set"}</p>
						</div>

						{/* Submit Button */}
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							type="submit"
							disabled={!status}
							className={`
								w-full p-4 flex items-center justify-center gap-2
								${status 
									? 'bg-primary text-primary-content hover:bg-primary-focus' 
									: 'bg-base-200 text-neutral/40 cursor-not-allowed'}
								transition-colors duration-200
							`}
						>
							<RiCheckboxCircleLine className="text-xl" />
							Update Status
						</motion.button>
					</form>
				</div>
			</motion.div>
		</>
	);
};

export default ChangeOrderStatus;
