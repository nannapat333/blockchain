
// import { Button } from './ui/button';

export default function NFTCard({ nft, onBuy }) {
    return (
      <div className="border rounded shadow hover:shadow-lg transition">
        <img src={nft.image} alt={nft.title} className="w-full h-auto" />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-amber-900">{nft.title}</h3>
          <p className="text-amber-600 mb-2">{nft.price} ETH</p>
          <button
            onClick={() => onBuy(nft.id)}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded"
          >
            Buy Now
          </button>
        </div>
      </div>
    );
  }