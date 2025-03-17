import { doc, getDoc } from "firebase/firestore";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import { Link, useParams } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import Loader from "../loader/Loader";
import ReviewComponent from "../review/ReviewComponent";
// Custom Hook
import useFetchCollection from "../../hooks/useFetchCollection";
//Lazy Load
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// Firebase
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decreaseCart, calculateTotalQuantity } from "../../redux/slice/cartSlice";
import { motion } from "framer-motion";
import { RiArrowLeftLine, RiShoppingBag3Line, RiSubtractLine, RiAddLine } from "react-icons/ri";

const ProductDetails = () => {
	// get cart items from redux store
	const { cartItems } = useSelector((store) => store.cart);
	const [product, setProduct] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const { id } = useParams();
	const dispatch = useDispatch();

	//! fetch Review Collection
	const { data } = useFetchCollection("reviews");

	// find the review which matches the current product
	const filteredReview = data.filter((item) => item.productId === id);

	//! fetch single product Document from products collection
	async function getSingleDocument() {
		setIsLoading(true);
		const docRef = doc(db, "products", id);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			setProduct(docSnap.data());
			setIsLoading(false);
		} else {
			console.log("No such document!");
			setIsLoading(false);
		}
	}
	// Fetching single document from firestore on initial component mount
	useEffect(() => {
		getSingleDocument();
	}, []);

	// Add to cart
	function add2CartFunction(product) {
		dispatch(addToCart({ ...product, id }));
		dispatch(calculateTotalQuantity());
	}
	// Decrease Qty
	function decreaseQty(product) {
		dispatch(decreaseCart({ ...product, id }));
		dispatch(calculateTotalQuantity());
	}
	// Check if the item is already present in the cart or not
	let currentItem = cartItems.find((item) => item.id === id);

	return (
		<>
			{isLoading && <Loader />}
			<div className="bg-base-200 min-h-screen pt-28">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="space-y-8">
						

						{/* Product Details Section */}
						<div className="bg-white border border-base-300">
							<div className="grid grid-cols-1 lg:grid-cols-2">
								{/* Image Section */}
								<div className="relative aspect-square bg-base-200">
									<LazyLoadImage
										src={product.imageURL}
										alt={product.name}
										className="w-full h-full object-contain p-8"
										effect="blur"
									/>
								</div>

								{/* Product Info Section */}
								<div className="p-8 lg:p-12 flex flex-col">
									<div className="flex-1 space-y-8">
										{/* Brand & Name */}
										<div className="space-y-2">
											<p className="text-sm font-medium text-primary uppercase tracking-wider">
												{product.brand}
											</p>
											<h1 className="font-serif text-3xl lg:text-4xl text-neutral">
												{product.name}
											</h1>
										</div>

										{/* Price */}
										<div className="inline-block bg-base-200 px-6 py-4">
											<span className="text-2xl font-medium text-primary">
												{formatPrice(product.price)}
											</span>
										</div>

										{/* Description */}
										<p className="text-neutral/70 leading-relaxed">
											{product.description}
										</p>

										{/* Product Details */}
										<div className="space-y-4 border-t border-base-300 pt-8">
											<div className="flex items-center">
												<span className="w-24 text-sm font-medium text-neutral/60">SKU</span>
												<span className="text-neutral">{id}</span>
											</div>
											<div className="flex items-center">
												<span className="w-24 text-sm font-medium text-neutral/60">Brand</span>
												<span className="text-neutral">{product.brand}</span>
											</div>
										</div>

										{/* Quantity Controls */}
										{cartItems.includes(currentItem) && (
											<div className="flex items-center gap-4 p-4 bg-base-200">
												<span className="text-sm font-medium text-neutral/60 uppercase tracking-wider">
													Quantity
												</span>
												<div className="flex items-center">
													<motion.button
														whileTap={{ scale: 0.95 }}
														onClick={() => decreaseQty(product)}
														className="p-2 bg-white text-neutral hover:text-primary transition-colors"
													>
														<RiSubtractLine className="w-5 h-5" />
													</motion.button>
													<span className="w-12 text-center font-medium text-neutral">
														{currentItem.qty}
													</span>
													<motion.button
														whileTap={{ scale: 0.95 }}
														onClick={() => add2CartFunction(product)}
														className="p-2 bg-white text-neutral hover:text-primary transition-colors"
													>
														<RiAddLine className="w-5 h-5" />
													</motion.button>
												</div>
											</div>
										)}
									</div>

									{/* Add to Cart Button */}
									<motion.button
										whileTap={{ scale: 0.98 }}
										onClick={() => add2CartFunction(product)}
										className="w-full mt-8 py-4 bg-neutral text-white hover:bg-primary transition-colors duration-200 uppercase tracking-wider flex items-center justify-center gap-2"
									>
										<RiShoppingBag3Line className="w-5 h-5" />
										Add to Cart
									</motion.button>
								</div>
							</div>
						</div>

						{/* Reviews Section */}
						<div className="bg-white border border-base-300 p-8 lg:p-12">
							<h2 className="font-serif text-2xl text-neutral mb-8">Customer Reviews</h2>
							
							{!filteredReview.length ? (
								<div className="text-center py-12">
									<p className="text-neutral/60">No reviews yet</p>
									<p className="text-sm text-neutral/50 mt-3">
										Reviews can be written after purchasing and receiving this product
									</p>
								</div>
							) : (
								<div className="space-y-8">
									{filteredReview.map((review, index) => (
										<div key={index} className="border-b border-base-300 last:border-0 pb-8 last:pb-0">
											<ReviewComponent review={review} />
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProductDetails;
