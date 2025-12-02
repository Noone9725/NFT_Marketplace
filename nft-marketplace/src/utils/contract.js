import { ethers } from 'ethers';

// 1. Dán địa chỉ Contract của bạn vào đây
export const CONTRACT_ADDRESS = "0xĐịa_Chỉ_Contract_Của_Bạn";

// 2. Dán ABI của bạn vào đây (Lấy từ artifacts/Remix)
export const CONTRACT_ABI = [
    // Ví dụ một vài hàm mẫu, bạn phải thay bằng ABI thật của bạn
    "function getAllNFTs() view returns (tuple(uint256 tokenId, address seller, uint256 price, bool listed)[])",
    "function getMyNFTs() view returns (tuple(uint256 tokenId, ...)[])",
    "function mint(string memory tokenURI) public returns (uint256)",
    "function buyNFT(uint256 tokenId) public payable",
    "function listNFT(uint256 tokenId, uint256 price) public",
    "function cancelListing(uint256 tokenId) public"
];

// Hàm lấy đối tượng Contract
export const getContract = async (signerOrProvider) => {
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
};