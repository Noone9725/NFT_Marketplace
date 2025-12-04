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
    // Thẻ bao ngoài cùng: Nền trắng, có đường kẻ dưới mờ
    <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', width: '100%' }}>
      
      {/* Thẻ bên trong: Dùng class navbar-container để căn giữa nội dung giống phần thân trang */}
      <div className="navbar-container" style={{ height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo / Menu bên trái */}
        <div className="links" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: '#007bff', marginRight: '20px' }}>NFT Market</h2>
          
          <Link to="/" style={{ textDecoration: 'none', color: '#374151', fontWeight: '500', fontSize: '16px' }}>
            Market
          </Link>
          <Link to="/my-nfts" style={{ textDecoration: 'none', color: '#374151', fontWeight: '500', fontSize: '16px' }}>
            My NFTs
          </Link>
          <Link to="/mint" style={{ textDecoration: 'none', color: '#374151', fontWeight: '500', fontSize: '16px' }}>
            Mint NFT
          </Link>
        </div>
        
        {/* Nút Connect bên phải */}
        <div>
          {account ? (
            <button 
              onClick={disconnectWallet}
              style={{ padding: '8px 16px', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', fontWeight: '600' }}
            >
              Disconnect: {account.substring(0, 5)}...
            </button>
          ) : (
            <button 
              onClick={connectWallet}
              style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600' }}
            >
              Connect Wallet
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;