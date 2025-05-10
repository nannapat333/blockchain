import Image from 'react';
import { Button } from './ui/button';

export default function AuctionCard({ auction, onBid }) {
  return (
    <div className="border rounded shadow p-4">
      <Image src={auction.image} alt={auction.title} width={300} height={300} className="mb-2" />
      <h3 className="text-lg font-semibold">{auction.title}</h3>
      <p className="text-sm">Current Bid: {auction.currentBid} ETH</p>
      <Button className="mt-2 bg-amber-600 hover:bg-amber-700 text-white" onClick={() => onBid(auction.id)}>
        Place Bid
      </Button>
    </div>
  );
}