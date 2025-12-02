import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { getContract, getProvider, getSigner } from '../utils/contract';

const Market = ({ account }) => { // Nhận account từ App.jsx
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNFTs = async () => {
    const provider = await getProvider();
    if (!provider) return;
    const contract = await getContract(provider);
    
    try {
        const data = await contract.fetchMarketItems();
        const items = await Promise.all(data.map(async i => {
            const tokenUri = await contract.tokenURI(i.tokenId);
            let meta = { data: { name: 'Unknown', image: '' } };
            try { meta = await axios.get(tokenUri); } catch (e) {}
            
            return {
                price: ethers.formatEther(i.price),
                tokenId: Number(i.tokenId),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description,
            };
        }));
        setNfts(items);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const buyNFT = async (nft) => {
    try {
        const signer = await getSigner();
        if(!signer) return alert("Vui lòng kết nối ví!");

        const contract = await getContract(signer);
        const price = ethers.parseEther(nft.price);
        const tx = await contract.createMarketSale(nft.tokenId, { value: price });
        await tx.wait(); 
        
        alert("Mua thành công!");
        loadNFTs();
    } catch (error) {
        console.error(error);
        alert("Giao dịch thất bại!");
    }
  };

  useEffect(() => { loadNFTs(); }, []);

  if (loading) return <div style={{padding:'20px'}}>Loading Market...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Marketplace</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {nfts.map((nft) => (
          <div key={nft.tokenId} style={{ border: '1px solid #ccc', borderRadius: '10px', overflow: 'hidden' }}>
            <img src={nft.image} alt={nft.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 5px 0' }}>{nft.name}</h3>
                <p style={{ fontSize: '14px', color: '#666' }}>Price: {nft.price} ETH</p>
                
                {/* LOGIC NÚT MUA / SỞ HỮU */}
                {account && nft.seller.toLowerCase() === account.toLowerCase() ? (
                    <button disabled style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', opacity: 0.8, cursor:'not-allowed' }}>
                        ✅ Của bạn (Đang bán)
                    </button>
                ) : (
                    <button onClick={() => buyNFT(nft)} style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Buy Now
                    </button>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Market;