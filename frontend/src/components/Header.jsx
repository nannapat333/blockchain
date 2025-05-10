// src/components/Header.jsx

import { Link }from 'react-router-dom';

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <div className="text-2xl font-bold text-amber-600">BuddhaNFT</div>
      <nav className="flex space-x-6">
        <Link href="/marketplace" className="text-gray-700 hover:text-amber-600">Marketplace</Link>
        <Link href="/mint" className="text-gray-700 hover:text-amber-600">Mint</Link>
        <Link href="/english-auction" className="text-gray-700 hover:text-amber-600">English Auction</Link>
        <Link href="/lucky-auction" className="text-gray-700 hover:text-amber-600">Lucky Auction</Link>
        <Link href="/my-nfts" className="text-gray-700 hover:text-amber-600">My NFTs</Link>
        <Link href="/auction-manager" className="text-gray-700 hover:text-amber-600">Admin</Link>
      </nav>
      <button className="bg-amber-600 text-white px-4 py-2 rounded">Connect Wallet</button>
    </header>
  );
}