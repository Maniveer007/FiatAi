import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { CheckCircle, Loader } from "lucide-react";

const CONTRACT_ADDRESS = "0x4640501E12D9856fd74765c83Dab5731410Fcc25";
const CONTRACT_ABI = [
  "function withdrawTokens(address to, uint256 amount) external",
];

const Success = () => {
  const [searchParams] = useSearchParams();
  const fiatAmount = searchParams.get("fiatAmount");
  const usdcAmount = searchParams.get("usdcAmount");
  const type = searchParams.get("type");

  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transactionHash, setTransactionHash] = useState(null);

  const transactionId = `tx-${fiatAmount}-${usdcAmount}-${type}`;

  useEffect(() => {
    window.scrollTo(0, 0);

    const alreadyVerified = localStorage.getItem(transactionId);
    if (alreadyVerified) {
      setIsVerified(true);
      setLoading(false);
      return;
    }

    const verifyTransaction = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log("Transaction verified, processing blockchain transfer...");
        await withdrawTokens();
        localStorage.setItem(transactionId, "verified");

        setIsVerified(true);
      } catch (error) {
        console.error("Verification failed:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyTransaction();
  }, [transactionId]);

  const withdrawTokens = async () => {
    if (usdcAmount && fiatAmount) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();

        const AI_wallet = new ethers.Wallet(
          import.meta.env.VITE_PRIVATE_KEY as string,
          provider
        );

        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          AI_wallet
        );
        const tx = await contract.withdrawTokens(
          userAddress,
          ethers.utils.parseUnits(usdcAmount, 6)
        );

        console.log("Transaction hash:", tx.hash);
        setTransactionHash(tx.hash);

        await tx.wait();

        console.log("Tokens withdrawn successfully");
      } catch (error) {
        console.error("Error withdrawing tokens:", error);
      }
    }
  };

  const message =
    type === "buy"
      ? `Your payment of ${usdcAmount} USDC has been successfully processed, and you have received $${fiatAmount}!`
      : `Your payment of $${fiatAmount} has been successfully processed, and you have received ${usdcAmount} USDC!`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto px-4 py-20 text-center"
    >
      <div className="bg-[#2b2c31]/90 p-8 rounded-2xl border border-[#4f46e5]/20 shadow-xl backdrop-blur-lg">
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader className="h-24 w-24 text-yellow-400 animate-spin" />
            <h2 className="text-2xl font-semibold text-white mt-4">
              Verifying Transaction...
            </h2>
          </div>
        ) : isVerified ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="flex justify-center mb-8"
            >
              <CheckCircle className="h-24 w-24 text-emerald-400" />
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-4">
              Transaction Successful!
            </h2>

            <p className="text-gray-300 text-lg mb-8">{message}</p>

            <div className="space-y-4">
              <Link
                to="/"
                className="block w-full py-4 px-6 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold rounded-lg transition-all duration-200"
              >
                Return to Home
              </Link>

              <Link
                to={type === "buy" ? "/sell" : "/buy"}
                className="block w-full py-4 px-6 border border-[#4f46e5]/20 text-gray-300 hover:bg-[#4f46e5]/10 hover:text-white font-semibold rounded-lg transition-all duration-200"
              >
                {type === "buy" ? "Sell Fiat" : "Buy Fiat"}
              </Link>

              {transactionHash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200"
                >
                  View on Sepolia Explorer
                </a>
              )}
            </div>
          </>
        ) : (
          <p className="text-red-500 text-lg">
            Verification Failed. Try Again.
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Success;
