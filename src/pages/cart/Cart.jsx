import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../../components";
import { formatPrice } from "../../utils/formatPrice";
import { BiTrash } from "react-icons/bi";
import { FaShoppingCart } from "react-icons/fa";
import emptyCart from "../../assets/empty-cart.png";
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
// lazy load
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
	RiShoppingCartLine, 
	RiDeleteBin6Line, 
	RiArrowLeftSLine, 
	RiArrowRightSLine,
	RiCloseLine
} from "react-icons/ri";

const QuantityControl = ({ qty, onDecrease, onIncrease }) => {
	return (
		<div className="flex items-center h-9 border rounded-lg overflow-hidden">
			<button
				onClick={onDecrease}
				className="w-9 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors border-r"
			>
				<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
				</svg>
			</button>
			<div className="w-12 h-full flex items-center justify-center font-medium text-gray-700">
				{qty}
			</div>
			<button
				onClick={onIncrease}
				className="w-9 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors border-l"
			>
				<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
				</svg>
			</button>
		</div>
	);
};

const Cart = () => {
	const { cartItems, totalAmount, totalQuantity } = useSelector((store) => store.cart);
	const { isUserLoggedIn } = useSelector((store) => store.auth);
	const dispatch = useDispatch();
	//! increase cart item Qty
	const increaseQty = (item) => {
		dispatch(addToCart(item));
	};
	//! Decrease Cart Item Qty
	const decreaseQty = (item) => {
		dispatch(decreaseCart(item));
	};
	//! Remove Single Item
	const removeItem = (item) => {
		dispatch(removeCartItem(item));
	};

	useEffect(() => {
		dispatch(calculateSubtotal());
		dispatch(calculateTotalQuantity());
	}, [dispatch, cartItems]);

	return (
		<motion.main 
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-base-200/50 pt-28"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{!cartItems.length ? (
					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm"
					>
						<RiShoppingCartLine className="text-7xl text-neutral/20 mb-6" />
						<h1 className="text-2xl font-serif text-neutral/80 mb-4">
							Your Luxury Cart Awaits
						</h1>
						<Link 
							to="/all" 
							className="btn btn-primary gap-2 px-8 py-3 text-sm uppercase tracking-wider"
						>
							Discover Collection
						</Link>
					</motion.div>
				) : (
					<motion.div 
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						className="space-y-8"
					>
						<div className="flex flex-col xl:flex-row gap-8">
							{/* Cart Items */}
							<div className="flex-1 space-y-6">
								<div className="bg-white rounded-lg shadow-sm p-6">
									<div className="flex items-center justify-between mb-6">
										<h1 className="text-2xl font-serif text-neutral">
											Your Selection ({totalQuantity})
										</h1>
										<button
											onClick={() => dispatch(clearCart())}
											className="text-sm text-neutral/60 hover:text-primary flex items-center gap-1"
										>
											<RiCloseLine className="w-4 h-4" />
											Clear All
										</button>
									</div>

									<AnimatePresence>
										{cartItems.map((item) => {
											const { imageURL, name, price, qty, id } = item;
											return (
												<motion.div
													key={id}
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, x: -20 }}
													className="flex gap-6 p-4 border-b border-base-300 last:border-0 group"
												>
													<Link 
														to={`/product-details/${id}`} 
														className="shrink-0 w-24 h-24 bg-base-200/50 rounded-lg overflow-hidden"
													>
														<LazyLoadImage
															src={imageURL}
															alt={name}
															className="w-full h-full object-cover"
															effect="blur"
														/>
													</Link>

													<div className="flex-1 min-w-0">
														<div className="flex items-start justify-between gap-4">
															<div>
																<Link 
																	to={`/product-details/${id}`}
																	className="text-lg font-medium text-neutral hover:text-primary transition-colors"
																>
																	{name}
																</Link>
																<p className="text-primary font-medium mt-1">
																	{formatPrice(price)}
																</p>
															</div>
															
															<button
																onClick={() => dispatch(removeCartItem(item))}
																className="text-neutral/40 hover:text-primary transition-colors p-2"
															>
																<RiDeleteBin6Line className="w-5 h-5" />
															</button>
														</div>

														<div className="flex items-center justify-between mt-4">
															<div className="flex items-center h-12 border rounded-lg overflow-hidden">
																<button
																	onClick={() => dispatch(decreaseCart(item))}
																	className="w-12 h-full flex items-center justify-center text-neutral/60 hover:bg-base-200 transition-colors border-r"
																>
																	<RiArrowLeftSLine className="w-5 h-5" />
																</button>
																<div className="w-16 h-full flex items-center justify-center font-medium text-neutral">
																	{qty}
																</div>
																<button
																	onClick={() => dispatch(addToCart(item))}
																	className="w-12 h-full flex items-center justify-center text-neutral/60 hover:bg-base-200 transition-colors border-l"
																>
																	<RiArrowRightSLine className="w-5 h-5" />
																</button>
															</div>

															<p className="text-lg font-medium text-neutral">
																{formatPrice(price * qty)}
															</p>
														</div>
													</div>
												</motion.div>
											);
										})}
									</AnimatePresence>
								</div>
							</div>

							{/* Order Summary */}
							<div className="xl:w-96 w-full">
								<motion.div 
									initial={{ y: 20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-8"
								>
									<h2 className="text-xl font-serif text-neutral mb-6">
										Order Summary
									</h2>
									
									<div className="space-y-6">
										<div className="flex justify-between text-neutral/80">
											<span>Items:</span>
											<span className="font-medium">{totalQuantity}</span>
										</div>

										<div className="flex justify-between text-lg font-medium text-neutral">
											<span>Subtotal:</span>
											<span className="text-primary">
												{formatPrice(totalAmount)}
											</span>
										</div>

										<div className="pt-4 border-t border-base-300 space-y-4">
											{isUserLoggedIn ? (
												<Link 
													to="/checkout-details" 
													className="btn btn-primary w-full py-3 text-sm uppercase tracking-wider"
												>
													Secure Checkout
												</Link>
											) : (
												<label
													htmlFor="my-modal-4"
													className="btn btn-primary w-full py-3 text-sm uppercase tracking-wider"
												>
													Sign In to Checkout
												</label>
											)}

											<Link 
												to="/all" 
												className="btn btn-ghost w-full py-3 text-sm uppercase tracking-wider border border-neutral/20 hover:border-primary hover:text-primary"
											>
												Continue Shopping
											</Link>
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
