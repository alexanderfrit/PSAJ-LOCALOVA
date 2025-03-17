import React, { useState, useEffect } from "react";
import Loader from "../../components/loader/Loader";
import { CheckoutSummary } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { calculateSubtotal, calculateTotalQuantity } from "../../redux/slice/cartSlice";
import { formatPrice } from "../../utils/formatPrice";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { saveOrder } from "../../utils/saveOrder";
import { motion } from "framer-motion";
import { RiShoppingBagLine, RiSecurePaymentLine } from "react-icons/ri";
import { toastConfig } from "../../utils/toastConfig";
import { createPayment } from "../../services/api";

const Checkout = () => {
	const { cartItems, totalAmount } = useSelector((store) => store.cart);
	const { shippingAddress } = useSelector((store) => store.checkout);
	const { email } = useSelector((store) => store.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		dispatch(calculateSubtotal());
		dispatch(calculateTotalQuantity());
	}, [dispatch, cartItems]);

	const handlePayment = async () => {
		try {
			setIsLoading(true);
			
			const response = await createPayment({
				orderItems: cartItems,
				totalAmount,
				userEmail: email,
				shippingAddress,
				orderId: `ORDER-${Date.now()}`
			});

			const { token } = response;
			
			window.snap.pay(token, {
				onSuccess: async function(result) {
					console.log("Payment success callback triggered", result);
					try {
						await saveOrder(result);
						console.log("Order saved, navigating to success page");
						navigate('/checkout-success', { 
							replace: true,
							state: { 
								orderAmount: totalAmount,
								shippingAddress
							}
						});
						toast.success("Order placed successfully!", toastConfig.success);
					} catch (error) {
						console.error("Error in success callback:", error);
						toast.error("Error processing order", toastConfig.error);
					}
				},
				onPending: async function(result) {
					console.log("Payment pending callback triggered", result);
					try {
						await saveOrder({ ...result, status: 'pending' });
						toast.info('Payment pending. Please complete your payment.');
					} catch (error) {
						console.error("Error in pending callback:", error);
					}
				},
				onError: function(result) {
					console.log("Payment error callback triggered", result);
					toast.error('Payment failed. Please try again.', toastConfig.error);
					navigate('/order-failed', { replace: true });
				},
				onClose: function() {
					console.log("Payment window closed");
					toast.info('Payment cancelled.');
				}
			});
		} catch (error) {
			console.error('Error:', error);
			toast.error('Something went wrong. Please try again.', toastConfig.error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const script = document.createElement('script');
		script.src = 'https://app.sandbox.midtrans.com/snap/snap.js?enable3ds=true';
		script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
		script.setAttribute('data-theme', 'luxury');
		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	return (
		<motion.main 
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-base-200/50 pt-28"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<motion.div 
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					className="bg-white rounded-xl shadow-xl border border-base-300"
				>
					<div className="p-6 sm:p-8">
						<div className="mb-8 pb-6 border-b border-base-300">
							<div className="flex items-center gap-4">
								<div className="p-3 bg-primary/10 rounded-lg">
									<RiSecurePaymentLine className="text-3xl text-primary" />
								</div>
								<div>
									<h1 className="text-2xl font-serif text-neutral">Secure Checkout</h1>
									<p className="text-neutral/60 mt-1">Complete your purchase</p>
								</div>
							</div>
						</div>

						<div className="flex flex-col lg:flex-row gap-8">
							<motion.div 
								initial={{ x: -20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								className="flex-1"
							>
								<h2 className="text-lg font-medium text-neutral mb-6">
									Order Summary
								</h2>
								<CheckoutSummary />
							</motion.div>

							<motion.div 
								initial={{ x: 20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								className="lg:w-96"
							>
								<div className="sticky top-8">
									<div className="bg-base-200/50 rounded-lg p-6">
										<div className="mb-6">
											<h3 className="text-lg font-medium text-neutral mb-2">
												Payment Total
											</h3>
											<p className="text-2xl font-serif text-primary">
												{formatPrice(totalAmount)}
											</p>
										</div>

										<button
											onClick={handlePayment}
											disabled={isLoading}
											className="btn btn-primary w-full py-4 text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-[0.98]"
										>
											{isLoading ? (
												<>
													<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
														<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
														<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
													</svg>
													Processing...
												</>
											) : (
												<>
													<RiShoppingBagLine className="w-5 h-5" />
													Complete Payment
												</>
											)}
										</button>

										<div className="mt-6 text-center">
											<p className="text-xs text-neutral/60">
												Secure SSL encryption powered by Midtrans
											</p>
										</div>
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				</motion.div>
			</div>

			{isLoading && <Loader />}
		</motion.main>
	);
};

export default Checkout;
