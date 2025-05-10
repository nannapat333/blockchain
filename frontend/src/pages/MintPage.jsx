"use client";

import { useState } from "react";
// import { formatEther, parseEther } from "ethers";
import { NFTStorage, File } from "nft.storage";
import { useWalletClient } from 'wagmi';
import { useContracts } from "../hooks/useContracts";

// REPLACE with your real key
const NFT_STORAGE_KEY = "PASTE_YOUR_KEY_HERE";

export default function MintPage() {
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [year, setYear] = useState("");
  const [frameType, setFrameType] = useState("");
  const [file, setFile] = useState(null);

  const { data: walletClient } = useWalletClient();
  const { buddhaNFT } = useContracts(walletClient);

  const handleMint = async () => {
    try {
      if (!file) throw new Error("No file selected");
      setStatus("⏳ Uploading to IPFS...");

      const client = new NFTStorage({ token: NFT_STORAGE_KEY });
      const metadata = await client.store({
        name,
        description: `${desc}\nYear: ${year}\nFrame Type: ${frameType}`,
        image: new File([file], file.name, { type: file.type }),
        properties: { year, frameType },
      });

      setStatus("⛓ Minting...");
      const tx = await buddhaNFT.connect(walletClient).mintNFT(
        walletClient.account.address,
        metadata.url,
        walletClient.account.address,
        500
      );
      await tx.wait();

      setStatus("✅ Minted successfully!");
    } catch (err) {
      console.error("Minting failed:", err);
      setStatus("❌ " + (err?.message || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-amber-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">BuddhaNFT Platform</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto p-6 max-w-xl">
        <h2 className="text-2xl font-bold mb-4 text-amber-900">Mint Buddha Amulet NFT</h2>

        <input type="text" className="w-full border rounded p-2 mb-2" placeholder="Name"
          value={name} onChange={(e) => setName(e.target.value)} />
        <textarea className="w-full border rounded p-2 mb-2" placeholder="Description"
          value={desc} onChange={(e) => setDesc(e.target.value)} />
        <input type="text" className="w-full border rounded p-2 mb-2" placeholder="Year"
          value={year} onChange={(e) => setYear(e.target.value)} />
        <input type="text" className="w-full border rounded p-2 mb-2" placeholder="Frame Type"
          value={frameType} onChange={(e) => setFrameType(e.target.value)} />
        <input type="file" className="mb-4"
          onChange={(e) => setFile(e.target.files?.[0] || null)} />

        <button className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded"
          onClick={handleMint} disabled={status.includes("⛓") || status.includes("⏳")}>
          {status.includes("⛓") || status.includes("⏳") ? "Processing..." : "Mint NFT"}
        </button>

        {status && <p className="mt-4 text-center">{status}</p>}
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center p-4 text-sm">
        © 2025 BuddhaNFT. All rights reserved.
      </footer>
    </div>
  );
}