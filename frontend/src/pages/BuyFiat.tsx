import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Coins } from "lucide-react";

const BuyFiat = () => {
  const [fiatAmount, setFiatAmount] = useState("");
  const [usdcAmount, setUsdcAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-lg mx-auto px-4 py-12"
    >
      <div className="bg-[#2b2c31]/90 p-8 rounded-2xl border border-[#4f46e5]/20 shadow-xl backdrop-blur-lg">
        <div className="flex items-center justify-center mb-6">
          <Coins className="h-12 w-12 text-[#4f46e5]" />
        </div>
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Buy Fiat from USDC
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Fiat Amount (USD)
            </label>
            <input
              type="number"
              value={fiatAmount}
              onChange={(e) => setFiatAmount(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1b1e] border border-[#4f46e5]/20 rounded-lg text-white focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
              placeholder="Enter amount in USD"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              USDC Amount
            </label>
            <input
              type="number"
              value={usdcAmount}
              onChange={(e) => setUsdcAmount(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1b1e] border border-[#4f46e5]/20 rounded-lg text-white focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
              placeholder="Enter amount in USDC"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold rounded-lg transition-all duration-200"
          >
            Proceed to Payment
          </button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#2b2c31] p-6 rounded-lg shadow-lg max-w-sm text-center">
            <h2 className="text-lg font-semibold text-white mb-4">Notice</h2>
            <p className="text-gray-300 mb-4">
              The Indian Government does not provide fiat demo transactions. For
              this hackathon, you can try selling fiat to buy crypto instead.
            </p>
            <button
              onClick={() => {
                setShowModal(false);
                navigate("/");
              }}
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white py-2 px-4 rounded-lg"
            >
              Go to Home
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BuyFiat;
