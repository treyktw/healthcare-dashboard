// components/loading-screen.tsx
import { motion } from "framer-motion";
import Image from "next/image";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = "Creating your account..." }: LoadingScreenProps) => {
  return (
    <div className="fixed inset-0 bg-dark-500 z-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8 p-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/assets/icons/logo-full.svg"
            alt="DentalCare"
            width={150}
            height={40}
            className="h-10 w-auto"
          />
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative"
        >
          <div className="w-16 h-16 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center space-y-2"
        >
          <h2 className="text-xl font-semibold text-gray-900">{message}</h2>
          <p className="text-sm text-gray-500">Please wait while we prepare your account...</p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;