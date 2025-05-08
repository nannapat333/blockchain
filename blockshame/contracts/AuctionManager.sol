// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAuction {
    function forceEndAuction(uint256 auctionId) external;
}

contract AuctionManager {
    enum AuctionType { English, Lucky }

    struct AuctionInfo {
        AuctionType auctionType;
        address contractAddress;
        uint256 auctionId;
    }

    address public admin;
    uint256 public auctionIndex;
    mapping(uint256 => AuctionInfo) public allAuctions;

    event AuctionRegistered(uint256 indexed auctionIndex, AuctionType auctionType, address contractAddress, uint256 auctionId);
    event AuctionForceEnded(uint256 indexed auctionIndex, address contractAddress, uint256 auctionId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerAuction(AuctionType auctionType, address auctionContract, uint256 auctionId) external {
        allAuctions[auctionIndex] = AuctionInfo({
            auctionType: auctionType,
            contractAddress: auctionContract,
            auctionId: auctionId
        });

        emit AuctionRegistered(auctionIndex, auctionType, auctionContract, auctionId);
        unchecked {
            auctionIndex++;
        }
    }

    function getAuction(uint256 index) external view returns (AuctionInfo memory) {
        return allAuctions[index];
    }

    function forceEndAuction(uint256 index) external onlyAdmin {
        AuctionInfo memory auction = allAuctions[index];
        require(auction.contractAddress != address(0), "Invalid auction");

        IAuction(auction.contractAddress).forceEndAuction(auction.auctionId);
        emit AuctionForceEnded(index, auction.contractAddress, auction.auctionId);
    }
}