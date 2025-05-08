/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error BiddingClosed();
error AuctionAlreadyEnded();
error AuctionNotEnded();
error OnlySeller();
error OnlyWinner();
error InvalidPrice();
error NotAdmin();

contract EnglishAuction is ReentrancyGuard {
    struct Auction {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 endTime;
        uint256 highestBid;
        address highestBidder;
        bool ended;
    }

    address public admin;
    uint256 public auctionCounter;
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => mapping(address => uint256)) public bids;

    event AuctionCreated(uint256 indexed auctionId, address indexed seller, address nftContract, uint256 tokenId, uint256 endTime);
    event BidPlaced(uint256 indexed auctionId, address indexed bidder, uint256 amount);
    event AuctionEnded(uint256 indexed auctionId, address winner, uint256 amount);
    event NFTClaimed(uint256 indexed auctionId, address winner);
    event FundsWithdrawn(uint256 indexed auctionId, address seller, uint256 amount);

    modifier auctionExists(uint256 auctionId) {
        require(auctionId < auctionCounter, "Auction does not exist");
        _;
    }

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createAuction(address _nftContract, uint256 _tokenId, uint256 _duration, uint256 _startingBid) external {
        if (_duration == 0) revert InvalidPrice();

        IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);

        auctions[auctionCounter] = Auction({
            seller: msg.sender,
            nftContract: _nftContract,
            tokenId: _tokenId,
            endTime: block.timestamp + _duration,
            highestBid: _startingBid,
            highestBidder: address(0),
            ended: false
        });

        emit AuctionCreated(auctionCounter, msg.sender, _nftContract, _tokenId, block.timestamp + _duration);
        unchecked {
            auctionCounter++;
        }
    }

    function getAuction(uint256 auctionId) public view returns (
        address seller,
        uint256 tokenId,
        uint256 highestBid,
        address highestBidder,
        uint256 endTime,
        bool ended
    ) {
        Auction memory a = auctions[auctionId];
        return (
            a.seller,
            a.tokenId,
            a.highestBid,
            a.highestBidder,
            a.endTime,
            a.ended
        );
    }

    function placeBid(uint256 auctionId) external payable auctionExists(auctionId) {
        Auction storage auction = auctions[auctionId];
        if (block.timestamp >= auction.endTime) revert BiddingClosed();
        if (msg.value <= auction.highestBid) revert InvalidPrice();

        if (auction.highestBidder != address(0)) {
            bids[auctionId][auction.highestBidder] += auction.highestBid;
        }

        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;

        emit BidPlaced(auctionId, msg.sender, msg.value);
    }

    function withdrawRefund(uint256 auctionId) external {
        uint256 amount = bids[auctionId][msg.sender];
        if (amount == 0) revert InvalidPrice();

        bids[auctionId][msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    function endAuction(uint256 auctionId) external auctionExists(auctionId) {
        Auction storage auction = auctions[auctionId];
        if (block.timestamp < auction.endTime) revert AuctionNotEnded();
        if (auction.ended) revert AuctionAlreadyEnded();

        auction.ended = true;
        emit AuctionEnded(auctionId, auction.highestBidder, auction.highestBid);
    }

    function forceEndAuction(uint256 auctionId) external auctionExists(auctionId) onlyAdmin {
        Auction storage auction = auctions[auctionId];
        if (auction.ended) revert AuctionAlreadyEnded();

        auction.ended = true;
        emit AuctionEnded(auctionId, auction.highestBidder, auction.highestBid);
    }

    function claimNFT(uint256 auctionId) external auctionExists(auctionId) {
        Auction storage auction = auctions[auctionId];
        if (!auction.ended) revert AuctionNotEnded();
        if (msg.sender != auction.highestBidder) revert OnlyWinner();

        IERC721(auction.nftContract).transferFrom(address(this), msg.sender, auction.tokenId);
        emit NFTClaimed(auctionId, msg.sender);
    }

    function withdrawFunds(uint256 auctionId) external auctionExists(auctionId) nonReentrant {
        Auction storage auction = auctions[auctionId];
        if (!auction.ended) revert AuctionNotEnded();
        if (msg.sender != auction.seller) revert OnlySeller();

        uint256 amount = auction.highestBid;
        auction.highestBid = 0;

        payable(msg.sender).transfer(amount);
        emit FundsWithdrawn(auctionId, msg.sender, amount);
    }
}