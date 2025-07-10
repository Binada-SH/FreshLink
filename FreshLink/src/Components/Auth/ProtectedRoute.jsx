import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  if (checking) {
    // You can show a spinner here if you want
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/register" replace />;
  }

  return children;
};

export default ProtectedRoute;
