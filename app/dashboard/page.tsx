"use client";

import { useWallet } from "@lazorkit/wallet";
import { redirect } from "next/navigation";
import WalletData from "@/components/wallet-data";
import { GaslessTransfer } from "@/components/gasless-transfer";
import { SignMessage } from "@/components/sign-message";
import Link from "next/link";

export default function DashboardPage() {
  const { isConnected, wallet } = useWallet();

  // Guard route
  if (!isConnected || !wallet) {
    redirect("/");
  }

  return (
    <main className="space-y-6 p-6 bg-card w-full h-screen">
      <Link
        className=""
        href="/login"
      >
        Test Login via sign message feature
      </Link>

      <h1 className="text-2xl ml-5 font-semibold text-color">Dashboard</h1>

      <WalletData />
      <div className="flex w-full justify-between border">
        <GaslessTransfer />
        <SignMessage />
      </div>
    </main>
  );
}
