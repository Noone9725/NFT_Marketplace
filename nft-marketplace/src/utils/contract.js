// src/utils/contract.js

import { ethers } from 'ethers';

// Import file JSON
import CONTRACT_ABI_ARRAY from './MarketplaceABI.json';

// Dán địa chỉ Contract
export const CONTRACT_ADDRESS = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";


// Helper lấy đối tượng Contract
// Hàm này linh hoạt: nhận vào Provider (để xem) hoặc Signer (để giao dịch)
export const getContract = async (signerOrProvider) => {
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI_ARRAY, signerOrProvider);
};

// --- CÁC HÀM TIỆN ÍCH HỖ TRỢ KẾT NỐI ---

// Lấy Provider (Dùng để ĐỌC dữ liệu: xem danh sách NFT, xem giá...)
// Không cần người dùng đăng nhập ví MetaMask vẫn xem được
export const getProvider = async () => {
    if (window.ethereum) {
        return new ethers.BrowserProvider(window.ethereum);
    }
    // (Tùy chọn) Nếu user không cài MetaMask, có thể trả về null hoặc báo lỗi
    return null;
};

// Lấy Signer (Dùng để GHI dữ liệu: Mint, Mua, Bán...)
// Bắt buộc người dùng phải kết nối ví và xác nhận giao dịch
export const getSigner = async () => {
    if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        // Dòng này sẽ yêu cầu user đăng nhập MetaMask nếu chưa kết nối
        const signer = await provider.getSigner();
        return signer;
    }
    return null;
};
