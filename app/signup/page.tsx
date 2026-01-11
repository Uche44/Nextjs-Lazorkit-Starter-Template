"use client";

import { useWallet } from "@lazorkit/wallet";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";

export default function SignupPage() {
  // const { connect, isConnected, isConnecting, wallet, smartWalletPubkey } = useWallet();
  const { connect, isConnected, isConnecting, smartWalletPubkey } = useWallet();
  const { signup, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Handle wallet connection and signup
  useEffect(() => {
    const handleSignup = async () => {
      if (isConnected && smartWalletPubkey && !user && !loading) {
        try {
          setLoading(true);
          setError(null);

          await signup({
            smartWalletAddress: smartWalletPubkey.toBase58(),
            name: name || undefined,
            email: email || undefined,
          });

          // Redirect to dashboard
          router.push("/dashboard");
        } catch (err) {
          console.error("Signup failed:", err);
          setError(err instanceof Error ? err.message : "Signup failed");
          setLoading(false);
        }
      }
    };

    handleSignup();
  }, [isConnected, smartWalletPubkey, user, signup, router, name, email, loading]);

  const handleConnect = async () => {
    try {
      setError(null);
      await connect();
    } catch (err) {
      console.error("Connection failed:", err);
      setError("Failed to create passkey. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Sign up with your passkey to get started
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name (Optional)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isConnecting || loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email (Optional)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isConnecting || loading}
            />
          </div>
        </div>

        <button
          onClick={handleConnect}
          disabled={isConnecting || loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isConnecting || loading
            ? "Creating passkey..."
            : "Create account with passkey"}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Sign in
            </a>
          </p>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            What is a passkey?
          </h3>
          <p className="text-xs text-blue-800">
            Passkeys use your device&apos;s biometric authentication (fingerprint, Face ID, etc.) 
            to create a secure smart wallet. No seed phrases to remember!
          </p>
        </div>
      </div>
    </main>
  );
}
