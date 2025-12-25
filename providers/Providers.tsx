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
    // ensure Buffer is available in the browser runtime
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // @ts-ignore
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
