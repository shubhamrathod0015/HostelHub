import { Link } from "react-router";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 animate-background">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-9xl font-bold text-gray-800 mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            404
          </motion.h1>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
            }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-700 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link
              to="/"
              className="inline-flex items-center px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-16"
        >
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
