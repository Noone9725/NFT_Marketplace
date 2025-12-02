import { useState } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../utils/contract';

const Mint = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  
  const handleMint = async (e) => {
    e.preventDefault();
    if (!file || !name) return;

    try {
        // BƯỚC 1: Upload ảnh và JSON lên IPFS (Cần API Key của Pinata hoặc Web3.Storage)
        // const tokenURI = await uploadToIPFS(file, name);
        const tokenURI = "https://ipfs.io/ipfs/QmExampleHash..."; // Giả lập

        // BƯỚC 2: Gọi Smart Contract
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = await getContract(signer);

        const tx = await contract.mint(tokenURI);
        await tx.wait();
        alert("Mint thành công!");
    } catch (error) {
        console.error(error);
        alert("Lỗi khi Mint NFT");
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto' }}>
      <h2>Mint New NFT</h2>
      <form onSubmit={handleMint}>
        <div style={{ marginBottom: '10px' }}>
            <label>Tên NFT:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
            <label>Upload Ảnh:</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>Mint NFT</button>
      </form>
    </div>
  );
};

export default Mint;