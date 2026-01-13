"use client";

import React from "react";
import { LazorkitProvider } from "@lazorkit/wallet";

const CONFIG = {
  RPC_URL: "https://api.devnet.solana.com",
  PORTAL_URL: "https://portal.lazor.sh",
  PAYMASTER: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  },
};

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (typeof window !== "undefined") {
     // Polyfill Node.js Buffer for browser environments.
  // Some Solana and crypto dependencies expect Buffer to be available,
  // but it is not defined in the browser by default.
  // This ensures compatibility without affecting server-side execution.
  
    // eslint-disable-next-line react-hooks/immutability, @typescript-eslint/no-require-imports
    window.Buffer = window.Buffer || require("buffer").Buffer;
  }

  return (
    <LazorkitProvider 
      rpcUrl={CONFIG.RPC_URL}
      portalUrl={CONFIG.PORTAL_URL}
      paymasterConfig={CONFIG.PAYMASTER}
    >
      {children}
    </LazorkitProvider>
  );
}
