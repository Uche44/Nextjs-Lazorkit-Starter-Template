"use client";

import { useWallet } from "@lazorkit/wallet";
import WalletData from "@/components/wallet-data";
import { GaslessTransfer } from "@/components/gasless-transfer";
import { SignMessage } from "@/components/sign-message";
import { TransactionHistory } from "@/components/transaction-history";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { disconnect } = useWallet();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    await disconnect();
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <main className="space-y-6 p-6 bg-card w-full min-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-color">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {user && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">User Information</h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Wallet:</strong>{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {user.smartWalletAddress}
                </code>
              </p>
              {user.name && (
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
              )}
              {user.email && (
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
              )}
              <p>
                <strong>Member since:</strong>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        <WalletData />
        
        <div className="flex w-full justify-between gap-4">
          <GaslessTransfer />
          <SignMessage />
        </div>

        <TransactionHistory />
      </main>
    </ProtectedRoute>
  );
}
