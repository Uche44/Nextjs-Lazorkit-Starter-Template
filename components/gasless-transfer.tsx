"use client";

import { useState } from "react";
import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const DEMO_RECIPIENT = "FRbq7mWSakCiRmEbGeybcJ2Mkz3WC56hfMaxMQz1msRc";

export function GaslessTransfer() {
  const { signAndSendTransaction, smartWalletPubkey, isConnected } =
    useWallet();
  const [loading, setLoading] = useState(false);

  console.log("wallet addy:", smartWalletPubkey?.toBase58());
  const handleSend = async () => {
    if (!smartWalletPubkey) {
      alert("Wallet not connected");
      return;
    }

    try {
      setLoading(true);

      // 1. Create the transfer instruction
      const destination = new PublicKey(DEMO_RECIPIENT);
      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: destination,
        lamports: 0.00002 * LAMPORTS_PER_SOL,
      });

      // 2. Sign and send the transaction (gasless via paymaster)
      const signature = await signAndSendTransaction({
        instructions: [instruction],
        // transactionOptions: {
        //   feeToken: "USDC", // Pay gas in USDC instead of SOL
        // },
      });

      console.log("Transaction signature:", signature);
      alert(`Transaction sent! Signature: ${signature}`);
    } catch (err) {
      console.error(err);
      alert(
        `Transaction failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) return null;

  return (
    <div className="rounded-md border p-4">
      <h2 className="font-medium mb-2 text-color">Gasless Transfer</h2>

      <button
        onClick={handleSend}
        disabled={loading || !smartWalletPubkey}
        className="rounded bg-secondary px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send 0.00002 SOL (Gasless)"}
      </button>
    </div>
  );
}
