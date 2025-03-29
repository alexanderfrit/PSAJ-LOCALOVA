import React, { useEffect } from "react";
import { InfoBox, Chart } from "../../components";
import { RiMoneyDollarCircleLine, RiShoppingBag3Line, RiFileList3Line, RiBarChartLine, RiArrowUpLine } from "react-icons/ri";
import { formatPrice } from "../../utils/formatPrice";
import { useSelector, useDispatch } from "react-redux";
import { totalOrderAmount, storeOrders } from "../../redux/slice/orderSlice";
import useFetchCollection from "../../hooks/useFetchCollection";
import { motion } from "framer-motion";

const AdminHome = () => {
	const { data } = useFetchCollection("orders");
	const { products } = useSelector((store) => store.product);
	const { orderHistory, totalAmount } = useSelector((store) => store.order);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(storeOrders(data));
		dispatch(totalOrderAmount());
	}, [dispatch, data]);

	const statsCards = [
		{
			title: "Total Revenue",
			count: formatPrice(totalAmount),
			icon: <RiMoneyDollarCircleLine className="w-8 h-8" />,
			bgGradient: "from-primary/10 to-primary/5",
		},
		{
			title: "Products",
			count: products.length,
			icon: <RiShoppingBag3Line className="w-8 h-8" />,
			bgGradient: "from-secondary/10 to-secondary/5",
		},
		{
			title: "Orders",
			count: orderHistory.length,
			icon: <RiFileList3Line className="w-8 h-8" />,
			bgGradient: "from-accent/10 to-accent/5",
		},
	];

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-8 pt-4 sm:pt-6"
		>
			{/* Header Section */}
			<div className="flex items-center justify-between">
				<motion.div
					initial={{ x: -20 }}
					animate={{ x: 0 }}
					className="space-y-1"
				>
					<h1 className="text-2xl sm:text-3xl font-serif text-neutral">
						Welcome Back, Administrator
					</h1>
					<p className="text-neutral/60">
						Here's what's happening with your store today
					</p>
				</motion.div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{statsCards.map((card, index) => (
					<motion.div
						key={card.title}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						className={`bg-gradient-to-br ${card.bgGradient} border border-base-300 p-6`}
					>
						<div className="flex items-center justify-between mb-4">
							<div className="p-3 bg-white/80 backdrop-blur-sm border border-base-300">
								{card.icon}
							</div>
						</div>
						<div className="space-y-2">
							<h3 className="text-neutral/60 text-sm uppercase tracking-wider">
								{card.title}
							</h3>
							<p className="text-2xl sm:text-3xl font-serif text-neutral">
								{card.count}
							</p>
						</div>
					</motion.div>
				))}
			</div>

			{/* Chart Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="bg-white border border-base-300"
			>
				<div className="p-6 border-b border-base-300">
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<h2 className="text-xl font-serif text-neutral">Revenue Analytics</h2>
							<p className="text-neutral/60 text-sm">Monthly revenue breakdown</p>
						</div>
						<div className="p-2 bg-base-200/50">
							<RiBarChartLine className="w-6 h-6 text-primary" />
						</div>
					</div>
				</div>
				<div className="p-6">
					<div className="h-[400px]">
						<Chart />
					</div>
				</div>
			</motion.div>

			{/* Recent Activity */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="bg-white border border-base-300"
			>
				<div className="p-6 border-b border-base-300">
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<h2 className="text-xl font-serif text-neutral">Recent Orders</h2>
							<p className="text-neutral/60 text-sm">Latest customer orders</p>
						</div>
					</div>
				</div>
				<div className="p-6">
					{orderHistory.slice(0, 5).map((order, index) => (
						<motion.div
							key={order.id}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.1 }}
							className="flex items-center justify-between py-4 border-b border-base-300 last:border-0"
						>
							<div className="space-y-1">
								<p className="font-medium text-neutral">
									Order #{order.id.slice(0, 8)}
								</p>
								<p className="text-sm text-neutral/60">
									{order.orderDate}
								</p>
							</div>
							<div className="text-right">
								<p className="font-serif text-primary">
									{formatPrice(order.orderAmount)}
								</p>
								<p className={`text-sm ${
									order.orderStatus === "Delivered" 
										? "text-success" 
										: order.orderStatus === "Processing" 
											? "text-warning" 
											: "text-info"
								}`}>
									{order.orderStatus}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</motion.div>
		</motion.div>
	);
};

export default AdminHome;
