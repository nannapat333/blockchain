// SPDX-License-Identifier: MIT
// ─────────────────────────────────────────────
// 📘 Marketplace.sol
// This contract follows best practices in:
// - ✅ Modular Architecture (separate from auction logic)
// - ✅ Checks-Effects-Interactions for secure ETH transfers
// - ✅ Gas Optimization: custom errors and minimal storage
// ─────────────────────────────────────────────

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error InvalidPrice();
error AlreadySold();
error IncorrectAmount();
error OnlySeller();

contract Marketplace is ReentrancyGuard {
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool sold;
    }

    uint256 public listingCount;
    mapping(uint256 => Listing) public listings;

    event Listed(uint256 indexed listingId, address indexed seller, uint256 price);
    event Purchased(uint256 indexed listingId, address indexed buyer, uint256 price);

    function listNFT(address nftContract, uint256 tokenId, uint256 price) external {
        if (price == 0) revert InvalidPrice();

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        listings[listingCount] = Listing({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            sold: false
        });

        emit Listed(listingCount, msg.sender, price);

        unchecked {
            listingCount++;
        }
    }

    function buyNFT(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        if (listing.sold) revert AlreadySold();
        if (msg.value != listing.price) revert IncorrectAmount();

        listing.sold = true;

        IERC721(listing.nftContract).transferFrom(address(this), msg.sender, listing.tokenId);
        payable(listing.seller).transfer(msg.value);

        emit Purchased(listingId, msg.sender, msg.value);
    }
}
