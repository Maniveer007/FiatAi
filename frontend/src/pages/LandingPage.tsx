import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Coins, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
            The Future of Fiat-to-Crypto
          </span>
        </h1>
        <p className="text-gray-300 text-xl mb-12 max-w-3xl mx-auto">
          Experience seamless transactions with our AI-powered platform. Convert between fiat and USDC instantly, securely, and efficiently.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-20">
          <Link
            to="/buy"
            className="inline-flex items-center px-8 py-4 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold transition-all duration-200"
          >
            Buy Fiat <ArrowRight className="ml-2" />
          </Link>
          <Link
            to="/sell"
            className="inline-flex items-center px-8 py-4 rounded-lg border border-purple-500 text-purple-400 hover:bg-purple-500/20 font-semibold transition-all duration-200"
          >
            Sell Fiat <ArrowRight className="ml-2" />
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid md:grid-cols-3 gap-8 mt-20"
      >
        <div className="bg-white/5 p-8 rounded-2xl border border-purple-500/20 backdrop-blur-lg">
          <Zap className="h-12 w-12 text-purple-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
          <p className="text-gray-400">Complete transactions in seconds with our AI-powered processing system.</p>
        </div>

        <div className="bg-white/5 p-8 rounded-2xl border border-purple-500/20 backdrop-blur-lg">
          <Shield className="h-12 w-12 text-purple-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Secure & Safe</h3>
          <p className="text-gray-400">Bank-grade security ensures your transactions are protected at all times.</p>
        </div>

        <div className="bg-white/5 p-8 rounded-2xl border border-purple-500/20 backdrop-blur-lg">
          <Coins className="h-12 w-12 text-purple-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">USDC Support</h3>
          <p className="text-gray-400">Seamlessly convert between fiat and USDC stablecoin.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;