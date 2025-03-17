import { RiAdminLine, RiDashboardLine, RiShoppingBag3Line, RiAddLine, RiFileList3Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const AdminSidebar = ({ onClose }) => {
	const { userName } = useSelector((store) => store.auth);

	const navItems = [
		{ path: "/admin/home", icon: <RiDashboardLine className="w-6 h-6" />, label: "Dashboard" },
		{ path: "/admin/all-products", icon: <RiShoppingBag3Line className="w-6 h-6" />, label: "Products" },
		{ path: "/admin/add-product/ADD", icon: <RiAddLine className="w-6 h-6" />, label: "Add Product" },
		{ path: "/admin/orders", icon: <RiFileList3Line className="w-6 h-6" />, label: "Orders" },
	];

	return (
		<div className="h-full flex flex-col bg-base-100">
			{/* Profile Header */}
			<motion.div 
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="relative h-48 bg-primary overflow-hidden"
			>
				{/* Decorative Elements */}
				<div className="absolute inset-0 opacity-20">
					<div className="absolute transform rotate-45 -translate-y-1/2 -translate-x-1/2 bg-primary-content/10 w-48 h-48" />
					<div className="absolute right-0 bottom-0 transform rotate-45 translate-y-1/2 translate-x-1/2 bg-primary-content/10 w-48 h-48" />
				</div>

				<div className="relative h-full flex flex-col items-center justify-center p-6 space-y-3">
					<div className="p-3 bg-primary-content/10 backdrop-blur-sm">
						<RiAdminLine className="w-12 h-12 text-primary-content" />
					</div>
					<h1 className="text-xl font-bold text-primary-content tracking-wider">
						{userName}
					</h1>
					<p className="text-sm text-primary-content/80 uppercase tracking-wider">
						Administrator
					</p>
				</div>
			</motion.div>

			{/* Navigation */}
			<nav className="flex-1 py-8 px-4 overflow-y-auto">
				<div className="space-y-2">
					{navItems.map((item, index) => (
						<motion.div
							key={item.path}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.1 }}
						>
							<NavLink
								to={item.path}
								onClick={onClose}
								className={({ isActive }) => `
									group flex items-center gap-4 p-4 transition-all duration-300
									${isActive 
										? 'bg-primary/10 text-primary border-l-4 border-primary' 
										: 'text-neutral hover:bg-base-200 hover:text-primary border-l-4 border-transparent'
									}
								`}
							>
								<span className="transition-transform duration-300 group-hover:scale-110">
									{item.icon}
								</span>
								<span className="font-medium tracking-wide">{item.label}</span>
							</NavLink>
						</motion.div>
					))}
				</div>
			</nav>

			{/* Footer */}
			<div className="p-4 border-t border-base-300">
				<p className="text-xs text-neutral/60 text-center">
					Admin Dashboard v1.0
				</p>
			</div>
		</div>
	);
};

export default AdminSidebar;
