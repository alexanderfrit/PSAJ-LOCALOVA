import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import { motion, useMotionValue, useTransform, useSpring, useAnimation } from "framer-motion";
import { RiShoppingBag3Line, RiEyeLine } from "react-icons/ri";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slice/cartSlice";

const TiltCard = ({ children }) => {
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const mouseXSpring = useSpring(x);
	const mouseYSpring = useSpring(y);

	const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
	const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

	const handleMouseMove = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		const xPct = mouseX / width - 0.5;
		const yPct = mouseY / height - 0.5;
		x.set(xPct);
		y.set(yPct);
	};

	const handleMouseLeave = () => {
		x.set(0);
		y.set(0);
	};

	return (
		<motion.div
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			style={{
				rotateX,
				rotateY,
				transformStyle: "preserve-3d",
			}}
			className="group relative will-change-transform"
		>
			<div style={{ transform: "translateZ(75px)" }}>
				{children}
			</div>
		</motion.div>
	);
};

const GridView = ({ products }) => {
	const dispatch = useDispatch();
	const [addingProductId, setAddingProductId] = useState(null);
	
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
		setAddingProductId(product.id);
		
		// Add to cart after slight delay for animation
		setTimeout(() => {
			dispatch(addToCart(product));
		}, 400);
		
		// Keep animation state for full duration
		// Don't reset until completely finished
		setTimeout(() => {
			setAddingProductId(null);
		}, 2500); // Extended animation duration
	};

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 perspective-1000">
			{products.map((product) => {
				const { id, imageURL, name, price } = product;
				const isAdding = addingProductId === id;
				
				return (
					<motion.div 
						key={id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						<TiltCard>
							<div className="relative bg-white border border-base-300 hover:border-primary/20 transition-colors duration-300">
								{/* Image Container */}
								<div className="relative aspect-[3/4] overflow-hidden bg-base-200">
									<LazyLoadImage
										src={imageURL}
										alt={name}
										className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
										effect="blur"
										placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23f8f8f8'/%3E%3C/svg%3E"
										threshold={300}
										width="100%"
										height="100%"
									/>
									
									{/* Quick Action Buttons */}
									<div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-neutral/80 via-neutral/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
										<div className="flex items-center justify-center gap-3">
											<Link 
												to={`/product-details/${id}`}
												className="bg-white p-3 hover:bg-primary hover:text-white transition-colors duration-200"
											>
												<RiEyeLine className="w-5 h-5" />
											</Link>
											<button
												onClick={() => !isAdding && add2CartFunction(product)}
												className="bg-white p-3 hover:bg-primary hover:text-white transition-colors duration-200"
											>
												<RiShoppingBag3Line className="w-5 h-5" />
											</button>
										</div>
									</div>
								</div>

								{/* Product Info */}
								<div className="p-6 space-y-4">
									{/* Title & Price */}
									<div className="space-y-2">
										<Link 
											to={`/product-details/${id}`}
											className="block font-serif text-lg text-neutral hover:text-primary transition-colors duration-200"
										>
											{name}
										</Link>
										<div className="flex items-center justify-between">
											<p className="text-lg font-medium text-primary">
												{formatPrice(price)}
											</p>
											<span className="text-xs text-neutral/60 uppercase tracking-wider">
												Free Delivery
											</span>
										</div>
									</div>

									{/* Add to Cart Button - Completely rebuilt animation */}
									<button
										onClick={() => !isAdding && add2CartFunction(product)}
										className={`relative w-full py-3 px-4 overflow-hidden h-12
											${isAdding ? 'bg-primary' : 'bg-neutral hover:bg-primary'} 
											text-white transition-colors duration-200 uppercase text-sm tracking-wider`}
										disabled={isAdding}
									>
										{isAdding ? (
											<>
												{/* Animation Container */}
												<div className="relative w-full h-full">
													{/* Shopping Bag Animation */}
													<motion.div 
														className="absolute inset-0 flex items-center justify-center"
														initial={{ x: "-100%" }}
														animate={{ x: ["-100%", "0%", "100%"] }}
														transition={{ 
															duration: 1.5, 
															times: [0, 0.5, 1],
															ease: "easeInOut"
														}}
													>
														<RiShoppingBag3Line className="w-6 h-6" />
													</motion.div>
													
													{/* Added Text - appears only after bag has passed */}
													<motion.div
														className="absolute inset-0 flex items-center justify-center"
														initial={{ opacity: 0 }}
														animate={{ opacity: [0, 0, 1] }}
														transition={{ 
															duration: 2,
															times: [0, 0.7, 1] // Only start appearing at 70% of animation
														}}
													>
														<span>Added!</span>
													</motion.div>
												</div>
											</>
										) : (
											<span>Add to Cart</span>
										)}
									</button>
								</div>
							</div>
						</TiltCard>
					</motion.div>
				);
			})}
		</div>
	);
};

export default React.memo(GridView);
