import React from "react";
import { useSelector } from "react-redux";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: "top",
			labels: {
				font: {
					family: "'Montserrat', sans-serif",
					weight: 500,
					size: 12,
				},
				padding: 24,
				color: "#2C3632", // neutral color
				usePointStyle: true,
				pointStyle: "rect", // sharp corners for luxury feel
			},
		},
		title: {
			display: true,
			text: "Order Status Distribution",
			font: {
				family: "'Cormorant', serif",
				size: 20,
				weight: 500,
			},
			color: "#2C3632", // neutral color
			padding: {
				top: 24,
				bottom: 16,
			},
		},
		tooltip: {
			backgroundColor: "#0B4D3C", // primary color
			titleFont: {
				family: "'Montserrat', sans-serif",
				size: 13,
				weight: 600,
			},
			bodyFont: {
				family: "'Montserrat', sans-serif",
				size: 12,
			},
			padding: 16,
			cornerRadius: 0, // sharp corners
			displayColors: false,
			titleSpacing: 8,
			bodySpacing: 6,
			callbacks: {
				label: function(context) {
					return `${context.parsed.y} Orders`;
				}
			}
		},
	},
	scales: {
		x: {
			grid: {
				display: false,
			},
			border: {
				color: "#EEF2F0", // base-300 color
				width: 2,
			},
			ticks: {
				font: {
					family: "'Montserrat', sans-serif",
					size: 12,
					weight: 500,
				},
				color: "#2C3632", // neutral color
				padding: 12,
			},
		},
		y: {
			border: {
				display: false,
			},
			grid: {
				color: "#EEF2F0", // base-300 color
				lineWidth: 1,
			},
			ticks: {
				font: {
					family: "'Montserrat', sans-serif",
					size: 12,
					weight: 500,
				},
				color: "#2C3632", // neutral color
				padding: 12,
				callback: function(value) {
					return value + ' Orders';
				}
			},
		},
	},
};

const Chart = () => {
	const { orderHistory } = useSelector((store) => store.order);

	// Create new Array of order status
	const filteredOrders = orderHistory.map((item) => item.orderStatus);

	// Count the occurrences of order status
	const getOrderCount = (arr, value) => {
		return arr.filter((item) => item === value).length;
	};

	const placed = getOrderCount(filteredOrders, "Order Placed");
	const processing = getOrderCount(filteredOrders, "Processing...");
	const shipped = getOrderCount(filteredOrders, "Item(s) Shipped");
	const delivered = getOrderCount(filteredOrders, "Item(s) Delivered");

	const data = {
		labels: ["Placed", "Processing", "Shipped", "Delivered"],
		datasets: [
			{
				label: "Orders",
				data: [placed, processing, shipped, delivered],
				backgroundColor: [
					"#0B4D3C", // primary
					"#739D8C", // secondary
					"#BFB69B", // accent
					"#527D6D", // success
				],
				borderWidth: 0,
				borderRadius: 0, // sharp corners
				barThickness: 40,
				maxBarThickness: 60,
			},
		],
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
			className="w-full h-full min-h-[400px] p-6"
		>
			<Bar 
				options={options} 
				data={data}
				className="w-full h-full"
			/>
		</motion.div>
	);
};

export default Chart;
