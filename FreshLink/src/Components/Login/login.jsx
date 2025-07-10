import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase'; // Adjust path based on your structure
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user type from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userType = userDoc.data()?.userType;

      if (userType === 'buyer') {
        navigate('/buyer-home');
      } else if (userType === 'seller') {
        navigate('/seller-home');
      } else {
        alert('Unknown user type.');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-lg flex flex-col gap-4">
        <h1 className="text-3xl font-[jura] text-[#097a45] text-center">
          Welcome Back!
        </h1>
        <h3 className="text-lg text-center text-[#827f7f]">
          Login to your FreshLink account
        </h3>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]"
        />
        <button
          onClick={handleLogin}
          className="bg-[#097a45] text-white rounded-md py-2 mt-2 hover:bg-[#086b3c] transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
