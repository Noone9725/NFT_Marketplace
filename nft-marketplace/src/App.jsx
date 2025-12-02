import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Market from './pages/Market';
import MyNFTs from './pages/MyNFTs';
import Mint from './pages/Mint';

function App() {
  const [account, setAccount] = useState(null);

  return (
    <Router>
      <Navbar setAccount={setAccount} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Market />} />
          <Route path="/my-nfts" element={<MyNFTs />} />
          <Route path="/mint" element={<Mint />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;