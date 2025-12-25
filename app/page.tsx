"use client";
import { ConnectButton } from "@/components/passkey-signup";

const Home = () => {
  return (
    <section className="w-full h-screen bg-card px-4 py-6 flex items-center justify-center bg-black">
      <ConnectButton />
    </section>
  );
};

export default Home;
