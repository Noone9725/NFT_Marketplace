import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Market from './pages/Market';
import MyNFTs from './pages/MyNFTs';
import Mint from './pages/Mint';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    // Tự động check nếu đã connect từ trước
    const checkWallet = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };
    checkWallet();

    // Lắng nghe sự kiện thay đổi tài khoản từ Metamask
    if(window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if(accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, []);

  return (
    <Router>
      {/* Truyền account và setAccount xuống Navbar */}
      <Navbar account={account} setAccount={setAccount} />
      
      <div className="main-content container" style={{ marginTop: '30px' }}>
        <Routes>
          {/* Truyền account xuống các trang để chúng biết ai đang đăng nhập */}
          <Route path="/" element={<Market account={account} />} />
          <Route path="/my-nfts" element={<MyNFTs account={account} />} />
          <Route path="/mint" element={<Mint />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;