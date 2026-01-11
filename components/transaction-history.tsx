"use client";

import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

interface Transaction {
  id: string;
  signature: string;
  type: string;
  amount: string;
  recipient: string;
  status: string;
  createdAt: string;
}

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/transactions?limit=10', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data.transactions);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: string) => {
    const lamports = BigInt(amount);
    const sol = Number(lamports) / LAMPORTS_PER_SOL;
    return `${sol.toFixed(6)} SOL`;
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="rounded-md border p-4">
        <h2 className="font-medium mb-4 text-color">Transaction History</h2>
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border p-4">
        <h2 className="font-medium mb-4 text-color">Transaction History</h2>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-md border p-4">
        <h2 className="font-medium mb-4 text-color">Transaction History</h2>
        <p className="text-sm text-gray-500">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-color">Transaction History</h2>
        <button
          onClick={fetchTransactions}
          className="text-sm text-purple-600 hover:text-purple-700"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2">Signature</th>
              <th className="text-left py-2 px-2">Type</th>
              <th className="text-right py-2 px-2">Amount</th>
              <th className="text-left py-2 px-2">Recipient</th>
              <th className="text-left py-2 px-2">Status</th>
              <th className="text-left py-2 px-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-2">
                  <a
                    href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline font-mono"
                  >
                    {shortenAddress(tx.signature)}
                  </a>
                </td>
                <td className="py-2 px-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {tx.type}
                  </span>
                </td>
                <td className="py-2 px-2 text-right font-mono">
                  {formatAmount(tx.amount)}
                </td>
                <td className="py-2 px-2 font-mono text-xs">
                  {shortenAddress(tx.recipient)}
                </td>
                <td className="py-2 px-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      tx.status === 'SUCCESS'
                        ? 'bg-green-100 text-green-800'
                        : tx.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="py-2 px-2 text-xs text-gray-600">
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
