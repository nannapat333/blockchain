import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MintPage from "./pages/MintPage";
import MarketplacePage from "./pages/MarketplacePage";
import AuctionManagerPage from "./pages/AuctionManagerPage";
import EnglishAuctionPage from "./pages/EnglishAuctionPage";
import LuckyBidAuctionPage from "./pages/LuckyBidAuctionPage";
import MyNFTPage from "./pages/MyNFTPage";

function App() {
  return (
    <Router>
      <header className="bg-yellow-500 p-4 text-white flex justify-between">
        <h1 className="text-xl font-bold">BuddhaNFT</h1>
        <nav>
          <Link to="/" className="mr-4 hover:underline">
            Marketplace
          </Link>
          <Link to="/mint" className="mr-4 hover:underline">
            Mint
          </Link>
          <Link to="/english-auctions" className="mr-4 hover:underline">
            English Auctions
          </Link>
          <Link to="/lucky-auctions" className="mr-4 hover:underline">
            Lucky Auctions
          </Link>
          <Link to="/my-nfts" className="mr-4 hover:underline">
            My NFTs
          </Link>
          <Link to="/admin" className="hover:underline">
            Admin
          </Link>
        </nav>
      </header>

      <main className="p-4">
        <Routes>
          <Route path="/" element={<MarketplacePage />} />
          <Route path="/mint" element={<MintPage />} />
          <Route path="/english-auctions" element={<EnglishAuctionPage />} />
          <Route path="/lucky-auctions" element={<LuckyBidAuctionPage />} />
          <Route path="/my-nfts" element={<MyNFTPage />} />
          <Route path="/admin" element={<AuctionManagerPage />} />
        </Routes>
      </main>

      <footer className="bg-yellow-100 p-4 text-center text-sm">
        © 2025 BuddhaNFT Marketplace
      </footer>
    </Router>
  );
}

export default App;
