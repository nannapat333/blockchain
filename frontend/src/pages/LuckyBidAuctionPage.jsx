"use client";
// import { ethers } from 'ethers';
import { useState, useEffect } from "react";
import { useWalletClient } from "wagmi";
import { formatEther, parseEther } from "ethers";
import { useContracts } from "../hooks/useContracts";
import Button from "../components/ui/button";

export default function LuckyBidAuctionPage() {
  const { data: walletClient } = useWalletClient();
  const { luckyBidAuction } = useContracts(walletClient);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const count = await luckyBidAuction.auctionCount();
        const items = [];

        for (let i = 0; i < count; i++) {
          const auction = await luckyBidAuction.auctions(i);
          if (!auction.ended) {
            items.push({
              id: i,
              luckyPrice: formatEther(auction.luckyPrice),
              endTime: auction.endTime.toString(),
              seller: auction.seller,
            });
          }
        }

        setAuctions(items);
      } catch (err) {
        console.error("Error fetching lucky auctions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (luckyBidAuction) fetchAuctions();
  }, [luckyBidAuction]);

  const handleBid = async (id) => {
    const amount = prompt("Enter your lucky bid amount (ETH)");
    if (!amount || isNaN(amount)) return alert("Invalid amount");

    try {
      const tx = await luckyBidAuction.placeLuckyBid(id, {
        value: parseEther(amount),
      });
      await tx.wait();
      alert("Bid placed! Wait for the draw.");
    } catch (err) {
      console.error("Lucky bid failed:", err);
      alert("Failed to place bid: " + (err.reason || err.message));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Lucky Bid Auctions</h1>

      {loading ? (
        <p>Loading lucky bid auctions...</p>
      ) : auctions.length === 0 ? (
        <p>No live lucky bid auctions</p>
      ) : (
        auctions.map((a) => (
          <div key={a.id} className="border p-4 rounded mb-4 shadow">
            <p><strong>Auction ID:</strong> {a.id}</p>
            <p><strong>Seller:</strong> {a.seller}</p>
            <p><strong>Lucky Price:</strong> {a.luckyPrice} ETH</p>
            <p><strong>Ends at:</strong> {new Date(Number(a.endTime) * 1000).toLocaleString()}</p>
            <Button
              className="mt-2 bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => handleBid(a.id)}
            >
              Place Lucky Bid
            </Button>
          </div>
        ))
      )}
    </div>
  );
}