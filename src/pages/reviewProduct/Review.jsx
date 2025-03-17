import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../../components";
import { formatPrice } from "../../utils/formatPrice";
import { toast } from "react-toastify";
import { toastConfig } from "../../utils/toastConfig";
// lazy load
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// Star rating library
import StarsRating from "react-star-rate";
//redux
import { useSelector } from "react-redux";
// firebase
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { motion } from "framer-motion";
import { RiStarLine, RiSendPlaneLine } from "react-icons/ri";

const Review = () => {
	const [rating, setRating] = useState(0);
	const [review, setReview] = useState("");
	const navigate = useNavigate();
	const { id } = useParams();
	const { products } = useSelector((store) => store.product);
	const { userId, userName, userPhoto } = useSelector((store) => store.auth);

	//! find the the matching product from the productsSlice
	const filteredProduct = products.find((item) => item.id === id);

	function submitReview(e) {
		e.preventDefault();
		const date = new Date().toDateString();
		const time = new Date().toLocaleTimeString();
		
		// Create review config object, handling undefined userPhoto
		const reviewConfig = {
			userId,
			userName,
			// Only include userPhoto if it exists, otherwise use null
			...(userPhoto ? { userPhoto } : { userPhoto: null }),
			productId: id,
			review,
			rating,
			reviewDate: date,
			reviewTime: time,
			createdAt: Timestamp.now().toDate(),
		};
		
		try {
			addDoc(collection(db, "reviews"), reviewConfig);
			toast.success("Thanks for sharing your feedback", toastConfig.success);
			setRating(0);
			setReview("");
			navigate(`/product-details/${id}`);
		} catch (error) {
			toast.error(error.message, toastConfig.error);
		}
	}

	return (
		<>
			<Header text="Write a Review" />
			{!filteredProduct ? (
				<div className="min-h-screen flex items-center justify-center">
					<h1 className="text-2xl font-medium text-neutral/60">Product not found</h1>
				</div>
			) : (
				<motion.main 
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="min-h-screen bg-base-200/50 pt-20 pb-12"
				>
					<div className="max-w-3xl mx-auto px-4">
						<motion.div 
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							className="bg-white border border-base-300 p-6 sm:p-8"
						>
							{/* Product Info */}
							<div className="flex items-center space-x-4 pb-6 border-b border-base-300">
								<LazyLoadImage
									src={filteredProduct.imageURL}
									alt={filteredProduct.name}
									className="w-24 h-24 object-contain bg-base-200/50 p-2"
									effect="blur"
								/>
								<div>
									<h1 className="text-xl font-medium text-neutral">{filteredProduct.name}</h1>
									<p className="text-sm text-neutral/60 mt-1">{filteredProduct.brand}</p>
									<p className="text-primary font-medium mt-2">{formatPrice(filteredProduct.price)}</p>
								</div>
							</div>

							{/* Review Form */}
							<form onSubmit={submitReview} className="mt-8 space-y-6">
								<div>
									<label className="block text-sm font-medium text-neutral mb-2">
										Your Rating <span className="text-primary">*</span>
									</label>
									<div className="flex items-center">
										<StarsRating
											value={rating}
											onChange={(rating) => setRating(rating)}
											classNamePrefix="react-star-rate"
										/>
										{rating > 0 && (
											<span className="ml-2 text-sm text-primary">{rating}.0 stars</span>
										)}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-neutral mb-2">
										Your Review <span className="text-primary">*</span>
									</label>
									<textarea
										className="w-full border border-base-300 p-3 focus:outline-none focus:border-primary transition-colors"
										placeholder="Share your experience with this product..."
										rows={5}
										value={review}
										onChange={(e) => setReview(e.target.value)}
										required
									></textarea>
								</div>

								<div className="pt-4 flex justify-end">
									<motion.button
										whileTap={{ scale: 0.98 }}
										type="submit"
										className="px-6 py-3 bg-primary text-white flex items-center gap-2 hover:bg-primary-focus transition-colors"
									>
										<RiSendPlaneLine className="w-5 h-5" />
										Submit Review
									</motion.button>
								</div>
							</form>
						</motion.div>
					</div>
				</motion.main>
			)}
		</>
	);
};

export default Review;
