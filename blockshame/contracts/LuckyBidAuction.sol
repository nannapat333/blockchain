// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error BiddingClosed();
error AuctionAlreadyEnded();
error AuctionNotEnded();
error AuctionNotClaimable();
error OnlySeller();
error OnlyWinner();
error AlreadyBid();
error InvalidPrice();

contract LuckyBidAuction is ReentrancyGuard {
    struct Auction {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 luckyPrice;
        uint256 endTime;
        bool ended;
        address winner;
        bool claimed;
    }

    uint256 public auctionCount;
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => mapping(address => uint256)) public bids;
    mapping(uint256 => address[]) public bidders;

    event AuctionCreated(uint256 indexed auctionId, address seller, uint256 luckyPrice, uint256 endTime);
    event BidPlaced(uint256 indexed auctionId, address bidder, uint256 amount);
    event AuctionEnded(uint256 indexed auctionId, address winner, uint256 winningBid);
    event NFTClaimed(uint256 indexed auctionId, address winner);
    event FundsWithdrawn(uint256 indexed auctionId, address seller, uint256 amount);

    modifier auctionExists(uint256 auctionId) {
        require(auctionId < auctionCount, "Auction does not exist");
        _;
    }

    function createLuckyAuction(
        address _nftContract,
        uint256 _tokenId,
        uint256 _luckyPrice,
        uint256 _duration
    ) external {
        if (_duration == 0) revert InvalidPrice();

        IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);

        auctions[auctionCount] = Auction({
            seller: msg.sender,
            nftContract: _nftContract,
            tokenId: _tokenId,
            luckyPrice: _luckyPrice,
            endTime: block.timestamp + _duration,
            ended: false,
            winner: address(0),
            claimed: false
        });

        emit AuctionCreated(auctionCount, msg.sender, _luckyPrice, block.timestamp + _duration);

        unchecked {
            auctionCount++;
        }
    }

    function getLuckyAuction(uint256 auctionId) public view returns (
        address seller,
        address nftContract,
        uint256 tokenId,
        uint256 luckyPrice,
        uint256 endTime,
        bool ended,
        address winner,
        bool claimed
    ) {
        Auction memory a = auctions[auctionId];
        return (
            a.seller,
            a.nftContract,
            a.tokenId,
            a.luckyPrice,
            a.endTime,
            a.ended,
            a.winner,
            a.claimed
        );
    }

    function placeLuckyBid(uint256 auctionId) external payable auctionExists(auctionId) {
        Auction storage auction = auctions[auctionId];
        if (block.timestamp >= auction.endTime) revert BiddingClosed();
        if (bids[auctionId][msg.sender] != 0) revert AlreadyBid();

        bids[auctionId][msg.sender] = msg.value;
        bidders[auctionId].push(msg.sender);

        emit BidPlaced(auctionId, msg.sender, msg.value);
    }

    function endLuckyAuction(uint256 auctionId) public auctionExists(auctionId) {
        Auction storage auction = auctions[auctionId];
        if (block.timestamp < auction.endTime) revert AuctionNotEnded();
        if (auction.ended) revert AuctionAlreadyEnded();

        _finalizeLuckyWinner(auctionId);
    }

    function forceEndAuction(uint256 auctionId) external auctionExists(auctionId) {
        Auction storage auction = auctions[auctionId];
        if (auction.ended) revert AuctionAlreadyEnded();

        _finalizeLuckyWinner(auctionId);
    }

    function _finalizeLuckyWinner(uint256 auctionId) internal {
        Auction storage auction = auctions[auctionId];

        uint256 closestDiff = type(uint256).max;
        address closestBidder;

        for (uint256 i = 0; i < bidders[auctionId].length; i++) {
            address bidder = bidders[auctionId][i];
            uint256 bidAmount = bids[auctionId][bidder];

            uint256 diff = bidAmount > auction.luckyPrice
                ? bidAmount - auction.luckyPrice
                : auction.luckyPrice - bidAmount;

            if (diff < closestDiff) {
                closestDiff = diff;
                closestBidder = bidder;
            }
        }

        auction.ended = true;
        auction.winner = closestBidder;

        emit AuctionEnded(auctionId, closestBidder, bids[auctionId][closestBidder]);
    }

    function claimLuckyNFT(uint256 auctionId) external auctionExists(auctionId) {
        Auction storage auction = auctions[auctionId];
        if (!auction.ended) revert AuctionNotEnded();
        if (msg.sender != auction.winner) revert OnlyWinner();
        if (auction.claimed) revert AuctionNotClaimable();

        auction.claimed = true;
        IERC721(auction.nftContract).transferFrom(address(this), msg.sender, auction.tokenId);

        emit NFTClaimed(auctionId, msg.sender);
    }

    function withdrawLuckyFunds(uint256 auctionId) external auctionExists(auctionId) nonReentrant {
        Auction storage auction = auctions[auctionId];
        if (!auction.ended) revert AuctionNotEnded();
        if (msg.sender != auction.seller) revert OnlySeller();
        if (auction.winner == address(0)) revert AuctionNotClaimable();

        uint256 amount = bids[auctionId][auction.winner];
        bids[auctionId][auction.winner] = 0;

        payable(msg.sender).transfer(amount);
        emit FundsWithdrawn(auctionId, msg.sender, amount);
    }
}