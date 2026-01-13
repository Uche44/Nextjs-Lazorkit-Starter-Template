
// This component displays wallet information, including the smart wallet address and balance.

"use client";

import { useWallet } from "@lazorkit/wallet";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

const RPC_URL = "https://api.devnet.solana.com";

const WalletData = () => {
  const { smartWalletPubkey, isConnected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!smartWalletPubkey || !isConnected) {
      setBalance(null);
      return;
    }

    const connection = new Connection(RPC_URL);

    const fetchBalance = async () => {
      setIsLoading(true);
      try {
        const lamports = await connection.getBalance(smartWalletPubkey);
        setBalance(lamports / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
        setBalance(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();

    // Optional: Poll for balance updates every 100 seconds
    const interval = setInterval(fetchBalance, 100000);
    return () => clearInterval(interval);
  }, [smartWalletPubkey, isConnected]);

  if (!isConnected) return null;

  return (
    <div className="rounded-md border-purple px-5 border py-4">
      <h2 className="font-medium mb-2 text-foreground">Your Wallet Info</h2>

      <p className="text-foreground">
        <strong>Smart Wallet:</strong>{" "}
        <code className="text-sm">{smartWalletPubkey?.toBase58()}</code>
      </p>

      <p className="text-color mt-4">
        <strong>Balance:</strong>{" "}
        {isLoading
          ? "Loading..."
          : balance !== null
          ? `${balance.toFixed(4)} SOL`
          : "Error loading balance"}
      </p>
    </div>
  );
};

export default WalletData;
