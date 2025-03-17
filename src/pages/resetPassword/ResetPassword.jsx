import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { toastConfig } from "../../utils/toastConfig";
// FIREBASE
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/config";
import Loader from "../../components/loader/Loader";
import { RiMailLine, RiLockLine, RiShieldKeyholeLine } from "react-icons/ri";

const ResetPassword = () => {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [err, setErr] = useState("");
	const resetPasswordHandler = (e) => {
		e.preventDefault();
		setIsLoading(true);
		sendPasswordResetEmail(auth, email)
			.then(() => {
				toast.info("Check email for reset link", toastConfig.info);
				setErr("Check your registered email address for reset link *(Check Spam)*");
				setIsLoading(false);
				setEmail("");
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				setErr(`${errorCode} : ${errorMessage}`);
				setIsLoading(false);
			});
	};

	return (
		<>
			{isLoading && <Loader />}

			<main className="min-h-screen bg-gradient-to-br from-primary/5 via-base-200/50 to-transparent pt-28">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="min-h-[calc(100vh-7rem)] flex items-center justify-center py-12">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="w-full max-w-md"
						>
							{/* Card Container */}
							<div className="relative bg-white border-2 border-primary/10 shadow-2xl">
								{/* Decorative Elements */}
								<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
								<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent transform rotate-45 translate-x-16 -translate-y-16" />

								{/* Content */}
								<div className="relative p-8 sm:p-10 space-y-8">
									{/* Header */}
									<div className="text-center space-y-2">
										<div className="inline-flex items-center justify-center p-3 bg-primary/5 rounded-full mb-4">
											<RiShieldKeyholeLine className="w-8 h-8 text-primary" />
										</div>
										<h1 className="text-2xl font-serif text-neutral">Reset Password</h1>
										<p className="text-sm text-neutral/60">
											Enter your email address to receive password reset instructions
										</p>
									</div>

									{/* Error Message */}
									{err && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											className="bg-error/5 border-l-4 border-error p-4"
										>
											<p className="text-sm text-error">{err}</p>
										</motion.div>
									)}

									{/* Info Message */}
									<div className="bg-primary/5 border-l-4 border-primary p-4">
										<p className="text-sm text-neutral/80">
											Please enter your registered email address. You will receive an email
											with instructions on how to reset your password.
										</p>
									</div>

									{/* Form */}
									<form onSubmit={resetPasswordHandler} className="space-y-6">
										<div className="space-y-2">
											<label className="text-sm font-medium text-neutral">
												Email Address
											</label>
											<div className="relative">
												<RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral/40" />
												<input
													type="email"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													className="w-full pl-12 pr-4 py-3 bg-base-100 border border-base-300 focus:border-primary focus:outline-none text-neutral"
													required
												/>
											</div>
										</div>

										<motion.button
											whileTap={{ scale: 0.98 }}
											type="submit"
											className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white hover:bg-primary/90 transition-colors duration-200"
										>
											<RiLockLine className="w-5 h-5" />
											<span>Reset Password</span>
										</motion.button>
									</form>

									{/* Back to Login Link */}
									<div className="text-center">
										<motion.a
											whileHover={{ scale: 1.02 }}
											href="/login"
											className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
										>
											Return to Login
										</motion.a>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</main>
		</>
	);
};

export default ResetPassword;
