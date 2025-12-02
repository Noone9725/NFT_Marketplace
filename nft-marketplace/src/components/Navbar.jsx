import { Link } from 'react-router-dom';

const Navbar = ({ account, setAccount }) => {
  
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Lỗi kết nối ví:", error);
      }
    } else {
      alert("Vui lòng cài đặt MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setAccount(null); // Xóa trạng thái account cục bộ
  };

  return (
    <nav style={{ padding: '20px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="links" style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>Market</Link>
        <Link to="/my-nfts" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>My NFTs</Link>
        <Link to="/mint" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>Mint NFT</Link>
      </div>
      
      {account ? (
        <button 
          onClick={disconnectWallet}
          style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Connected: {account.substring(0, 6)}... (Logout)
        </button>
      ) : (
        <button 
          onClick={connectWallet}
          style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Connect Wallet
        </button>
      )}
    </nav>
  );
};

export default Navbar;