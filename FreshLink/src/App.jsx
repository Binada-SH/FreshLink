import React, { useEffect, useState } from 'react';
import Splash from './Components/Splash/splash';
import Register from './Components/Register/register';
import Login from './Components/Login/login';
import BuyerHome from './Components/BuyerHome/buyerhome';
import SellerHome from './Components/SellerHome/sellerhome';
import ProtectedRoute from './Components/Auth/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Import LanguageProvider and LanguageSelector from your language components file
import { LanguageProvider, LanguageSelector } from './Components/LanguageSelection/Language';

// This component will contain the actual routing and logic that uses useNavigate,
// as useNavigate must be called inside a component wrapped by Router.
const AppContent = () => {
  const [loading, setLoading] = useState(true); // Controls splash screen visibility
  const [hideSplash, setHideSplash] = useState(false); // Controls splash screen fade-out
  const navigate = useNavigate(); // useNavigate is now inside a component wrapped by Router

  useEffect(() => {
    // Timer for the splash screen duration
    const splashTimer = setTimeout(() => {
      setHideSplash(true); // Start the fade-out animation for the splash screen
      setTimeout(() => {
        setLoading(false); // Fully hide the splash screen after fade-out
        // After splash, always navigate to the language selection page
        navigate('/language-select');
      }, 500); // This delay should match the 'transition-all duration-500' on the splash div
    }, 2000); // Duration the splash screen is fully visible

    // Cleanup function for the timer
    return () => clearTimeout(splashTimer);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Callback function to be passed to LanguageSelector.
  // This is called when the user selects a language and clicks 'Continue'.
  const handleLanguageSelected = () => {
    // After language selection is complete, navigate to the register page
    navigate('/register');
  };

  // Conditional rendering for the splash screen
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

  // Main application routing, rendered only after splash is done
  return (
    <Routes>
      {/* Default root path redirects to language selection after splash */}
      <Route path="/" element={<Navigate to="/language-select" replace />} />

      {/* Dedicated Language Selection Route */}
      <Route
        path="/language-select"
        element={<LanguageSelector onLanguageSelected={handleLanguageSelected} />}
      />

      {/* Other application routes */}
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
  );
};

// The main App component wraps everything in LanguageProvider and Router
const App = () => {
  return (
    <LanguageProvider>
      <Router>
        <AppContent /> {/* Render the AppContent inside Router */}
      </Router>
    </LanguageProvider>
  );
};

export default App;
