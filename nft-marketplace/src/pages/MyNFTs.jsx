import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../utils/contract';

const MyNFTs = () => {
  const [myNfts, setMyNfts] = useState([]);
  
  const loadMyNFTs = async () => {
     // Logic tương tự Market, nhưng gọi hàm filter theo msg.sender
     // const data = await contract.getMyNFTs();
     
     // --- DỮ LIỆU GIẢ LẬP ---
     setMyNfts([
        { tokenId: 3, name: "My Art", price: "0", listed: false, image: "https://via.placeholder.com/150" },
        { tokenId: 4, name: "Selling Art", price: "2.0", listed: true, image: "https://via.placeholder.com/150" }
     ]);
  };

  const listNFT = async (id, price) => {
      // Gọi contract.listNFT(id, price)
      console.log(`Listing ${id} for ${price}`);
  };

  const cancelListing = async (id) => {
      // Gọi contract.cancelListing(id)
      console.log(`Cancel listing ${id}`);
  };

  useEffect(() => { loadMyNFTs(); }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Collection</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {myNfts.map((nft) => (
          <div key={nft.tokenId} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <img src={nft.image} style={{ width: '100%' }} />
            <p>Status: <strong>{nft.listed ? "Đang bán" : "Trong ví"}</strong></p>
            
            {nft.listed ? (
               <button onClick={() => cancelListing(nft.tokenId)} style={{ background: 'red', color: 'white' }}>Hủy bán</button>
            ) : (
               <button onClick={() => listNFT(nft.tokenId, "0.1")} style={{ background: 'green', color: 'white' }}>Niêm yết (0.1 ETH)</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyNFTs;