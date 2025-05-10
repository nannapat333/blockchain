"use client";

// import { ethers } from 'ethers';
import { useState, useEffect } from "react";
import { useWalletClient } from "wagmi";
import { formatEther, parseEther } from "ethers";
import { useContracts } from "../hooks/useContracts";
import Button from "../components/ui/button";

export default function EnglishAuctionPage() {
  const { data: walletClient } = useWalletClient();
  const { englishAuction } = useContracts(walletClient);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const count = await englishAuction.auctionCounter();
        const items = [];

        for (let i = 0; i < count; i++) {
          const auction = await englishAuction.auctions(i);
          if (!auction.ended) {
            items.push({
              id: i,
              highestBid: formatEther(auction.highestBid),
              endTime: auction.endTime.toString(),
              seller: auction.seller,
            });
          }
        }

        setAuctions(items);
      } catch (err) {
        console.error("Error fetching auctions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (englishAuction) fetchAuctions();
  }, [englishAuction]);

  const handleBid = async (id) => {
    const amount = prompt("Enter your bid amount (ETH)");
    if (!amount || isNaN(amount)) return alert("Invalid amount");

    try {
      const tx = await englishAuction.placeBid(id, {
        value: parseEther(amount),
      });
      await tx.wait();
      alert("Bid placed!");
    } catch (err) {
      console.error("Bid failed:", err);
      alert("Failed to place bid: " + (err.reason || err.message));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">English Auctions</h1>

      {loading ? (
        <p>Loading auctions...</p>
      ) : auctions.length === 0 ? (
        <p>No live auctions</p>
      ) : (
        auctions.map((a) => (
          <div key={a.id} className="border p-4 rounded mb-4 shadow">
            <p><strong>Auction ID:</strong> {a.id}</p>
            <p><strong>Seller:</strong> {a.seller}</p>
            <p><strong>Highest Bid:</strong> {a.highestBid} ETH</p>
            <p><strong>Ends at:</strong> {new Date(Number(a.endTime) * 1000).toLocaleString()}</p>
            <Button
              className="mt-2 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleBid(a.id)}
            >
              Place Bid
            </Button>
          </div>
        ))
      )}
    </div>
  );
}