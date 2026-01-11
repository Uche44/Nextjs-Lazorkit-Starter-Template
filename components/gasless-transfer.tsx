"use client";

import { useState } from "react";
import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const DEMO_RECIPIENT = "FRbq7mWSakCiRmEbGeybcJ2Mkz3WC56hfMaxMQz1msRc";

export function GaslessTransfer() {
  const { signAndSendTransaction, smartWalletPubkey, isConnected } =
    useWallet();
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!smartWalletPubkey) {
      alert("Wallet not connected");
      return;
    }

    try {
      setLoading(true);

      // 1. Create the transfer instruction
      const destination = new PublicKey(DEMO_RECIPIENT);
      const amount = 0.00002 * LAMPORTS_PER_SOL;
      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: destination,
        lamports: amount,
      });

      // 2. Sign and send the transaction (gasless via paymaster)
      const signature = await signAndSendTransaction({
        instructions: [instruction],
      });

      console.log("Transaction signature:", signature);

      // 3. Save transaction to database
      try {
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            signature,
            type: 'TRANSFER',
            amount: amount.toString(),
            recipient: DEMO_RECIPIENT,
            status: 'SUCCESS',
          }),
          credentials: 'include',
        });

        if (!response.ok) {
          console.error('Failed to save transaction to database');
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Don't fail the whole transaction if DB save fails
      }

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
