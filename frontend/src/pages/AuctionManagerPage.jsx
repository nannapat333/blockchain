"use client";

import { useState, useEffect } from "react";
import { useWalletClient } from "wagmi";
import { useContracts } from "../hooks/useContracts";
import Button from "../components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AuctionManagerPage() {
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
            auctionType: info.auctionType,
            contractAddress: info.contractAddress,
            auctionId: info.auctionId,
          });
        }

        setAuctions(items);
      } catch (err) {
        console.error("Error fetching auctions:", err);
      }
    };

    if (auctionManager) fetchAuctions();
  }, [auctionManager]);

  const handleEndAuction = async (auction) => {
    try {
      let tx;

      if (auction.auctionType === 0) {
        tx = await englishAuction.forceEndAuction(auction.auctionId);
      } else if (auction.auctionType === 1) {
        tx = await luckyBidAuction.forceEndAuction(auction.auctionId);
      }

      await tx.wait();
      alert(`Auction ${auction.auctionId} force-ended.`);
    } catch (err) {
      console.error("Failed to end auction:", err);
      alert("Error ending auction.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-amber-900">Auction Manager (Admin)</h1>

        {auctions.length === 0 ? (
          <p className="text-amber-700">No active auctions</p>
        ) : (
          auctions.map((a) => (
            <div
              key={a.index}
              className="border rounded p-4 mb-4 shadow hover:shadow-lg transition"
            >
              <p>
                <strong>Global ID:</strong> {a.index}
              </p>
              <p>
                <strong>Type:</strong>{" "}
                {a.auctionType === 0 ? "English Auction" : "Lucky Auction"}
              </p>
              <p>
                <strong>Auction ID:</strong> {a.auctionId}
              </p>
              <Button
                className="mt-2 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => handleEndAuction(a)}
              >
                Force End Auction
              </Button>
            </div>
          ))
        )}
      </main>
      <Footer />
    </div>
  );
}