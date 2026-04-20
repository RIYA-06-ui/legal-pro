import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Shield, Loader2, CheckCircle } from "lucide-react";
import { doSignInWithGoogle } from "../firebase/auth";

const SignIn = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const redirectMessage = location.state?.message;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await doSignInWithGoogle();
      if (result) {
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob dark:from-blue-600/10 dark:to-cyan-600/10"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000 dark:from-purple-600/10 dark:to-pink-600/10"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Main Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center mb-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur"></div>
                  <div className="relative p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-emerald-100">Sign in to your LegalPro account</p>
              </motion.div>
            </div>

            {/* Form Container */}
            <div className="p-8">
              {/* Redirect Message */}
              {redirectMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="mb-6"
                >
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <p className="text-blue-700 dark:text-blue-300 text-sm">{redirectMessage}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="mb-6"
                >
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
                    <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Welcome Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center mb-8"
              >
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  Welcome back! Sign in with your Google account to continue your document analysis journey.
                </p>
              </motion.div>

              {/* Google Sign In */}
              <motion.button
                onClick={handleGoogleSignIn}
                whileHover={{ scale: !isLoading ? 1.02 : 1 }}
                whileTap={{ scale: !isLoading ? 0.98 : 1 }}
                disabled={isLoading}
                className="w-full py-6 px-6 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold text-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 group"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google logo"
                  className="w-7 h-7"
                />
                <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Continue with Google"
                  )}
                </span>
              </motion.button>

              {/* Sign Up Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-center"
              >
                <p className="text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    Sign up for free
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400"
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>SOC 2 Certified</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;
