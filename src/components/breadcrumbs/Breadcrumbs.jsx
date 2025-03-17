import React from "react";
import { Link, NavLink } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";
import { motion } from "framer-motion";

const Breadcrumbs = ({ type, checkout, stripe }) => {
	const activeLink = ({ isActive }) => 
		isActive 
			? "text-primary font-medium" 
			: "text-neutral/60 hover:text-primary transition-colors duration-200";

	const containerAnimation = {
		initial: { opacity: 0, y: -10 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.3 }
	};

	const itemAnimation = {
		initial: { opacity: 0, x: -10 },
		animate: { opacity: 1, x: 0 },
		transition: { duration: 0.3 }
	};

	return (
		<motion.nav 
			{...containerAnimation}
			className="bg-white border-b border-base-300 mt-20"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<ol className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
					<motion.li {...itemAnimation} className="flex items-center">
						<Link 
							to="/" 
							className="text-neutral/60 hover:text-primary transition-colors duration-200 font-medium"
						>
							Home
						</Link>
					</motion.li>

					<motion.li {...itemAnimation} className="flex items-center">
						<RiArrowRightSLine className="text-neutral/40 w-5 h-5" />
						<NavLink to="/all" className={activeLink}>
							Collection
						</NavLink>
					</motion.li>

					{type && (
						<motion.li {...itemAnimation} className="flex items-center">
							<RiArrowRightSLine className="text-neutral/40 w-5 h-5" />
							<NavLink to={{}} className={activeLink}>
								{type}
							</NavLink>
						</motion.li>
					)}

					{checkout && (
						<motion.li {...itemAnimation} className="flex items-center">
							<RiArrowRightSLine className="text-neutral/40 w-5 h-5" />
							<NavLink to={{}} className={activeLink}>
								{checkout}
							</NavLink>
						</motion.li>
					)}

					{stripe && (
						<motion.li {...itemAnimation} className="flex items-center">
							<RiArrowRightSLine className="text-neutral/40 w-5 h-5" />
							<NavLink to={{}} className={activeLink}>
								{stripe}
							</NavLink>
						</motion.li>
					)}
				</ol>

				{/* Current Page Indicator - Mobile */}
				<div className="mt-2 sm:hidden">
					<h1 className="text-lg font-medium text-neutral">
						{stripe || checkout || type || "Collection"}
					</h1>
				</div>
			</div>
		</motion.nav>
	);
};

export default Breadcrumbs;
