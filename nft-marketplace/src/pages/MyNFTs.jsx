import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { getContract, getSigner } from '../utils/contract';
import { uploadJSONToIPFS } from '../utils/pinata';

const MyNFTs = ({ account }) => { // Nhận account từ props
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State quản lý form Bán
  const [sellingItem, setSellingItem] = useState(null);
  const [priceInput, setPriceInput] = useState('');
  
  // State quản lý form Sửa
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  // Load NFT
  const loadMyNFTs = async () => {
    if (!account) {
        setNfts([]); // Nếu không có account, xóa list
        return;
    }
    
    setLoading(true);
    const signer = await getSigner();
    if (!signer) return;

    const contract = await getContract(signer);
    
    try {
        const data = await contract.fetchMyNFTs();
        const items = await Promise.all(data.map(async i => {
            const tokenUri = await contract.tokenURI(i.tokenId);
            let meta = { data: { name: 'Unknown', description: '', image: '' } };
            try {
               meta = await axios.get(tokenUri);
            } catch (e) { console.log("Lỗi load IPFS", e) }

            let price = ethers.formatEther(i.price);
            
            return {
                price,
                tokenId: Number(i.tokenId),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description,
                tokenURI: tokenUri, // Giữ lại URI cũ để dùng nếu cần
                isListed: i.seller.toLowerCase() === account.toLowerCase()
            };
        }));
        setNfts(items);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  // Gọi load khi account thay đổi
  useEffect(() => {
    loadMyNFTs();
  }, [account]);

  // --- HÀM 1: NIÊM YẾT BÁN ---
  const sellNFT = async (id) => {
    if (!priceInput) return alert("Nhập giá!");
    try {
        const signer = await getSigner();
        const contract = await getContract(signer);
        const listingPrice = await contract.getListingPrice();
        const price = ethers.parseEther(priceInput);

        const tx = await contract.listToken(id, price, { value: listingPrice });
        await tx.wait();
        
        alert("Đã niêm yết thành công!");
        setSellingItem(null);
        setPriceInput('');
        loadMyNFTs(); // Reload ngay lập tức
    } catch (error) {
        console.error(error);
        alert("Lỗi niêm yết!");
    }
  };

  // --- HÀM 2: HỦY GIAO DỊCH ---
  const cancelListing = async (id) => {
      if(!confirm("Bạn chắc chắn muốn hủy bán NFT này?")) return;
      try {
        const signer = await getSigner();
        const contract = await getContract(signer);
        
        const tx = await contract.cancelListing(id);
        await tx.wait();

        alert("Đã hủy bán thành công! NFT đã về ví của bạn.");
        loadMyNFTs(); // Reload ngay lập tức
      } catch (error) {
          console.error(error);
          alert("Lỗi khi hủy bán!");
      }
  }

  // --- HÀM 3: SỬA THÔNG TIN (UPDATE METADATA) ---
  const handleUpdateClick = (nft) => {
      setEditingItem(nft.tokenId);
      setEditForm({ name: nft.name, description: nft.description, image: nft.image });
  }

  const saveUpdateNFT = async (id) => {
      try {
          // 1. Upload JSON mới lên IPFS (dùng ảnh cũ)
          const metadata = { 
              name: editForm.name, 
              description: editForm.description, 
              image: editForm.image // Giữ nguyên link ảnh cũ
          };
          const newTokenURI = await uploadJSONToIPFS(metadata);

          // 2. Gọi contract updateTokenURI
          const signer = await getSigner();
          const contract = await getContract(signer);
          
          const tx = await contract.updateTokenURI(id, newTokenURI);
          await tx.wait();

          alert("Cập nhật thông tin thành công!");
          setEditingItem(null);
          loadMyNFTs(); // Reload
      } catch (error) {
          console.error(error);
          alert("Lỗi cập nhật!");
      }
  }


  // --- RENDER ---
  if (!account) return <div style={{padding:'40px', textAlign:'center'}}><h2>Vui lòng kết nối ví MetaMask để xem tài sản.</h2></div>;
  if (loading) return <div style={{padding:'20px'}}>Đang tải dữ liệu...</div>;
  if (nfts.length === 0) return <div style={{padding:'20px'}}>Bạn không có NFT nào.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Collection ({account.substring(0,6)}...)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {nfts.map((nft) => (
          <div key={nft.tokenId} style={{ border: '1px solid #ccc', borderRadius: '10px', paddingBottom: '15px', background: '#fff' }}>
            <img src={nft.image} alt={nft.name} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '10px 10px 0 0' }} />
            
            <div style={{ padding: '0 15px' }}>
                {/* --- CHẾ ĐỘ SỬA --- */}
                {editingItem === nft.tokenId ? (
                    <div style={{marginTop: '10px'}}>
                        <input value={editForm.name} onChange={e=>setEditForm({...editForm, name: e.target.value})} placeholder="Tên mới" style={{width:'100%', marginBottom:'5px'}}/>
                        <textarea value={editForm.description} onChange={e=>setEditForm({...editForm, description: e.target.value})} placeholder="Mô tả mới" style={{width:'100%', height:'50px'}}/>
                        <div style={{display:'flex', gap:'5px', marginTop:'5px'}}>
                             <button onClick={() => saveUpdateNFT(nft.tokenId)} style={{background:'green', color:'white', flex:1}}>Lưu</button>
                             <button onClick={() => setEditingItem(null)} style={{background:'gray', color:'white', flex:1}}>Hủy</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                             <h3>{nft.name}</h3>
                             <button onClick={() => handleUpdateClick(nft)} style={{fontSize:'12px', cursor:'pointer'}}>✏️ Sửa</button>
                        </div>
                        <p style={{color:'#666', fontSize:'13px', margin:'5px 0'}}>{nft.description}</p>
                    </>
                )}
                
                <hr style={{margin:'10px 0', border:'0', borderTop:'1px solid #eee'}}/>

                {/* --- LOGIC TRẠNG THÁI BÁN --- */}
                {nft.isListed ? (
                    // TRƯỜNG HỢP: ĐANG RAO BÁN
                    <div>
                        <div style={{ color: '#d9534f', fontWeight: 'bold', marginBottom:'10px' }}>
                            🔥 Đang rao bán: {nft.price} ETH
                        </div>
                        <button 
                            onClick={() => cancelListing(nft.tokenId)}
                            style={{ width: '100%', padding: '10px', background: '#dc3545', color: 'white', border: 'none', borderRadius:'5px', cursor:'pointer' }}
                        >
                            Hủy Giao Dịch
                        </button>
                    </div>
                ) : (
                    // TRƯỜNG HỢP: TRONG VÍ
                    <div>
                        {sellingItem === nft.tokenId ? (
                            <div style={{ marginTop: '10px' }}>
                                <input 
                                    type="number" 
                                    placeholder="Giá ETH" 
                                    value={priceInput}
                                    onChange={(e) => setPriceInput(e.target.value)}
                                    style={{ width: '60%', padding:'5px', marginRight: '5px' }}
                                />
                                <button onClick={() => sellNFT(nft.tokenId)} style={{ background: 'blue', color: 'white', padding:'5px 10px' }}>Bán</button>
                                <button onClick={() => setSellingItem(null)} style={{ background: 'gray', color: 'white', padding:'5px 10px', marginLeft:'5px' }}>X</button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setSellingItem(nft.tokenId)}
                                style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius:'5px', cursor: 'pointer' }}
                            >
                                Niêm yết bán
                            </button>
                        )}
                    </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyNFTs;