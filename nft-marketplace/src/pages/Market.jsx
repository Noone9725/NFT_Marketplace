import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../utils/contract';

const Market = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Giả lập load dữ liệu ( cần thay bằng call contract thật)
  const loadNFTs = async () => {
    if(!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    // Dùng provider để đọc dữ liệu mà không cần kết nối ví
    const contract = await getContract(provider);
    
    try {
        // const data = await contract.getAllNFTs(); // Gọi hàm smart contract
        // setNfts(data);
        
        // --- DỮ LIỆU GIẢ LẬP ĐỂ TEST GIAO DIỆN ---
        setNfts([
            { tokenId: 1, name: "NFT #1", price: "0.5", seller: "0x123...", listed: true, image: "https://via.placeholder.com/150" },
            { tokenId: 2, name: "NFT #2", price: "1.2", seller: "0x456...", listed: true, image: "https://via.placeholder.com/150" }
        ]);
    } catch (err) {
        console.error(err);
    }
    setLoading(false);
  };

  const buyNFT = async (nft) => {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner(); // Cần signer để trả tiền
        const contract = await getContract(signer);
        
        const price = ethers.parseEther(nft.price);
        const tx = await contract.buyNFT(nft.tokenId, { value: price });
        await tx.wait(); // Chờ giao dịch xác nhận
        
        alert("Mua thành công!");
        loadNFTs(); // Reload lại danh sách
    } catch (error) {
        alert("Giao dịch thất bại hoặc chưa kết nối ví!");
    }
  };

  useEffect(() => { loadNFTs(); }, []);

  if (loading) return <div>Đang tải dữ liệu blockchain...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Marketplace</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {nfts.map((nft) => (
          <div key={nft.tokenId} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
            <img src={nft.image} alt={nft.name} style={{ width: '100%' }} />
            <h3>{nft.name}</h3>
            <p>Price: {nft.price} ETH</p>
            <button onClick={() => buyNFT(nft)} style={{ width: '100%', padding: '10px', background: 'blue', color: 'white' }}>
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Market;