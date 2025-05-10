"use client";

import { useState, useEffect } from "react";
import { useWalletClient } from "wagmi";
import { useContracts } from "../hooks/useContracts";
import Button from "../components/ui/button";

export default function AdminDashboard() {
  const { data: walletClient } = useWalletClient();
  const { auctionManager, englishAuction, luckyBidAuction } = useContracts(walletClient);
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const count = await auctionManager.auctionIndex();
        const items = [];

        for (let i = 0; i < count; i++) {
          const info = await auctionManager.getAuction(i);
          items.push({
            index: i,
            type: info.auctionType === 0 ? "English" : "Lucky",
            contractAddress: info.contractAddress,
            auctionId: Number(info.auctionId),
          });
        }

        setAuctions(items);
      } catch (err) {
        console.error("Error fetching auctions:", err);
      }
    };

    if (auctionManager) fetchAuctions();
  }, [auctionManager]);

  const handleForceEnd = async (auction) => {
    try {
      let tx;
      if (auction.type === "English") {
        tx = await englishAuction.endAuction(auction.auctionId);
      } else {
        tx = await luckyBidAuction.endLuckyAuction(auction.auctionId);
      }
      await tx.wait();
      alert(`✅ Auction ${auction.auctionId} force-ended.`);
    } catch (err) {
      console.error("Force-end error:", err);
      alert("❌ Error ending auction: " + (err?.message || "Unknown error"));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {auctions.length === 0 ? (
        <p className="text-gray-600">No auctions found.</p>
      ) : (
        <div className="space-y-4">
          {auctions.map((auction) => (
            <div key={auction.index} className="border p-4 rounded shadow">
              <p><strong>Global ID:</strong> {auction.index}</p>
              <p><strong>Auction ID:</strong> {auction.auctionId}</p>
              <p><strong>Type:</strong> {auction.type}</p>
              <p><strong>Contract:</strong> {auction.contractAddress}</p>
              <Button
                className="mt-2 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => handleForceEnd(auction)}
              >
                Force End Auction
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}