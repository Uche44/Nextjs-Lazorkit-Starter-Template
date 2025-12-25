// ConnectButton.tsx
import { useWallet } from "@lazorkit/wallet";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ConnectButton() {
  const { connect, disconnect, isConnected, isConnecting, wallet } =
    useWallet();
  const router = useRouter();

  const buttonClasses =
    "rounded-md border border-gray-300 cursor-pointer bg-white px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50";

  useEffect(() => {
    if (isConnected && wallet) {
      router.push("/dashboard");
    }
  }, [isConnected, wallet, router]);


  return (
    <button
      onClick={() => connect()}
      disabled={isConnecting}
      className={buttonClasses}
    >
      {isConnecting ? "Creating passkey..." : "Create account with passkey"}
    </button>
  );
}
