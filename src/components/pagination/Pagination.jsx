import React from "react";
import { motion } from "framer-motion";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

const Pagination = ({ productPerPage, currentPage, setCurrentPage, totalProducts }) => {
	const totalPages = Math.ceil(totalProducts / productPerPage);
	
	// Don't render pagination if there's only one page
	if (totalPages <= 1) return null;

	function prevPage() {
		setCurrentPage((prev) => (prev <= 1 ? prev : prev - 1));
	}

	function nextPage() {
		setCurrentPage((prev) => (prev >= totalPages ? prev : prev + 1));
	}

	// Generate page numbers to display
	const getPageNumbers = () => {
		const delta = 2; // Number of pages to show on each side of current page
		const range = [];
		for (
			let i = Math.max(2, currentPage - delta);
			i <= Math.min(totalPages - 1, currentPage + delta);
			i++
		) {
			range.push(i);
		}

		if (currentPage - delta > 2) {
			range.unshift("...");
		}
		if (currentPage + delta < totalPages - 1) {
			range.push("...");
		}

		range.unshift(1);
		if (totalPages !== 1) {
			range.push(totalPages);
		}

		return range;
	};

	return (
		<motion.div 
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="w-full flex flex-col items-center gap-6 mt-12"
		>
			{/* Page Navigation */}
			<div className="flex items-center gap-2">
				{/* Previous Button */}
				<motion.button
					whileTap={{ scale: 0.98 }}
					onClick={prevPage}
					disabled={currentPage <= 1}
					className={`p-3 border ${
						currentPage <= 1
							? 'border-base-300 text-neutral/40 cursor-not-allowed'
							: 'border-base-300 text-neutral hover:border-primary hover:text-primary'
					} transition-colors duration-200`}
				>
					<RiArrowLeftSLine className="w-5 h-5" />
				</motion.button>

				{/* Page Numbers */}
				<div className="hidden sm:flex items-center gap-2">
					{getPageNumbers().map((pageNum, index) => (
						<React.Fragment key={index}>
							{pageNum === "..." ? (
								<span className="w-10 text-center text-neutral/40 font-serif">...</span>
							) : (
								<motion.button
									whileTap={{ scale: 0.98 }}
									onClick={() => setCurrentPage(pageNum)}
									className={`min-w-[40px] h-[48px] border ${
										currentPage === pageNum
											? 'bg-primary border-primary text-white'
											: 'border-base-300 text-neutral hover:border-primary hover:text-primary'
									} transition-colors duration-200 font-medium`}
								>
									{pageNum}
								</motion.button>
							)}
						</React.Fragment>
					))}
				</div>

				{/* Mobile Page Indicator */}
				<div className="sm:hidden flex items-center gap-2">
					<span className="px-4 py-3 border border-base-300 font-medium">
						{currentPage} / {totalPages}
					</span>
				</div>

				{/* Next Button */}
				<motion.button
					whileTap={{ scale: 0.98 }}
					onClick={nextPage}
					disabled={currentPage >= totalPages}
					className={`p-3 border ${
						currentPage >= totalPages
							? 'border-base-300 text-neutral/40 cursor-not-allowed'
							: 'border-base-300 text-neutral hover:border-primary hover:text-primary'
					} transition-colors duration-200`}
				>
					<RiArrowRightSLine className="w-5 h-5" />
				</motion.button>
			</div>

			{/* Page Info */}
			<div className="text-sm text-neutral/60">
				<span className="hidden sm:inline">
					Page <span className="text-primary font-medium">{currentPage}</span> of{" "}
					<span className="text-primary font-medium">{totalPages}</span>
				</span>
				<span className="sm:hidden">
					Showing page {currentPage} of {totalPages}
				</span>
			</div>
		</motion.div>
	);
};

export default Pagination;
