import React, { useEffect, useState } from "react";
import { Breadcrumbs, ProductFilter, ProductList } from "../../components";
import Loader from "../../components/loader/Loader";
import { RiFilterLine, RiCloseLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

// custom Hook
import useFetchCollection from "../../hooks/useFetchCollection";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { storeProducts, getPriceRange } from "../../redux/slice/productSlice";

const Allproducts = () => {
	const { data, isLoading } = useFetchCollection("products");
	const dispatch = useDispatch();
	const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
	
	useEffect(() => {
		dispatch(storeProducts({ products: data }));
		dispatch(getPriceRange({ products: data }));
	}, [dispatch, data]);

	const { products } = useSelector((store) => store.product);
	
	// Close filter panel when clicking outside on mobile
	const handleOverlayClick = (e) => {
		if (e.target === e.currentTarget) {
			setIsMobileFilterOpen(false);
		}
	};

	return (
		<>
			{isLoading && <Loader />}
			<main className="w-full">
				<Breadcrumbs />
				<section className="w-full mx-auto p-4 md:p-10 max-w-[1920px] md:px-6 flex h-full relative">
					{/* Desktop Filter - Hidden on mobile */}
					<aside className="hidden sm:block sm:w-72 mx-2">
						<ProductFilter />
					</aside>
					
					{/* Main Product List */}
					<article className="flex-1">
						<ProductList products={products} />
					</article>
					
					{/* Mobile Filter Button - Only visible on small screens */}
					<div className="sm:hidden">
						<motion.button
							whileTap={{ scale: 0.95 }}
							onClick={() => setIsMobileFilterOpen(true)}
							className="fixed bottom-8 right-8 z-40 p-4 bg-primary text-white shadow-lg"
						>
							<RiFilterLine className="w-5 h-5" />
						</motion.button>
					</div>
					
					{/* Mobile Filter Panel */}
					<AnimatePresence>
						{isMobileFilterOpen && (
							<motion.div 
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="fixed inset-0 bg-neutral/50 z-50 sm:hidden flex justify-end"
								onClick={handleOverlayClick}
							>
								<motion.div
									initial={{ x: "100%" }}
									animate={{ x: 0 }}
									exit={{ x: "100%" }}
									transition={{ type: "tween", duration: 0.25 }}
									className="w-[85%] max-w-sm bg-white h-full overflow-y-auto"
								>
									<div className="sticky top-0 bg-white z-10 flex justify-between items-center px-6 py-4 border-b border-base-300">
										<h2 className="font-serif text-lg text-neutral">Filter Products</h2>
										<button 
											onClick={() => setIsMobileFilterOpen(false)}
											className="p-2 text-neutral/60 hover:text-primary"
										>
											<RiCloseLine className="w-5 h-5" />
										</button>
									</div>
									
									<div className="p-2">
										<ProductFilter />
									</div>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>
				</section>
			</main>
		</>
	);
};

export default Allproducts;
