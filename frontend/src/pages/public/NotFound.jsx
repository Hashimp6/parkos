import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white overflow-hidden relative">
      
      {/* Floating Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-72 h-72 bg-purple-500 opacity-20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
        <div className="absolute w-72 h-72 bg-blue-500 opacity-20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center z-10 px-6"
      >
        {/* 404 Text */}
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"
        >
          404
        </motion.h1>

        {/* Subtitle */}
        <p className="mt-4 text-xl md:text-2xl text-gray-300">
          Oops! The page you’re looking for doesn’t exist.
        </p>

        {/* Description */}
        <p className="mt-2 text-gray-500 max-w-md mx-auto">
          It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full font-semibold shadow-lg hover:shadow-purple-500/50 transition"
        >
          Go Back Home
        </motion.button>
      </motion.div>
    </div>
  );
}