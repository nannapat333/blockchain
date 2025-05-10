"use client";

import { useState } from "react";
import { useWalletClient } from "wagmi";
// import { formatEther, parseEther } from "ethers";
import { useContracts } from "../hooks/useContracts";
import Button from "../components/ui/button";

export default function ClaimWithdrawPage() {
  const { data: walletClient } = useWalletClient();
  const { englishAuction, luckyBidAuction } = useContracts(walletClient);
  const [auctionId, setAuctionId] = useState("");
  const [status, setStatus] = useState("");

  const handleClaimNFT = async (type) => {
    try {
      setStatus("⏳ Claiming NFT...");
      const contract = type === "english" ? englishAuction : luckyBidAuction;
      const tx =
        type === "english"
          ? await contract.claimNFT(auctionId)
          : await contract.claimLuckyNFT(auctionId);
      await tx.wait();
      setStatus("✅ NFT claimed successfully!");
    } catch (err) {
      console.error("Claim error:", err);
      setStatus("❌ " + (err?.message || "Claim failed"));
    }
  };

  const handleWithdrawFunds = async (type) => {
    try {
      setStatus("⏳ Withdrawing funds...");
      const contract = type === "english" ? englishAuction : luckyBidAuction;
      const tx =
        type === "english"
          ? await contract.withdrawFunds(auctionId)
          : await contract.withdrawLuckyFunds(auctionId);
      await tx.wait();
      setStatus("✅ Funds withdrawn successfully!");
    } catch (err) {
      console.error("Withdraw error:", err);
      setStatus("❌ " + (err?.message || "Withdraw failed"));
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Claim & Withdraw</h1>

      <input
        type="text"
        placeholder="Auction ID"
        className="w-full border rounded p-2 mb-4"
        value={auctionId}
        onChange={(e) => setAuctionId(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => handleClaimNFT("english")}
        >
          Claim English NFT
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => handleClaimNFT("lucky")}
        >
          Claim Lucky NFT
        </Button>
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => handleWithdrawFunds("english")}
        >
          Withdraw English Funds
        </Button>
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => handleWithdrawFunds("lucky")}
        >
          Withdraw Lucky Funds
        </Button>
      </div>

      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}