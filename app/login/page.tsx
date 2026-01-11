// "use client";

// import { useWallet } from "@lazorkit/wallet";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/contexts/auth-context";

// export default function LoginPage() {
//   const { connect, disconnect, isConnected, smartWalletPubkey, signMessage } = useWallet();
//   const { login, user } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [waitingForSignature, setWaitingForSignature] = useState(false);

//   // Redirect if already authenticated
//   useEffect(() => {
//     if (user) {
//       router.push("/dashboard");
//     }
//   }, [user, router]);


//  useEffect(() => {
//     const handleLogin = async () => {
//       if (isConnected && smartWalletPubkey && !user && !loading && !waitingForSignature) {
//         try {
//           setWaitingForSignature(true);
//           setError(null);

//           // Generate authentication message (simpler format)
//           const message = `Sign this message to authenticate with LazorKit\nWallet: ${smartWalletPubkey.toBase58()}\nTimestamp: ${Date.now()}`;

//           // Request signature
//           const result = await signMessage(message);

//           setLoading(true);

//           // Convert signature to base64 string
//           // let signatureBase64: string;
//           // if (typeof result.signature === 'object' && result.signature instanceof Uint8Array) {
//           //   signatureBase64 = Buffer.from(result.signature).toString('base64');
//           // } else if (typeof result.signature === 'string') {
//           //   signatureBase64 = result.signature;
//           // } else {
//           //   throw new Error('Unexpected signature format');
//           // }

//           // Convert signature to base64 string
//           const signatureBase64 = Buffer.from(result.signature as unknown as Uint8Array).toString('base64');

//           // Send to backend for verification
//           await login(smartWalletPubkey.toBase58(), message, signatureBase64);

//           // Redirect to dashboard
//           router.push("/dashboard");
//         } catch (err) {
//           console.error("Login failed:", err);
//           setError(err instanceof Error ? err.message : "Login failed");
//           setLoading(false);
//           setWaitingForSignature(false);
//           // Disconnect on error
//           await disconnect();
//         }
//       }
//     };

//     handleLogin();
//   }, [isConnected, smartWalletPubkey, user, signMessage, login, router, loading, waitingForSignature, disconnect]);


//   // Handle login after wallet connection
//   // useEffect(() => {
//   //   const handleLogin = async () => {
//   //     if (isConnected && smartWalletPubkey && !user && !loading && !waitingForSignature) {
//   //       try {
//   //         setWaitingForSignature(true);
//   //         setError(null);

//   //         // Generate authentication message
//   //         const message = `Sign this message to authenticate with LazorKit\n\nWallet: ${smartWalletPubkey.toBase58()}\nTimestamp: ${new Date().toISOString()}\nNonce: ${Math.random().toString(36).substring(7)}`;

//   //         // Request signature
//   //         const result = await signMessage(message);

//   //         setLoading(true);

//   //         // Send to backend for verification
//   //         await login(smartWalletPubkey.toBase58(), message, result.signature);

//   //         // Redirect to dashboard
//   //         router.push("/dashboard");
//   //       } catch (err) {
//   //         console.error("Login failed:", err);
//   //         setError(err instanceof Error ? err.message : "Login failed");
//   //         setLoading(false);
//   //         setWaitingForSignature(false);
//   //         // Disconnect on error
//   //         await disconnect();
//   //       }
//   //     }
//   //   };

//   //   handleLogin();
//   // }, [isConnected, smartWalletPubkey, user, signMessage, login, router, loading, waitingForSignature, disconnect]);

//   const handleConnect = async () => {
//     try {
//       setError(null);
//       await connect();
//     } catch (err) {
//       console.error("Connection failed:", err);
//       setError("Failed to connect wallet. Please try again.");
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-6">
//       <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Welcome Back
//           </h1>
//           <p className="text-gray-600">
//             Sign in with your passkey to continue
//           </p>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-red-800 text-sm">{error}</p>
//           </div>
//         )}

//         {waitingForSignature && (
//           <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//             <p className="text-blue-800 text-sm">
//               Please sign the message with your passkey to authenticate...
//             </p>
//           </div>
//         )}

//         <button
//           onClick={handleConnect}
//           disabled={loading || waitingForSignature}
//           className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
//         >
//           {waitingForSignature
//             ? "Waiting for signature..."
//             : loading
//             ? "Signing in..."
//             : "Sign in with passkey"}
//         </button>

//         <div className="mt-6 text-center">
//           <p className="text-sm text-gray-600">
//             Don&apos;t have an account?{" "}
//             <a
//               href="/signup"
//               className="text-purple-600 hover:text-purple-700 font-medium"
//             >
//               Create one
//             </a>
//           </p>
//         </div>

//         <div className="mt-8 p-4 bg-blue-50 rounded-lg">
//           <h3 className="text-sm font-semibold text-blue-900 mb-2">
//             Secure Authentication
//           </h3>
//           <p className="text-xs text-blue-800">
//             Your passkey uses cryptographic signatures to verify your identity 
//             without exposing any private keys or passwords.
//           </p>
//         </div>
//       </div>
//     </main>
//   );
// }


"use client";

import { useWallet } from "@lazorkit/wallet";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const { connect, disconnect, isConnected, smartWalletPubkey, signMessage } = useWallet();
  const { login, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waitingForSignature, setWaitingForSignature] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Handle login after wallet connection
  useEffect(() => {
    const handleLogin = async () => {
      if (isConnected && smartWalletPubkey && !user && !loading && !waitingForSignature) {
        try {
          setWaitingForSignature(true);
          setError(null);

          // Generate authentication message (simpler format)
          const message = `Sign this message to authenticate with LazorKit\nWallet: ${smartWalletPubkey.toBase58()}\nTimestamp: ${Date.now()}`;

          // Request signature
          const result = await signMessage(message);

          console.log('=== Signature Debug ===');
          console.log('Result:', result);
          console.log('Signature type:', typeof result.signature);
          console.log('Signature (first 50 chars):', result.signature.substring(0, 50));
          console.log('Signature length:', result.signature.length);
          console.log('=== End Debug ===');

          setLoading(true);

          // Send signature as-is (it's already a string from LazorKit)
          await login(smartWalletPubkey.toBase58(), message, result.signature);

          // Redirect to dashboard
          router.push("/dashboard");
        } catch (err) {
          console.error("Login failed:", err);
          setError(err instanceof Error ? err.message : "Login failed");
          setLoading(false);
          setWaitingForSignature(false);
          // Disconnect on error
          await disconnect();
        }
      }
    };

    handleLogin();
  }, [isConnected, smartWalletPubkey, user, signMessage, login, router, loading, waitingForSignature, disconnect]);

  const handleConnect = async () => {
    try {
      setError(null);
      await connect();
    } catch (err) {
      console.error("Connection failed:", err);
      setError("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in with your passkey to continue
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {waitingForSignature && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              Please sign the message with your passkey to authenticate...
            </p>
          </div>
        )}

        <button
          onClick={handleConnect}
          disabled={loading || waitingForSignature}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {waitingForSignature
            ? "Waiting for signature..."
            : loading
            ? "Signing in..."
            : "Sign in with passkey"}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Create one
            </a>
          </p>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Secure Authentication
          </h3>
          <p className="text-xs text-blue-800">
            Your passkey uses cryptographic signatures to verify your identity 
            without exposing any private keys or passwords.
          </p>
        </div>
      </div>
    </main>
  );
}