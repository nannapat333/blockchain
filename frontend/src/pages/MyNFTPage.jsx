"use client";

import { useState, useEffect } from "react";
import { useWalletClient } from "wagmi";
// import { formatEther, parseEther } from "ethers";
import { useContracts } from "../hooks/useContracts";
// import Button from "../components/ui/button";
// import Image from "next/image";

export default function MyNFTsPage() {
  const { data: walletClient } = useWalletClient();
  const { buddhaNFT } = useContracts(walletClient);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMyNFTs = async () => {
      if (!buddhaNFT || !walletClient) return;
      try {
        setLoading(true);
        const address = await walletClient.getAddress();
        const balance = await buddhaNFT.balanceOf(address);
        const items = [];

        for (let i = 0; i < balance; i++) {
          const tokenId = await buddhaNFT.tokenOfOwnerByIndex(address, i);
          const tokenURI = await buddhaNFT.tokenURI(tokenId);
          const res = await fetch(tokenURI);
          const metadata = await res.json();

          items.push({
            tokenId: tokenId.toString(),
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
          });
        }

        setNfts(items);
      } catch (err) {
        console.error("Failed to fetch NFTs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyNFTs();
  }, [buddhaNFT, walletClient]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-4">My Buddha NFTs</h1>

      {loading ? (
        <p>Loading your NFTs...</p>
      ) : nfts.length === 0 ? (
        <p>You don’t own any Buddha NFTs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <div key={nft.tokenId} className="border rounded shadow p-4">
              <img
                src={nft.image}
                alt={nft.name}
                width={300}
                height={300}
                className="rounded mb-2 object-cover"
              />
              <h2 className="font-semibold">{nft.name}</h2>
              <p className="text-sm text-gray-600">{nft.description}</p>
              <p className="text-xs text-gray-400 mt-1">Token ID: {nft.tokenId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}