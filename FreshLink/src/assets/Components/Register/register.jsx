import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from "../../../firebase";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate(); // ✅ FIXED

  // State values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('buyer');

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User UID:', user.uid);


      // Save extra info to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName: name,
        email: email,
        userType: userType
      });

      alert("Registered successfully!");
      navigate('/login'); // ✅ now this will work
    } catch (error) {
      console.error('Registration error:', error.message);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-lg flex flex-col gap-4">
        <h1 className="text-3xl font-[jura] text-[#097a45] text-center">
          Let's Get You SetUP!
        </h1>
        <h3 className="text-lg text-center text-gray-600">
          Please fill the form below to register
        </h3>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]"
        />
        <select
          value={userType}
          onChange={e => setUserType(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]"
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]"
        />
        <button
          onClick={handleRegister}
          
          className="bg-[#097a45] text-white rounded-md py-2 mt-2 hover:bg-[#086b3c] transition"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
