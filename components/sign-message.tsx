// This component demonstrates off-chain message signing with Lazorkit.
// Users sign messages using passkeys to prove smart wallet ownership
// without submitting an on-chain transaction.

"use client";

import { useState } from "react";
import { useWallet } from "@lazorkit/wallet";

export function SignMessage() {
  const { signMessage, isConnected } = useWallet();
  const [signature, setSignature] = useState<string | null>(null);
  const [signedPayload, setSignedPayload] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const message = "I approve this action with my passkey";

  const handleSign = async () => {
    try {
      setLoading(true);

      // signMessage takes the message string directly, not an object
      const result = await signMessage(message);

      // The result contains both signature and signedPayload
      setSignature(result.signature);
      setSignedPayload(result.signedPayload);
    } catch (err) {
      console.error(err);
      alert("Signing failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) return null;

  return (
    <div className="rounded-md border p-4 space-y-2">
      <h2 className="font-medium text-color">Sign Message Demo</h2>

      <p className="text-sm text-foreground">
        This proves wallet ownership without sending a transaction.
      </p>

      <button
        onClick={handleSign}
        disabled={loading}
        className="rounded gradient-solanagreen px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Signing..." : "Sign Message"}
      </button>

      {signature && (
        <div className="space-y-2">
          <div className="break-all text-xs">
            <strong>Signature:</strong>
            <div className="mt-1 font-mono">{signature}</div>
          </div>
          {signedPayload && (
            <div className="break-all text-xs">
              <strong>Signed Payload:</strong>
              <div className="mt-1 font-mono">{signedPayload}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
