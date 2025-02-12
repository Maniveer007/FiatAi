import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DollarSign, Loader } from "lucide-react";
import Stripe from "stripe";
import OpenAI from "openai";
import { Dialog, Transition } from "@headlessui/react";
import { ethers } from "ethers";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY || "");

const SellFiat = () => {
  const [fiatAmount, setFiatAmount] = useState("");
  const [usdcAmount, setUsdcAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [account, setAccount] = useState("");
  const navigate = useNavigate();

  const checkConnection = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    }
  };
  checkConnection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setIsModalOpen(true);
    if (!account) {
      setError("Please connect your wallet to continue.");
      setIsModalOpen(false);
      setLoading(false);
      return;
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a fiat to stablecoin assistant. You will receive a fiat currency amount as input. Your task is to determine if a trade to USDC can be performed. Output a JSON object with the following format: { canPerformTransaction: <boolean>, reason: <string> } If the trade can be performed, set `canPerformTransaction` to `true`. If not, set it to `false` and provide a clear explanation in the `reason` field.give the user reasin nicely that you have entered very low fiat amount for this USDC sorry thats quite low or quite high based on the situation Output should be strict JSON format no need to give ```json also Just strict JSON without anything additional.",
          },
          {
            role: "user",
            content: `input fiat amount: $${fiatAmount} and output amount USDC: ${usdcAmount}`,
          },
        ],
      });

      const aiResponse = JSON.parse(response.choices[0].message.content || "");

      if (!aiResponse.canPerformTransaction) {
        setError(aiResponse.reason);
        setLoading(false);
        setIsModalOpen(false);
        return;
      }

      const product = await stripe.products.create({
        name: "FIAT AI PAYMENT",
        default_price_data: {
          currency: "usd",
          unit_amount: Number(fiatAmount) * 100,
        },
      });

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: product.default_price as string,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${
          window.location.href.split("/sell")[0]
        }/success?fiatAmount=${fiatAmount}&usdcAmount=${usdcAmount}&type=sell`,
        cancel_url: `${window.location.href}`,
      });

      window.location.href = session.url || window.location.href;
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
      console.log(err);
    }

    setLoading(false);
    setIsModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-lg mx-auto px-4 py-12"
    >
      <div className="bg-[#2b2c31]/90 p-8 rounded-2xl border border-[#4f46e5]/20 shadow-xl backdrop-blur-lg">
        <div className="flex items-center justify-center mb-6">
          <DollarSign className="h-12 w-12 text-[#4f46e5]" />
        </div>
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Buy Crypto with USD
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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
            disabled={loading}
          >
            {loading ? "Processing AI verification..." : "Proceed to Payment"}
          </button>
        </form>
      </div>

      {/* AI Processing Modal */}
      <Transition show={isModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsModalOpen(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-[#1a1b1e] p-6 rounded-lg text-center"
            >
              <Loader className="h-12 w-12 text-[#4f46e5] animate-spin mx-auto mb-4" />
              <p className="text-white text-lg font-semibold">
                AI is verifying your transaction...
              </p>
            </motion.div>
          </div>
        </Dialog>
      </Transition>
    </motion.div>
  );
};

export default SellFiat;
