import { useEffect } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import { 
	RiShoppingCartLine, 
	RiDeleteBinLine, 
	RiArrowLeftSLine, 
	RiArrowRightSLine,
	RiCloseLine,
	RiShoppingBag3Line,
	RiSecurePaymentLine
} from "react-icons/ri";
// Redux
import { useDispatch, useSelector } from "react-redux";
import {
	addToCart,
	decreaseCart,
	removeCartItem,
	clearCart,
	calculateSubtotal,
	calculateTotalQuantity,
} from "../../redux/slice/cartSlice";
// Lazy load
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
	const { cartItems, totalAmount, totalQuantity } = useSelector((store) => store.cart);
	const { isUserLoggedIn } = useSelector((store) => store.auth);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(calculateSubtotal());
		dispatch(calculateTotalQuantity());
	}, [dispatch, cartItems]);

	return (
		<motion.main 
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-base-100 pt-36 sm:pt-36"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
				

				{/* Empty Cart State */}
				{!cartItems.length ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="bg-white border border-base-300"
					>
						<div className="flex flex-col items-center justify-center py-16 sm:py-20">
							<motion.div
								initial={{ scale: 0.9, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ duration: 0.5 }}
								className="relative mb-8"
							>
								<div className="w-24 h-24 sm:w-28 sm:h-28 border border-primary/10 flex items-center justify-center">
									<RiShoppingBag3Line className="w-12 h-12 sm:w-14 sm:h-14 text-primary/20" />
								</div>
								<div className="absolute -bottom-2 -right-2 w-8 h-8 border border-primary/30 bg-white"></div>
							</motion.div>
							
							<h2 className="font-serif text-xl sm:text-2xl text-neutral mb-4">
								Your Cart Awaits Refinement
							</h2>
							<p className="text-neutral/60 max-w-md text-center mb-8">
								Discover our curated collection of elegant furniture pieces designed to elevate your living space.
							</p>
							
							<Link 
								to="/all" 
								className="px-10 py-3 bg-primary text-white hover:bg-primary-focus transition-colors group flex items-center gap-3"
							>
								<span className="uppercase tracking-wider text-sm font-medium">Explore Collection</span>
								<RiArrowRightSLine className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
							</Link>
						</div>
					</motion.div>
				) : (
					<motion.div 
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="space-y-8"
					>
						<div className="flex flex-col xl:flex-row gap-8">
							{/* Cart Items Section */}
							<div className="flex-1 space-y-6">
								<div className="bg-white border border-base-300">
									<div className="px-6 py-5 border-b border-base-300 flex items-center justify-between">
										<h2 className="font-serif text-xl text-neutral">
											Your Selection <span className="text-primary">({totalQuantity})</span>
										</h2>
										<button
											onClick={() => dispatch(clearCart())}
											className="text-sm text-neutral/60 hover:text-primary transition-colors flex items-center gap-1 group"
										>
											<RiCloseLine className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
											<span className="hidden sm:inline">Clear All</span>
										</button>
									</div>

									{/* Cart Items List */}
									<div className="divide-y divide-base-300">
										<AnimatePresence>
											{cartItems.map((item, index) => {
												const { imageURL, name, price, qty, id } = item;
												return (
													<motion.div
														key={id}
														initial={{ opacity: 0 }}
														animate={{ 
															opacity: 1,
															transition: { delay: index * 0.1 }
														}}
														exit={{ 
															opacity: 0,
															x: -30,
															transition: { duration: 0.2 }
														}}
														className="p-4 sm:p-6"
													>
														<div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
															{/* Product Image */}
															<Link 
																to={`/product-details/${id}`} 
																className="shrink-0 w-full sm:w-24 h-40 sm:h-24 bg-base-200/30 overflow-hidden group"
															>
																<div className="w-full h-full overflow-hidden">
																	<LazyLoadImage
																		src={imageURL}
																		alt={name}
																		className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
																		effect="blur"
																	/>
																</div>
															</Link>

															<div className="flex-1 flex flex-col">
																{/* Product Info */}
																<div className="flex items-start justify-between mb-auto">
																	<div>
																		<Link 
																			to={`/product-details/${id}`}
																			className="font-serif text-lg text-neutral hover:text-primary transition-colors line-clamp-2"
																		>
																			{name}
																		</Link>
																		<p className="text-primary font-medium mt-1">
																			{formatPrice(price)}
																		</p>
																	</div>
																	
																	<button
																		onClick={() => dispatch(removeCartItem(item))}
																		className="text-neutral/40 hover:text-primary transition-colors p-2 -mt-1 -mr-1"
																	>
																		<RiDeleteBinLine className="w-5 h-5" />
																	</button>
																</div>

																{/* Quantity Controls */}
																<div className="flex items-center justify-between mt-4 pt-3 border-t border-base-300/50">
																	<div className="flex h-10 border border-base-300 group">
																		<button
																			onClick={() => dispatch(decreaseCart(item))}
																			className="w-10 h-full flex items-center justify-center text-neutral/60 hover:bg-primary hover:text-white group-hover:border-primary transition-colors border-r border-base-300"
																		>
																			<RiArrowLeftSLine className="w-5 h-5" />
																		</button>
																		<div className="w-12 h-full flex items-center justify-center font-medium text-neutral">
																			{qty}
																		</div>
																		<button
																			onClick={() => dispatch(addToCart(item))}
																			className="w-10 h-full flex items-center justify-center text-neutral/60 hover:bg-primary hover:text-white group-hover:border-primary transition-colors border-l border-base-300"
																		>
																			<RiArrowRightSLine className="w-5 h-5" />
																		</button>
																	</div>

																	<p className="text-lg font-medium text-neutral">
																		{formatPrice(price * qty)}
																	</p>
																</div>
															</div>
														</div>
													</motion.div>
												);
											})}
										</AnimatePresence>
									</div>
								</div>
								
								{/* Mobile Continue Shopping Link */}
								<div className="xl:hidden">
									<Link 
										to="/all" 
										className="flex items-center justify-center gap-2 py-3 border border-neutral/20 hover:border-primary hover:text-primary transition-colors w-full text-sm tracking-wider uppercase"
									>
										<RiShoppingBag3Line className="w-4 h-4" />
										Continue Shopping
									</Link>
								</div>
							</div>

							{/* Order Summary Section */}
							<div className="xl:w-96 w-full">
								<motion.div 
									initial={{ y: 20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ delay: 0.2 }}
									className="sticky top-28 bg-white border border-base-300"
								>
									<div className="px-6 py-5 border-b border-base-300">
										<h2 className="font-serif text-xl text-neutral">
											Order Summary
										</h2>
									</div>
									
									<div className="p-6 space-y-6">
										{/* Summary Items */}
										<div className="space-y-4">
											<div className="flex justify-between text-neutral/80">
												<span>Items</span>
												<span className="font-medium">{totalQuantity}</span>
											</div>
											
											<div className="pt-4 border-t border-base-300 flex justify-between items-end">
												<span className="text-neutral font-medium">Subtotal</span>
												<span className="text-xl font-serif text-primary">
													{formatPrice(totalAmount)}
												</span>
											</div>
										</div>

										{/* Checkout Actions */}
										<div className="pt-6 border-t border-base-300 space-y-4">
											{isUserLoggedIn ? (
												<Link 
													to="/checkout-details" 
													className="flex items-center justify-center gap-2 py-4 bg-primary text-white hover:bg-primary-focus transition-colors w-full group"
												>
													<RiSecurePaymentLine className="w-5 h-5" />
													<span className="text-sm tracking-wider uppercase font-medium">Secure Checkout</span>
												</Link>
											) : (
												<label
													htmlFor="my-modal-4"
													className="flex items-center justify-center gap-2 py-4 bg-primary text-white hover:bg-primary-focus transition-colors w-full cursor-pointer group"
												>
													<RiSecurePaymentLine className="w-5 h-5" />
													<span className="text-sm tracking-wider uppercase font-medium">Sign In to Checkout</span>
												</label>
											)}

											{/* Desktop Continue Shopping Link */}
											<div className="hidden xl:block">
												<Link 
													to="/all" 
													className="flex items-center justify-center gap-2 py-3 border border-neutral/20 hover:border-primary hover:text-primary transition-colors w-full text-sm tracking-wider uppercase"
												>
													<RiShoppingBag3Line className="w-4 h-4" />
													Continue Shopping
												</Link>
											</div>
										</div>
										
										{/* Satisfaction Guarantee */}
										<div className="pt-6 border-t border-base-300">
											<div className="flex items-center gap-3 text-neutral/60">
												<div className="w-10 h-10 border border-primary/20 flex items-center justify-center flex-shrink-0">
													<div className="w-5 h-5 border border-primary/30"></div>
												</div>
												<div>
													<p className="text-xs uppercase tracking-wider font-medium">Satisfaction Guaranteed</p>
													<p className="text-xs mt-1">30-day money back guarantee</p>
												</div>
											</div>
										</div>
									</div>
								</motion.div>
							</div>
						</div>
					</motion.div>
				)}
			</div>
		</motion.main>
	);
};

export default Cart;
