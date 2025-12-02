// Kết nối metamask
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

const Navbar = ({ setAccount }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setWalletAddress(address);
        setIsConnected(true);
      } catch (error) {
        console.error("Lỗi kết nối ví:", error);
      }
    } else {
      alert("Vui lòng cài đặt MetaMask!");
    }
  };

  return (
    <nav style={{ padding: '20px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
      <div className="links">
        <Link to="/" style={{ marginRight: '15px' }}>Market</Link>
        <Link to="/my-nfts" style={{ marginRight: '15px' }}>My NFTs</Link>
        <Link to="/mint">Mint NFT</Link>
      </div>
      <button onClick={connectWallet} disabled={isConnected}>
        {isConnected ? `Connected: ${walletAddress.substring(0, 6)}...` : "Connect Wallet"}
      </button>
    </nav>
  );
};

export default Navbar;