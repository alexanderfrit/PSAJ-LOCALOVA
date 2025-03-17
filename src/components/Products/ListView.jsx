import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import { motion } from "framer-motion";
import { RiShoppingBag3Line, RiEyeLine } from "react-icons/ri";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slice/cartSlice";

const ListView = ({ products }) => {
	const dispatch = useDispatch();

	if (!products.length) {
		return (
			<motion.div 
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="flex flex-col items-center justify-center h-[400px] space-y-6"
			>
				<h1 className="font-serif text-3xl text-neutral/80">No Products Found</h1>
				<p className="text-neutral/60">Try adjusting your search or filters</p>
			</motion.div>
		);
	}

	const add2CartFunction = (product) => {
		dispatch(addToCart(product));
	};

	return (
		<div className="space-y-8">
			{products.map((product) => {
				const { id, imageURL, name, price, description, brand } = product;
				return (
					<motion.div
						key={id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className="group"
					>
						<div className="bg-white border border-base-300 hover:border-primary/20 transition-colors duration-300">
							<div className="flex flex-col lg:flex-row">
								{/* Image Section */}
								<div className="relative w-full lg:w-[400px]">
									<div className="aspect-[4/3] lg:aspect-[3/4] overflow-hidden bg-base-200">
										<LazyLoadImage
											src={imageURL}
											alt={name}
											className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
											effect="blur"
										/>
									</div>
									
									{/* Quick Action Buttons - Mobile */}
									<div className="absolute top-4 right-4 flex flex-col gap-2 lg:hidden">
										<Link 
											to={`/product-details/${id}`}
											className="bg-white/90 p-2.5 hover:bg-primary hover:text-white transition-colors duration-200"
										>
											<RiEyeLine className="w-5 h-5" />
										</Link>
										<button
											onClick={() => add2CartFunction(product)}
											className="bg-white/90 p-2.5 hover:bg-primary hover:text-white transition-colors duration-200"
										>
											<RiShoppingBag3Line className="w-5 h-5" />
										</button>
									</div>
								</div>

								{/* Content Section */}
								<div className="flex-1 p-6 lg:p-8 flex flex-col">
									{/* Product Info */}
									<div className="flex-1 space-y-4">
										<div className="space-y-1">
											<p className="text-sm font-medium text-primary uppercase tracking-wider">
												{brand}
											</p>
											<Link 
												to={`/product-details/${id}`}
												className="block font-serif text-2xl text-neutral hover:text-primary transition-colors duration-200"
											>
												{name}
											</Link>
										</div>

										<div className="flex items-center justify-between">
											<p className="text-xl font-medium text-primary">
												{formatPrice(price)}
											</p>
											<span className="text-xs text-neutral/60 uppercase tracking-wider">
												Free Delivery
											</span>
										</div>

										<p className="text-neutral/70 leading-relaxed line-clamp-3">
											{description}
										</p>
									</div>

									{/* Actions - Desktop */}
									<div className="hidden lg:flex items-center gap-4 mt-8">
										<motion.button
											whileTap={{ scale: 0.98 }}
											onClick={() => add2CartFunction(product)}
											className="flex-1 py-3 px-6 bg-neutral text-white hover:bg-primary transition-colors duration-200 uppercase text-sm tracking-wider"
										>
											Add to Cart
										</motion.button>
										<Link 
											to={`/product-details/${id}`}
											className="py-3 px-6 border border-neutral text-neutral hover:bg-neutral hover:text-white transition-colors duration-200 uppercase text-sm tracking-wider"
										>
											View Details
										</Link>
									</div>

									{/* Actions - Mobile */}
									<div className="flex lg:hidden items-center gap-4 mt-6">
										<motion.button
											whileTap={{ scale: 0.98 }}
											onClick={() => add2CartFunction(product)}
											className="flex-1 py-3 bg-neutral text-white hover:bg-primary transition-colors duration-200 uppercase text-sm tracking-wider"
										>
											Add to Cart
										</motion.button>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				);
			})}
		</div>
	);
};

export default React.memo(ListView);
