// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    uint256 private _itemsSold;
    uint256 listingPrice = 0.025 ether;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated (
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    constructor() ERC721("Metaverse Tokens", "METT") Ownable(msg.sender) {}

    function updateListingPrice(uint256 _listingPrice) public payable onlyOwner {
        listingPrice = _listingPrice;
    }

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    // 1. MINT (Tạo NFT)
    function mintToken(string memory tokenURI) public returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        idToMarketItem[newTokenId] = MarketItem(
            newTokenId,
            payable(address(0)),
            payable(msg.sender),
            0,
            false
        );

        return newTokenId;
    }

    // 2. LIST (Niêm yết bán)
    function listToken(uint256 tokenId, uint256 price) public payable {
        require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
        require(msg.value == listingPrice, "Price must be equal to listing price");
        require(price > 0, "Price must be at least 1 wei");

        _transfer(msg.sender, address(this), tokenId);

        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].sold = false;

        emit MarketItemCreated(tokenId, msg.sender, address(this), price, false);
    }

    // 3. CANCEL LISTING (Hủy bán - MỚI THÊM)
    function cancelListing(uint256 tokenId) public {
        require(idToMarketItem[tokenId].seller == msg.sender, "Only seller can cancel listing");
        require(idToMarketItem[tokenId].sold == false, "Item already sold");

        _transfer(address(this), msg.sender, tokenId); // Trả NFT về ví owner

        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].seller = payable(address(0));
        idToMarketItem[tokenId].price = 0;
        idToMarketItem[tokenId].sold = false;
    }

    // 4. UPDATE TOKEN URI (Sửa thông tin - MỚI THÊM)
    function updateTokenURI(uint256 tokenId, string memory newTokenURI) public {
        // Chỉ cho phép sửa nếu là Owner (chưa bán) hoặc Seller (đang bán)
        require(idToMarketItem[tokenId].owner == msg.sender || idToMarketItem[tokenId].seller == msg.sender, "You are not the owner");
        
        _setTokenURI(tokenId, newTokenURI);
    }

    // 5. BUY (Mua NFT)
    function createMarketSale(uint256 tokenId) public payable {
        uint price = idToMarketItem[tokenId].price;
        address seller = idToMarketItem[tokenId].seller;
        require(msg.value == price, "Please submit the asking price");
        
        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));
        _itemsSold++;

        _transfer(address(this), msg.sender, tokenId);
        payable(seller).transfer(msg.value);
        payable(owner()).transfer(listingPrice);
    }

    // GETTERS
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _tokenIds;
        uint currentIndex = 0;

        uint activeCount = 0;
        for(uint i = 0; i < itemCount; i++) {
             if (idToMarketItem[i + 1].owner == address(this)) {
                 activeCount++;
             }
        }

        MarketItem[] memory items = new MarketItem[](activeCount);
        for (uint i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(this)) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _tokenIds;
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender || idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender || idToMarketItem[i + 1].seller == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}