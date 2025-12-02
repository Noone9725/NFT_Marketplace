import { useState } from 'react';
import { getContract, getSigner } from '../utils/contract';
import { uploadFileToIPFS, uploadJSONToIPFS } from '../utils/pinata';

const Mint = () => {
  const [formInput, setFormInput] = useState({ name: '', description: '' }); // Bỏ price
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    try {
        setLoading(true);
        const url = await uploadFileToIPFS(file);
        setFileUrl(url);
        setLoading(false);
    } catch (error) {
        console.log("Lỗi upload file:", error);
        setLoading(false);
    }
  };

  const mintNFT = async () => {
    const { name, description } = formInput;
    if (!name || !description || !fileUrl) return;

    try {
        setLoading(true);
        // 1. Upload Metadata
        const metadata = { name, description, image: fileUrl };
        const tokenURI = await uploadJSONToIPFS(metadata);

        // 2. Gọi hàm mintToken (Không cần phí Listing)
        const signer = await getSigner();
        const contract = await getContract(signer);

        const transaction = await contract.mintToken(tokenURI);
        await transaction.wait();

        alert("Mint thành công! Hãy vào 'My NFTs' để kiểm tra hoặc niêm yết bán.");
        setFormInput({ name: '', description: '' });
        setFileUrl(null);
        setLoading(false);
    } catch (error) {
        console.error("Lỗi Mint:", error);
        alert("Có lỗi xảy ra!");
        setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <div style={{ width: '500px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h2>Create New NFT</h2>
        <input 
          placeholder="Tên NFT"
          style={{ padding: '10px' }}
          onChange={e => setFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Mô tả"
          style={{ padding: '10px', height: '100px' }}
          onChange={e => setFormInput({ ...formInput, description: e.target.value })}
        />
        <input type="file" onChange={onFileChange} />
        {fileUrl && <img width="350" src={fileUrl} style={{ alignSelf: 'center', borderRadius: '10px' }} />}
        
        <button 
            onClick={mintNFT} 
            disabled={loading}
            style={{ padding: '15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {loading ? "Đang xử lý..." : "Tạo NFT (Lưu vào ví)"}
        </button>
      </div>
    </div>
  );
};

export default Mint;