import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from "../../firebase";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [userType, setUserType] = useState("buyer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Seller-specific
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [category, setCategory] = useState("");
  const [items, setItems] = useState("");
  const [idPhoto, setIdPhoto] = useState(null);
  const [facePhoto, setFacePhoto] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        fullName: name,
        email,
        userType,
      };

      if (userType === "seller") {
        userData.address = address;
        userData.age = age;
        userData.category = category;
        userData.items = items;
        userData.pendingApproval = true; // Manual verification needed
      }

      await setDoc(doc(db, "users", user.uid), userData);

      alert("Registered successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-lg flex flex-col gap-4">
        <h1 className="text-3xl font-[jura] text-[#097a45] text-center">Let's Get You SetUP!</h1>
        <h3 className="text-lg text-center text-gray-600">Please fill the form below to register</h3>

        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]"  />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]" />
        <select value={userType} onChange={e => setUserType(e.target.value)}  className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]">
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]" />

        {/* Seller-specific fields */}
        {userType === "seller" && (
          <>
            <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]" />
            <input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]" />
            <input type="text" placeholder="What category do you sell in?" value={category} onChange={e => setCategory(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]" />
            <input type="text" placeholder="What items do you sell?" value={items} onChange={e => setItems(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]" />
            {/* NIC / ID Upload */}
          <div className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 w-full focus-within:ring-2 focus-within:ring-[#097a45] mb-4">
            <label className="text-sm text-gray-700">Upload NIC / ID:</label>
            <label className="cursor-pointer bg-[#d6f1e4] text-[#097a45] px-4 py-1 rounded-md text-sm font-medium hover:bg-[#c1e9d5] transition">Choose File
              <input
                type="file"
                onChange={e => setIdPhoto(e.target.files[0])}
                className="hidden"/>
  </label>
</div>

{/* Face Photo Upload */}
<div className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 w-full focus-within:ring-2 focus-within:ring-[#097a45]">
  <label className="text-sm text-gray-700">Upload Face Photo:</label>
  <label className="cursor-pointer bg-[#d6f1e4] text-[#097a45] px-4 py-1 rounded-md text-sm font-medium hover:bg-[#c1e9d5] transition">
    Choose File
    <input
      type="file"
      onChange={e => setFacePhoto(e.target.files[0])}
      className="hidden"
    />
  </label>
</div>

          </>
        )}

        <button onClick={handleRegister} className="bg-[#097a45] text-white rounded-md py-2 mt-2 hover:bg-[#086b3c] transition">Register</button>

        <div className="flex items-center gap-4 my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <h6 className="text-[12px] text-[#827f7f] whitespace-nowrap">Already have an account</h6>
          <hr className="flex-grow border-t border-gray-300" />
        </div>
        <div className="login text-center">
          <a className="text-[#097a45] text-sm hover:underline" href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
