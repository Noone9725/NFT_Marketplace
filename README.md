# NFT Marketplace (Sàn giao dịch NFT Phi tập trung)

Một ứng dụng web phi tập trung (DApp) cho phép người dùng đúc (Mint), mua, bán và quản lý NFT trên mạng lưới Blockchain Ethereum. Dự án được xây dựng cho mục đích học tập - Bài tập lớn.

## ✨ Tính năng chính (Features)

* **🎨 Mint NFT:** Cho phép người dùng upload ảnh lên IPFS (qua Pinata) và tạo NFT mới lưu trữ trên Blockchain.
* **🛒 Marketplace:** Hiển thị tất cả các NFT đang được rao bán công khai. Người dùng có thể mua ngay lập tức.
* **👛 Kết nối Ví:** Tích hợp đăng nhập và xác thực giao dịch thông qua ví MetaMask.
* **💼 Quản lý NFT cá nhân (My NFTs):**
    * Xem danh sách NFT đang sở hữu.
    * Niêm yết bán (List) NFT lên sàn.
    * Hủy bán (Cancel Listing) lấy lại NFT về ví.
    * Cập nhật thông tin NFT (Update Metadata).

## 🛠️ Công nghệ sử dụng (Tech Stack)

### Frontend
* **Framework:** ReactJS (Vite) - Tốc độ build nhanh và nhẹ.
* **Ngôn ngữ:** JavaScript (ES6+).
* **Routing:** React Router Dom v6.
* **HTTP Client:** Axios (Gọi API Pinata và IPFS).
* **Styling:** CSS3 thuần (Tùy chỉnh Responsive).

### Blockchain & Backend
* **Blockchain:** Ethereum (Mạng Localhost Hardhat & Sepolia Testnet).
* **Smart Contract:** Solidity ^0.8.20.
* **Thư viện:** OpenZeppelin (ERC721URIStorage, Ownable).
* **Môi trường phát triển:** Hardhat.
* **Tương tác Blockchain:** Ethers.js v6.

### Lưu trữ (Storage)
* **IPFS:** Lưu trữ phi tập trung cho hình ảnh và Metadata.
* **Gateway:** Pinata IPFS.

## 📋 Yêu cầu tiên quyết (Prerequisites)

Trước khi cài đặt, hãy đảm bảo máy tính của bạn đã cài:
* [Node.js](https://nodejs.org/) (Phiên bản v18 trở lên).
* [Git](https://git-scm.com/).
* Trình duyệt có cài Extension [MetaMask](https://metamask.io/).

## 🚀 Hướng dẫn cài đặt (Installation)

### 1. Clone dự án về máy

```bash
git clone <đường-dẫn-repo-của-bạn>
cd BTL_Blockchain
```

### 2. Cài đặt và Triển khai Smart Contract (Backend)

Mở một terminal mới, di chuyển vào thư mục Contract:

```bash
cd nft-contract
npm install
```
Khởi động mạng Blockchain cục bộ (Giữ terminal này luôn chạy):

```bash
npx hardhat node
```

Mở một terminal khác, triển khai Smart Contract lên mạng Local:

```bash
cd nft-contract
npx hardhat run scripts/deploy.js --network localhost
```

** Lưu ý: Sau khi deploy, hãy copy địa chỉ Contract (ví dụ: 0x5Fb...) để dán vào file cấu hình Frontend.

### 3. Cài đặt và Chạy Frontend

Di chuyển vào thư mục Frontend:

```bash
cd ../nft-marketplace
npm install
```

Cấu hình biến môi trường: Tạo file .env tại thư mục nft-marketplace và điền API Key của Pinata theo cấu trúc file .env.example:

```bash
VITE_PINATA_API_KEY=your_api_key
VITE_PINATA_SECRET_KEY=your_secret_key
```

** Cập nhật CONTRACT_ADDRESS: Mở file nft-marketplace/src/utils/contract.js và cập nhật biến 'CONTRACT_ADDRESS' bằng địa chỉ bạn vừa deploy ở bước 2.

Khởi chạy ứng dụng:

```bash
npm run dev
```
** Truy cập http://localhost:5173 trên trình duyệt để trải nghiệm

## 📖 Hướng dẫn sử dụng (Usage Guide)

### 1. Kết nối Ví (Connecting Wallet)
* Click nút "Connect Wallet" ở góc trên bên phải.
* Xác nhận kết nối trong MetaMask (Chọn mạng Localhost 8545).

### 2. Tạo NFT (Minting)
* Vào trang "Mint NFT".
* Nhập tên, mô tả và chọn file ảnh.
* Bấm "Tạo NFT" và xác nhận giao dịch trên ví.

### 3. Bán NFT (Selling)
* Vào trang "My NFTs".
* Chọn NFT bạn muốn bán, bấm "Niêm yết bán".
* Nhập giá (ETH) và xác nhận.

### 4. Mua NFT (Buying)
* Vào trang "Market".
* Chọn NFT muốn mua, bấm "Buy Now".
* Thanh toán bằng ETH testnet và NFT sẽ chuyển về ví của bạn.

## 📂 Cấu trúc dự án (Project Structure)"

```
BTL_Blockchain/
├── nft-contract/           # Mã nguồn Smart Contract (Hardhat)
│   ├── contracts/          # File Solidity (.sol)
│   ├── scripts/            # Script deploy
│   └── test/               # Script test contract
│
└── nft-marketplace/        # Mã nguồn Frontend (React/Vite)
    ├── src/
    │   ├── components/     # Các component tái sử dụng (Navbar)
    │   ├── pages/          # Các trang chính (Market, Mint, MyNFTs)
    │   ├── utils/          # File cấu hình (contract.js, pinata.js)
    │   └── App.jsx         # Luồng chính của ứng dụng
    └── public/             # Tài nguyên tĩnh
```

## ⚠️ Khắc phục một số lỗi thường gặp (Troubleshooting)
* Lỗi Nonce too high / Internal JSON-RPC error: Do khởi động lại hardhat node. Hãy vào MetaMask -> Cài đặt -> Nâng cao -> Xóa dữ liệu thẻ hoạt động (Clear activity tab data).
* Không hiện ảnh NFT: Kiểm tra lại kết nối mạng hoặc thử đổi IPFS Gateway trong code.
* Trang web trống: Kiểm tra lại file .env xem đã điền đúng API Key của Pinata chưa.

## 📜 Giấy phép (License)
Dự án này được phát hành dưới giấy phép MIT License.
