import React, { useEffect, useState } from 'react';
import Splash from './Components/Splash/Splash';
import Register from './Components/Register/register';
import Login from './Components/Login/login';
import BuyerHome from './Components/BuyerHome/buyerhome';
import SellerHome from './Components/SellerHome/sellerhome';
import ProtectedRoute from './Components/Auth/ProtectedRoute';
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

    {/* Protected Routes */}
    <Route
      path="/buyer-home"
      element={
        <ProtectedRoute>
          <BuyerHome />
        </ProtectedRoute>
      }
    />
    <Route
      path="/seller-home"
      element={
        <ProtectedRoute>
          <SellerHome />
        </ProtectedRoute>
      }
    />
  </Routes>
</Router>

  );
};

export default App;
