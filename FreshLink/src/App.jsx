import React, { useEffect, useState } from 'react';
import Splash from './assets/Components/Splash/splash';
import Register from './assets/Components/Register/register';
import Login from './assets/Components/Login/login';
import BuyerHome from './assets/Components/BuyerHome/buyerhome';
import SellerHome from "./assets/Components/SellerHome/sellerhome";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [hideSplash, setHideSplash] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHideSplash(true);
      setTimeout(() => setLoading(false), 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-all duration-500 ease-in-out ${
          hideSplash ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
        }`}
      >
        <Splash />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Redirect root path to /register */}
        <Route path="/" element={<Navigate to="/register" replace />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/buyer-home" element={<BuyerHome />} />
        <Route path="/seller-home" element={<SellerHome />} />
      </Routes>
    </Router>
  );
};

export default App;
