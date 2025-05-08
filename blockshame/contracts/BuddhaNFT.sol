// SPDX-License-Identifier: MIT
// ─────────────────────────────────────────────
// 📘 BuddhaNFT.sol
// This contract follows best practices in:
// - ✅ ERC721 with URI metadata
// - ✅ ERC2981 royalty standard support
// - ✅ Clean override logic
// - ✅ Ready for integration with auction and marketplace contracts
// ─────────────────────────────────────────────

pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
using Counters for Counters.Counter;


contract BuddhaNFT is
    Initializable,
    ERC721URIStorageUpgradeable,
    ERC2981Upgradeable,
    OwnableUpgradeable
{
    Counters.Counter private _tokenIdCounter;
    uint256 public nextTokenId;

    function initialize() public initializer {
        __ERC721_init("BuddhaNFT", "BAMU");
        __ERC721URIStorage_init();
        __ERC2981_init();
        __Ownable_init();
    }

    function mintNFT(
        address to,
        string memory uri,
        address royaltyReceiver,
        uint96 royaltyFee
    ) external returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _setTokenRoyalty(tokenId, royaltyReceiver, royaltyFee);
        return tokenId;
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorageUpgradeable, ERC2981Upgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
    uint256 balance = balanceOf(owner);
    uint256[] memory tokenIds = new uint256[](balance);
    uint256 index = 0;

    for (uint256 tokenId = 0; tokenId < _tokenIdCounter.current(); tokenId++) {
        if (_exists(tokenId) && ownerOf(tokenId) == owner) {
            tokenIds[index++] = tokenId;
        }
    }

    return tokenIds;
}

}
