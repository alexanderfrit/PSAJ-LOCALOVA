import { useEffect, useState, useRef } from "react";
//  Utilities
import { getUniqueValues } from "../../utils/uniqueValues";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { filterByCategory, filterByBrand, filterByprice } from "../../redux/slice/filterSlice";
import { formatPrice } from "../../utils/formatPrice";
import { RiFilterLine, RiPriceTag3Line } from "react-icons/ri";
import { HiOutlineCube } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { BiCheck } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";

const ProductFilter = () => {
	const { products } = useSelector((store) => store.product);
	const { minPrice, maxPrice } = useSelector((store) => store.product);
	const dispatch = useDispatch();

	const [category, setCategory] = useState("All");
	const [brand, setBrand] = useState("All");
	const [price, setPrice] = useState(maxPrice);
	const [isOpen, setIsOpen] = useState(true);
	const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
	const brandDropdownRef = useRef(null);

	// Getting new Category and  brand Array
	const allCategories = getUniqueValues(products, "category");
	const allBrands = getUniqueValues(products, "brand");
	//! Categi
	const filterProducts = (c) => {
		setCategory(c);
		dispatch(filterByCategory({ products, category: c }));
	};
	//! Brand
	useEffect(() => {
		dispatch(filterByBrand({ products, brand }));
	}, [dispatch, products, brand]);

	//!Price
	useEffect(() => {
		dispatch(filterByprice({ products, price }));
	}, [dispatch, products, price]);

	// Handle outside clicks for brand dropdown
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target)) {
				setIsBrandDropdownOpen(false);
			}
		};
		
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	function clearFilter() {
		setCategory("All");
		setBrand("All");
		setPrice(maxPrice);
	}

	return (
		<div className="bg-white border border-gray-100">
			{/* Filter Header */}
			<div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
				<div className="flex items-center gap-3">
					<RiFilterLine className="text-xl text-primary" />
					<h2 className="font-semibold tracking-wide uppercase text-gray-800 text-sm">Refine</h2>
				</div>
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="text-gray-400 hover:text-primary transition-colors"
				>
					{isOpen ? <IoClose size={20} /> : <RiFilterLine size={20} />}
				</button>
			</div>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="overflow-hidden"
					>
						<div className="p-6 space-y-8">
							{/* Categories */}
							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<RiPriceTag3Line className="text-lg text-primary" />
									<h3 className="font-medium tracking-wide uppercase text-xs text-gray-500">Categories</h3>
								</div>
								<div className="grid gap-2">
									{allCategories.map((c, index) => (
										<motion.button
											key={index}
											whileTap={{ scale: 0.98 }}
											onClick={() => filterProducts(c)}
											className={`w-full text-left py-2 px-3 transition-all duration-200 ${
												category === c
													? "bg-primary/10 text-primary font-medium"
													: "hover:bg-gray-50 text-gray-600 hover:text-primary"
											}`}
										>
											{c}
										</motion.button>
									))}
								</div>
							</div>

							{/* Brand - New Custom Dropdown */}
							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<HiOutlineCube className="text-lg text-primary" />
									<h3 className="font-medium tracking-wide uppercase text-xs text-gray-500">Brand</h3>
								</div>
								<div className="relative" ref={brandDropdownRef}>
									<motion.button
										whileTap={{ scale: 0.98 }}
										onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
										className="w-full bg-white border border-gray-200 py-2.5 px-3 flex items-center justify-between hover:border-primary focus:border-primary focus:outline-none transition-colors"
									>
										<span className="text-gray-700">{brand}</span>
										<motion.span
											animate={{ rotate: isBrandDropdownOpen ? 180 : 0 }}
											transition={{ duration: 0.3 }}
											className="text-gray-500"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
											</svg>
										</motion.span>
									</motion.button>
									
									<AnimatePresence>
										{isBrandDropdownOpen && (
											<motion.div
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												transition={{ duration: 0.2 }}
												className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto"
											>
												{allBrands.map((b, index) => (
													<motion.button
														key={index}
														whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
														whileTap={{ scale: 0.98 }}
														onClick={() => {
															setBrand(b);
															setIsBrandDropdownOpen(false);
														}}
														className="flex items-center justify-between w-full px-3 py-2.5 text-left hover:text-primary transition-colors duration-150"
													>
														<span>{b}</span>
														{brand === b && (
															<motion.span
																initial={{ scale: 0 }}
																animate={{ scale: 1 }}
																className="text-primary"
															>
																<BiCheck size={20} />
															</motion.span>
														)}
													</motion.button>
												))}
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</div>

							{/* Price Range */}
							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<RiPriceTag3Line className="text-lg text-primary" />
									<h3 className="font-medium tracking-wide uppercase text-xs text-gray-500">Price Range</h3>
								</div>
								<div className="space-y-4">
									<p className="text-xl font-medium text-primary">{formatPrice(price)}</p>
									<input
										type="range"
										value={price}
										min={minPrice}
										max={maxPrice}
										onChange={(e) => setPrice(e.target.value)}
										className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-primary"
										step={(maxPrice - minPrice) / 100}
									/>
									<div className="flex justify-between text-sm text-gray-500">
										<span>{formatPrice(minPrice)}</span>
										<span>{formatPrice(maxPrice)}</span>
									</div>
								</div>
							</div>

							{/* Clear Filters Button */}
							<motion.button 
								whileTap={{ scale: 0.98 }}
								onClick={clearFilter}
								className="w-full px-4 py-2.5 bg-black text-white hover:bg-gray-900 transition-colors uppercase text-sm tracking-wider"
							>
								Reset Filters
							</motion.button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ProductFilter;
