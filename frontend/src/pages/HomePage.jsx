"use client";

import Link from "next/link";
import Button from "../components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-amber-100 to-white">
      <h1 className="text-4xl font-bold text-amber-900 mb-4">Welcome to BuddhaNFT</h1>
      <p className="text-lg text-amber-700 mb-8 text-center max-w-xl">
        Mint, buy, and bid on sacred Buddha amulet NFTs. Join our community of collectors and experience a one-of-a-kind NFT marketplace.
      </p>

      <div className="flex flex-wrap gap-4">
        <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
          <Link href="/mint">Mint NFT</Link>
        </Button>
        <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white">
          <Link href="/marketplace">Marketplace</Link>
        </Button>
        <Button asChild className="bg-amber-400 hover:bg-amber-500 text-white">
          <Link href="/english-auction">English Auctions</Link>
        </Button>
        <Button asChild className="bg-amber-300 hover:bg-amber-400 text-white">
          <Link href="/lucky-auction">Lucky Auctions</Link>
        </Button>
        <Button asChild className="bg-amber-200 hover:bg-amber-300 text-amber-900">
          <Link href="/admin-dashboard">Admin Dashboard</Link>
        </Button>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        Powered by blockchain · Built with love · BuddhaNFT © 2025
      </p>
    </div>
  );
}