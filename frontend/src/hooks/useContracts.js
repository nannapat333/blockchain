import { getContract } from 'viem';
import {
  BUDDHA_NFT_ADDRESS,
  BUDDHA_NFT_ABI,
  MARKETPLACE_ADDRESS,
  MARKETPLACE_ABI,
  ENGLISH_AUCTION_ADDRESS,
  ENGLISH_AUCTION_ABI,
  LUCKY_BID_AUCTION_ADDRESS,
  LUCKY_BID_AUCTION_ABI,
  AUCTION_MANAGER_ADDRESS,
  AUCTION_MANAGER_ABI,
} from '../utils/contracts';

export function useContracts(walletClient) {
  if (!walletClient) {
    return {
      buddhaNFT: null,
      marketplace: null,
      englishAuction: null,
      luckyBidAuction: null,
      auctionManager: null,
    };
  }

  const publicClient = walletClient?.publicClient;

  const buddhaNFT = getContract({
    address: BUDDHA_NFT_ADDRESS,
    abi: BUDDHA_NFT_ABI,
    client: { public: publicClient, wallet: walletClient },
  });

  const marketplace = getContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    client: { public: publicClient, wallet: walletClient },
  });

  const englishAuction = getContract({
    address: ENGLISH_AUCTION_ADDRESS,
    abi: ENGLISH_AUCTION_ABI,
    client: { public: publicClient, wallet: walletClient },
  });

  const luckyBidAuction = getContract({
    address: LUCKY_BID_AUCTION_ADDRESS,
    abi: LUCKY_BID_AUCTION_ABI,
    client: { public: publicClient, wallet: walletClient },
  });

  const auctionManager = getContract({
    address: AUCTION_MANAGER_ADDRESS,
    abi: AUCTION_MANAGER_ABI,
    client: { public: publicClient, wallet: walletClient },
  });

  return {
    buddhaNFT,
    marketplace,
    englishAuction,
    luckyBidAuction,
    auctionManager,
  };
}