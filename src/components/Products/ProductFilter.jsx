import { useEffect, useState, useRef, useMemo } from "react";
//  Utilities
import { getUniqueValues } from "../../utils/uniqueValues";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { filterByCategory, filterByBrand, filterByPriceRange } from "../../redux/slice/filterSlice";
import { formatPrice } from "../../utils/formatPrice";
import { RiFilterLine, RiPriceTag3Line } from "react-icons/ri";
import { HiOutlineCube } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { BiCheck } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";

const ProductFilter = ({ isMobile = false }) => {
	const { products } = useSelector((store) => store.product);
	const { minPrice, maxPrice } = useSelector((store) => store.product);
	const dispatch = useDispatch();

	const [category, setCategory] = useState("All");
	const [brand, setBrand] = useState("All");
	const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
	const [isOpen, setIsOpen] = useState(!isMobile);
	const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
	const brandDropdownRef = useRef(null);
	const [showAllCategories, setShowAllCategories] = useState(false);
	const [categoryFilter, setCategoryFilter] = useState("");

	// Add this useEffect to properly set the initial price range
	// and update it whenever min/max price changes in Redux
	useEffect(() => {
		if (minPrice !== undefined && maxPrice !== undefined) {
			setPriceRange({ min: minPrice, max: maxPrice });
		}
	}, [minPrice, maxPrice]);

	// Getting new Category and brand Array
	const allCategories = getUniqueValues(products, "category");
	const allBrands = getUniqueValues(products, "brand");

	// Calculate price distribution histogram
	const priceHistogram = useMemo(() => {
		// Create 10 price buckets between min and max price
		const bucketCount = 10;
		const bucketSize = (maxPrice - minPrice) / bucketCount;
		const buckets = Array(bucketCount).fill(0);
		
		// Count products in each price bucket
		products.forEach(product => {
			const bucketIndex = Math.min(
				Math.floor((product.price - minPrice) / bucketSize),
				bucketCount - 1
			);
			buckets[bucketIndex]++;
		});
		
		// Calculate max count for visualization scaling
		const maxCount = Math.max(...buckets);
		
		// Generate bucket data with price range and count
		return buckets.map((count, index) => {
			const bucketStart = minPrice + (index * bucketSize);
			const bucketEnd = Math.min(bucketStart + bucketSize, maxPrice);
			
			return {
				range: [bucketStart, bucketEnd],
				count,
				percentage: maxCount > 0 ? count / maxCount : 0
			};
		});
	}, [products, minPrice, maxPrice]);
	
	// Calculate current min and max position for markers
	const minSliderPosition = useMemo(() => {
		return (priceRange.min - minPrice) / (maxPrice - minPrice);
	}, [priceRange.min, minPrice, maxPrice]);
	
	const maxSliderPosition = useMemo(() => {
		return (priceRange.max - minPrice) / (maxPrice - minPrice);
	}, [priceRange.max, minPrice, maxPrice]);

	// Handler for min price change
	const handleMinPriceChange = (e) => {
		const newMin = Number(e.target.value);
		// Ensure min doesn't exceed max
		if (newMin <= priceRange.max) {
			setPriceRange(prev => ({ ...prev, min: newMin }));
		}
	};

	// Handler for max price change
	const handleMaxPriceChange = (e) => {
		const newMax = Number(e.target.value);
		// Ensure max doesn't go below min
		if (newMax >= priceRange.min) {
			setPriceRange(prev => ({ ...prev, max: newMax }));
		}
	};

	//! Category
	const filterProducts = (c) => {
		setCategory(c);
		dispatch(filterByCategory({ products, category: c }));
	};
	
	//! Brand
	useEffect(() => {
		dispatch(filterByBrand({ products, brand }));
	}, [dispatch, products, brand]);

	//! Price Range - Updated to use min and max
	useEffect(() => {
		// Update your redux action to handle price range
		dispatch(filterByPriceRange({ products, minPrice: priceRange.min, maxPrice: priceRange.max }));
	}, [dispatch, products, priceRange.min, priceRange.max]);

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
		setPriceRange({ min: minPrice, max: maxPrice });
	}

	// Add this filtered categories logic
	const filteredCategories = useMemo(() => {
		if (!categoryFilter.trim()) return allCategories;
		
		return allCategories.filter(cat => 
			cat.toLowerCase().includes(categoryFilter.toLowerCase())
		);
	}, [allCategories, categoryFilter]);

	return (
		<div className="bg-white border border-gray-100">
			{/* Filter Header - Don't show toggle on mobile since we have the X button in the panel header */}
			<div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
				<div className="flex items-center gap-3">
					<RiFilterLine className="text-xl text-primary" />
					<h2 className="font-semibold tracking-wide uppercase text-gray-800 text-sm">Refine</h2>
				</div>
				{!isMobile && (
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="text-gray-400 hover:text-primary transition-colors"
					>
						{isOpen ? <IoClose size={20} /> : <RiFilterLine size={20} />}
					</button>
				)}
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
							{/* Categories - Improved UX */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<RiPriceTag3Line className="text-lg text-primary" />
										<h3 className="font-medium tracking-wide uppercase text-xs text-gray-500">Categories</h3>
									</div>
									{allCategories.length > 6 && (
										<button
											onClick={() => setShowAllCategories(!showAllCategories)}
											className="text-xs text-primary hover:text-primary-focus transition-colors"
										>
											{showAllCategories ? "Show Less" : "Show All"}
										</button>
									)}
								</div>

								{/* Category search */}
								{allCategories.length > 8 && (
									<div className="relative">
										<input
											type="text"
											value={categoryFilter}
											onChange={(e) => setCategoryFilter(e.target.value)}
											placeholder="Search categories..."
											className="w-full py-2 px-3 border border-base-300 focus:border-primary focus:outline-none text-neutral bg-white text-sm"
										/>
										<div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral/40">
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
											</svg>
										</div>
									</div>
								)}

								{/* Categories grid layout */}
								<motion.div
									className={`grid ${showAllCategories ? 'gap-2' : 'gap-1.5'}`}
									style={{ 
										gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
										maxHeight: showAllCategories ? '1000px' : '180px',
										overflow: 'hidden',
										transition: 'max-height 0.3s ease-in-out'
									}}
								>
									{/* "All" category always first */}
									<motion.button
										whileTap={{ scale: 0.98 }}
										onClick={() => filterProducts("All")}
										className={`w-full text-left py-2 px-3 transition-all duration-200 ${
											category === "All"
												? "bg-primary text-white font-medium"
												: "border border-neutral/10 hover:border-primary text-neutral hover:text-primary"
										}`}
									>
										All Products
									</motion.button>
									
									{/* Filtered categories */}
									{filteredCategories.map((c, index) => (
										c !== "All" && (
											<motion.button
												key={index}
												whileTap={{ scale: 0.98 }}
												onClick={() => filterProducts(c)}
												className={`w-full text-left py-2 px-3 truncate transition-all duration-200 ${
													category === c
														? "bg-primary text-white font-medium" 
														: "border border-neutral/10 hover:border-primary text-neutral hover:text-primary"
												}`}
											>
												{c}
											</motion.button>
										)
									))}
								</motion.div>
								
								{/* Category count indicator */}
								{allCategories.length > 6 && !showAllCategories && (
									<div className="text-xs text-neutral/50 text-right">
										{filteredCategories.length} categories available
									</div>
								)}
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

							{/* Price Range - Luxury Design */}
							<div className="space-y-5">
								<div className="flex items-center gap-2">
									<RiPriceTag3Line className="text-lg text-primary" />
									<h3 className="font-medium tracking-wide uppercase text-xs text-gray-500">Price Range</h3>
								</div>
								
								{/* Price display */}
								<div className="flex justify-between items-center border-b border-base-300 pb-2">
									<p className="text-lg font-serif text-primary">{formatPrice(priceRange.min)}</p>
									<span className="h-px w-8 bg-accent mx-2"></span>
									<p className="text-lg font-serif text-primary">{formatPrice(priceRange.max)}</p>
								</div>
								
								{/* Price Histogram Chart */}
								<div className="pt-1 pb-6">
									<div className="flex h-20 items-end space-x-0.5 mb-8">
										{priceHistogram.map((bucket, index) => (
											<motion.div
												key={index}
												initial={{ height: 0 }}
												animate={{ height: `${Math.max(bucket.percentage * 100, 3)}%` }}
												className={`flex-1 ${
													bucket.range[0] >= priceRange.min && bucket.range[1] <= priceRange.max
														? "bg-primary" 
														: (bucket.range[0] < priceRange.min && bucket.range[1] > priceRange.min) ||
														  (bucket.range[0] < priceRange.max && bucket.range[1] > priceRange.max)
														? "bg-primary/40" 
														: "bg-neutral/10"
												}`}
												title={`${bucket.count} products between ${formatPrice(bucket.range[0])} - ${formatPrice(bucket.range[1])}`}
											>
												<div className="w-full h-full relative group">
													<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral text-white text-xs py-1 px-2 whitespace-nowrap z-10">
														{bucket.count} products
													</div>
												</div>
											</motion.div>
										))}
									</div>
									
									{/* Dual range slider - simplified structure */}
									<div className="relative h-12">
										{/* Track background */}
										<div className="absolute w-full h-1 bg-neutral/10 top-0">
											{/* Active range track */}
											<div 
												className="absolute h-full bg-primary"
												style={{
													left: `${minSliderPosition * 100}%`,
													right: `${100 - (maxSliderPosition * 100)}%`
												}}
											/>
										</div>
										
										{/* Min thumb - square design */}
										<div
											className="absolute w-4 h-4 border border-base-300 bg-primary shadow-md cursor-pointer top-0 -mt-1.5 -translate-x-1/2 z-20 hover:brightness-110 transition-all"
											style={{ left: `${minSliderPosition * 100}%` }}
											onMouseDown={(e) => {
												e.preventDefault();
												const startX = e.clientX;
												const startMin = priceRange.min;
												const range = maxPrice - minPrice;
												const sliderWidth = e.target.parentElement.offsetWidth;
												
												const handleMouseMove = (moveEvent) => {
													const deltaX = moveEvent.clientX - startX;
													const deltaPct = deltaX / sliderWidth;
													const deltaPrice = deltaPct * range;
													const newMin = Math.max(
														minPrice,
														Math.min(priceRange.max - 1000, startMin + deltaPrice)
													);
													setPriceRange(prev => ({ ...prev, min: Number(newMin.toFixed(0)) }));
												};
												
												const handleMouseUp = () => {
													document.removeEventListener('mousemove', handleMouseMove);
													document.removeEventListener('mouseup', handleMouseUp);
												};
												
												document.addEventListener('mousemove', handleMouseMove);
												document.addEventListener('mouseup', handleMouseUp);
											}}
										/>
										
										{/* Max thumb - square design */}
										<div
											className="absolute w-4 h-4 border border-base-300 bg-primary shadow-md cursor-pointer top-0 -mt-1.5 -translate-x-1/2 z-20 hover:brightness-110 transition-all"
											style={{ left: `${maxSliderPosition * 100}%` }}
											onMouseDown={(e) => {
												e.preventDefault();
												const startX = e.clientX;
												const startMax = priceRange.max;
												const range = maxPrice - minPrice;
												const sliderWidth = e.target.parentElement.offsetWidth;
												
												const handleMouseMove = (moveEvent) => {
													const deltaX = moveEvent.clientX - startX;
													const deltaPct = deltaX / sliderWidth;
													const deltaPrice = deltaPct * range;
													const newMax = Math.min(
														maxPrice,
														Math.max(priceRange.min + 1000, startMax + deltaPrice)
													);
													setPriceRange(prev => ({ ...prev, max: Number(newMax.toFixed(0)) }));
												};
												
												const handleMouseUp = () => {
													document.removeEventListener('mousemove', handleMouseMove);
													document.removeEventListener('mouseup', handleMouseUp);
												};
												
												document.addEventListener('mousemove', handleMouseMove);
												document.addEventListener('mouseup', handleMouseUp);
											}}
										/>
										
										{/* Price input fields with luxury styling */}
										<div className="pt-8 flex gap-3">
											<div className="flex-1">
												<div className="relative">
													<input
														type="number"
														value={priceRange.min}
														min={minPrice}
														max={priceRange.max - 1}
														onChange={(e) => {
															const value = Math.max(minPrice, Math.min(priceRange.max - 1, Number(e.target.value)));
															setPriceRange(prev => ({ ...prev, min: value }));
														}}
														className="w-full py-2 px-3 border border-base-300 focus:border-primary focus:outline-none text-neutral bg-white font-medium text-sm"
													/>
													<label className="absolute -top-2 left-2 px-1 text-xs text-neutral/60 bg-white">
														Min Price
													</label>
												</div>
											</div>
											<div className="flex-1">
												<div className="relative">
													<input
														type="number"
														value={priceRange.max}
														min={priceRange.min + 1}
														max={maxPrice}
														onChange={(e) => {
															const value = Math.min(maxPrice, Math.max(priceRange.min + 1, Number(e.target.value)));
															setPriceRange(prev => ({ ...prev, max: value }));
														}}
														className="w-full py-2 px-3 border border-base-300 focus:border-primary focus:outline-none text-neutral bg-white font-medium text-sm"
													/>
													<label className="absolute -top-2 left-2 px-1 text-xs text-neutral/60 bg-white">
														Max Price
													</label>
												</div>
											</div>
										</div>
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
