import React, { useState } from "react";
import { motion } from "framer-motion";
import { RiEyeLine, RiEyeOffLine, RiMailLine, RiLockLine, RiGoogleFill } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../loader/Loader";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase/config";
import { toastConfig } from "../../utils/toastConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  //! Test / Guest Account Login
  //* Currently this feature is disabled due to spam messages reported by the ADMIN
  const testLogin = (e) => {
    e.preventDefault();
    // document.getElementById("my-modal-69").checked = true;
    // setInfoModalOpen(true);
    document.getElementById("my-modal-4").checked = false;

    let testEmail = import.meta.env.VITE_TEST_EMAIL;
    let testPass = import.meta.env.VITE_TEST_PASSWORD;
    setIsLoading(true);
    signInWithEmailAndPassword(auth, testEmail, testPass)
      .then((userCredential) => {
        const user = userCredential.user;
        toast.success("Login Successful", toastConfig.success);
        setIsLoading(false);
        // document.getElementById("my-modal-4").checked = false;
        navigate("/");
      })
      .catch((error) => {
        toast.error("Login Failed", toastConfig.error);
        setIsLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsLoading(false);
        toast.success("Login Successful", toastConfig.success);
        document.getElementById("my-modal-4").checked = false;
        navigate("/");
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error("Login Failed", toastConfig.error);
      });
  };

  // Handle Google Sign in
  const provider = new GoogleAuthProvider();
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(() => {
        toast.success("Login Successfully", toastConfig.success);
        document.getElementById("my-modal-4").checked = false;
        navigate("/");
      })
      .catch((error) => {
        toast.error("Login Failed", toastConfig.error);
      });
  };

  const handleForgotPassword = () => {
    // Close the modal
    document.getElementById("my-modal-4").checked = false;
    // Navigate to reset password page
    navigate("/reset");
  };

  const AllFieldsRequired = Boolean(email) && Boolean(password);

  return (
    <>
      {isLoading && <Loader />}
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-serif text-neutral">Welcome Back</h2>
            <p className="text-sm text-neutral/60">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral">Email Address</label>
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

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-neutral">Password</label>
                <button
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-base-100 border border-base-300 focus:border-primary focus:outline-none text-neutral"
                  required
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral/40 hover:text-neutral"
                >
                  {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!AllFieldsRequired}
              className="w-full py-3 px-4 bg-primary text-white hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign In
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-base-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral/60">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-base-100 border border-base-300 hover:bg-base-200 transition-colors duration-200"
          >
            <RiGoogleFill className="w-5 h-5 text-neutral" />
            <span className="text-sm font-medium text-neutral">Google</span>
          </motion.button>

          {/* Terms */}
          <p className="text-xs text-center text-neutral/60">
            By signing in, you agree to our{" "}
            <a href="#" className="text-primary hover:text-primary/80">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:text-primary/80">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
