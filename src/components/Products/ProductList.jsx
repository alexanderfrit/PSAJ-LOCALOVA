import { useEffect, useState, useRef } from "react";
import { ListView, GridView, Search, ProductFilter, Pagination } from "../../components";
import { RiLayoutGridLine, RiListCheck2 } from "react-icons/ri";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { BiSortAlt2, BiCheck } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
// Redux
import { filterBySearch, sortProducts } from "../../redux/slice/filterSlice";
import { useDispatch, useSelector } from "react-redux";

const ProductList = ({ products }) => {
	const { filteredProducts } = useSelector((store) => store.filter);
	const [grid, setGrid] = useState(true);
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState("latest");
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);
	
	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [productPerPage] = useState(12);
	// Scroll To Top
	const [bacToTop, setBackToTop] = useState(false);
	const dispatch = useDispatch();

	// Sort options object for better readability
	const sortOptions = {
		"latest": "Latest Arrivals",
		"lowest-price": "Price: Low to High",
		"highest-price": "Price: High to Low",
		"a2z": "Name: A to Z",
		"z2a": "Name: Z to A"
	};

	//! Search
	useEffect(() => {
		dispatch(filterBySearch({ products, search }));
	}, [dispatch, products, search]);
	
	//! Sort
	useEffect(() => {
		dispatch(sortProducts({ products, sort }));
	}, [dispatch, products, sort]);

	useEffect(() => {
		const handleScroll = () => {
			setBackToTop(window.pageYOffset > 400);
		};
		
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}
		};
		
		window.addEventListener("scroll", handleScroll);
		document.addEventListener("mousedown", handleClickOutside);
		
		return () => {
			window.removeEventListener("scroll", handleScroll);
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleSortChange = (value) => {
		setSort(value);
		setIsDropdownOpen(false);
	};

	//get current product
	const indexOfLastProduct = currentPage * productPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productPerPage;
	const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

	return (
		<motion.div 
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="relative space-y-6"
		>
			{/* Control Bar */}
			<div className="bg-white border border-base-300">
				<div className="p-6 space-y-6">
					{/* Upper Section */}
					<div className="flex items-center justify-between border-b border-base-300 pb-6">
						<div className="flex items-center gap-4">
							<h2 className="font-serif text-2xl text-neutral">Our Collection</h2>
							<span className="text-sm text-neutral/60 font-medium">
								{filteredProducts.length} Products
							</span>
						</div>
						
						{/* View Toggle */}
						<div className="flex items-center gap-2 p-1 bg-base-200">
							<motion.button
								whileTap={{ scale: 0.98 }}
								onClick={() => setGrid(true)}
								className={`p-2.5 transition-all duration-200 ${
									grid ? 'bg-white text-primary shadow-sm' : 'text-neutral/60 hover:text-primary'
								}`}
							>
								<RiLayoutGridLine size={20} />
							</motion.button>
							<motion.button
								whileTap={{ scale: 0.98 }}
								onClick={() => setGrid(false)}
								className={`p-2.5 transition-all duration-200 ${
									!grid ? 'bg-white text-primary shadow-sm' : 'text-neutral/60 hover:text-primary'
								}`}
							>
								<RiListCheck2 size={20} />
							</motion.button>
						</div>
					</div>

					{/* Lower Section */}
					<div className="flex flex-wrap items-center gap-6">
						{/* Search */}
						<div className="flex-1 min-w-[280px]">
							<div className="relative">
								<input
									type="text"
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder="Search our collection..."
									className="w-full py-3 pl-4 pr-12 bg-base-200 border-0 focus:ring-1 focus:ring-primary/20 placeholder:text-neutral/40"
								/>
								<span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral/40">
									
								</span>
							</div>
						</div>

						{/* Custom Sort Dropdown */}
						<div className="relative" ref={dropdownRef}>
							<motion.button
								whileTap={{ scale: 0.98 }}
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								className="flex items-center gap-3 py-3 px-5 bg-base-200 focus:outline-none focus:ring-1 focus:ring-primary/20 min-w-[240px]"
							>
								<BiSortAlt2 className="text-neutral/60" size={22} />
								<span className="text-neutral flex-1 text-left">
									{sortOptions[sort]}
								</span>
								<motion.span
									animate={{ rotate: isDropdownOpen ? 180 : 0 }}
									transition={{ duration: 0.3 }}
									className="text-neutral/60"
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
									</svg>
								</motion.span>
							</motion.button>
							
							<AnimatePresence>
								{isDropdownOpen && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
										className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-base-200 shadow-lg"
									>
										{Object.entries(sortOptions).map(([value, label]) => (
											<motion.button
												key={value}
												whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
												whileTap={{ scale: 0.98 }}
												onClick={() => handleSortChange(value)}
												className="flex items-center justify-between w-full px-5 py-3 text-left hover:text-primary transition-colors duration-150"
											>
												<span>{label}</span>
												{sort === value && (
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
				</div>
			</div>

			{/* Products Grid/List */}
			<AnimatePresence mode="wait">
				<motion.div
					key={grid ? 'grid' : 'list'}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.3 }}
				>
					{grid ? (
						<GridView products={currentProducts} />
					) : (
						<ListView products={currentProducts} />
					)}
				</motion.div>
			</AnimatePresence>

			{/* Back to Top Button */}
			<AnimatePresence>
				{bacToTop && (
					<motion.button
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.5 }}
						onClick={scrollToTop}
						className="fixed bottom-8 right-8 z-50 p-3 bg-primary text-white shadow-lg hover:bg-primary-focus transition-colors"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
						</svg>
					</motion.button>
				)}
			</AnimatePresence>

			<Pagination
				productPerPage={productPerPage}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				totalProducts={filteredProducts.length}
			/>
		</motion.div>
	);
};

export default ProductList;

