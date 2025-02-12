import React, { useState, useEffect } from "react";

declare global {
  interface Window {
    ethereum: any;
  }
}
import { Link, useLocation } from "react-router-dom";
import { Wallet } from "lucide-react";
import { ethers } from "ethers";

const SEPOLIA_CHAIN_ID = "aa36a7"; // Sepolia chain ID

const Navbar = () => {
  const location = useLocation();
  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState("");

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        const network = await provider.getNetwork();

        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
        console.log("Network:", network.chainId.toString(16));
        setNetwork(network.chainId.toString(16));
      }
    };
    checkConnection();

    window.ethereum?.on("chainChanged", () => {
      window.location.reload();
    });
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask to connect your wallet.");
    }
  };

  const switchToSepolia = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
      } catch (error: any) {
        console.error("Error switching network:", error);
        if (error.code === 4902) {
          alert(
            "Sepolia network is not added to your wallet. Please add it manually."
          );
        }
      }
    }
  };

  const shortenAddress = (address: string) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  };

  return (
    <nav className="bg-[#2b2c31]/80 backdrop-blur-lg border-b border-[#4f46e5]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-[#4f46e5]" />
            <span className="text-2xl font-bold text-white">FiatAI</span>
          </Link>
          <div className="flex space-x-4">
            <Link
              to="/buy"
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/buy"
                  ? "bg-[#4f46e5] text-white"
                  : "text-gray-300 hover:bg-[#4f46e5]/10 hover:text-white"
              }`}
            >
              Buy Fiat
            </Link>
            <Link
              to="/sell"
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/sell"
                  ? "bg-[#4f46e5] text-white"
                  : "text-gray-300 hover:bg-[#4f46e5]/10 hover:text-white"
              }`}
            >
              Buy Crypto
            </Link>
            {account ? (
              <button
                onClick={connectWallet}
                className="px-4 py-2 rounded-lg bg-[#4f46e5] text-white hover:bg-[#3a36d3] transition-all"
              >
                Connect Wallet
              </button>
            ) : network == SEPOLIA_CHAIN_ID ? (
              <span className="px-4 py-2 rounded-lg bg-[#4f46e5] text-white">
                {shortenAddress(account)}
              </span>
            ) : (
              <button
                onClick={switchToSepolia}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                Switch to Sepolia
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
