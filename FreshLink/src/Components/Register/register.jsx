import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from "../../firebase";
import { useNavigate, Link } from 'react-router-dom'; // Import Link here
import { useLanguage } from '../LanguageSelection/Language'; // Import the useLanguage hook

const Register = () => {
  const { language } = useLanguage(); // Get the current language from context

  const [userType, setUserType] = useState("buyer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Seller-specific
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [category, setCategory] = useState(""); // Now for select
  const [itemTags, setItemTags] = useState([]); // To store individual item tags
  const [currentItemInput, setCurrentItemInput] = useState(""); // For the input field of new items
  const [idPhoto, setIdPhoto] = useState(null);
  const [facePhoto, setFacePhoto] = useState(null);

  const navigate = useNavigate();

  // Translation object for all texts on the page
  const translations = {
    en: {
      setupTitle: "Let's Get You SetUP!",
      formInstruction: "Please fill the form below to register",
      fullNamePlaceholder: "Full Name",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Password",
      buyerOption: "Buyer",
      sellerOption: "Seller",
      addressPlaceholder: "Address",
      agePlaceholder: "Age",
      categoryPlaceholder: "What category do you sell in?",
      selectCategory: "Select Category",
      categoryVegetables: "Vegetables",
      categoryFruits: "Fruits",
      categoryPulsesGrains: "Pulses and Grains",
      itemsPlaceholder: "What items do you sell? (Press Space/Enter to add)",
      uploadNicId: "Upload NIC / ID:",
      chooseFile: "Choose File",
      uploadFacePhoto: "Upload Face Photo:",
      registerButton: "Register",
      alreadyHaveAccount: "Already have an account",
      loginLink: "Login",
      registeredSuccess: "Registered successfully!",
      registrationError: "Registration error:",
      backButton: "Back", // Added translation for back button
    },
    si: {
      setupTitle: "අපි ඔබව සකස් කරමු!",
      formInstruction: "ලියාපදිංචි වීමට පහත පෝරමය පුරවන්න",
      fullNamePlaceholder: "සම්පූර්ණ නම",
      emailPlaceholder: "විද්‍යුත් තැපෑල",
      passwordPlaceholder: "මුරපදය",
      buyerOption: "ගැනුම්කරු",
      sellerOption: "විකුණුම්කරු",
      addressPlaceholder: "ලිපිනය",
      agePlaceholder: "වයස",
      categoryPlaceholder: "ඔබ විකුණන කාණ්ඩය කුමක්ද?",
      selectCategory: "කාණ්ඩයක් තෝරන්න",
      categoryVegetables: "එළවළු",
      categoryFruits: "පලතුරු",
      categoryPulsesGrains: "ධාන්‍ය සහ රනිල කුලයට අයත් බෝග",
      itemsPlaceholder: "ඔබ විකුණන භාණ්ඩ මොනවාද? (එකතු කිරීමට Space/Enter ඔබන්න)",
      uploadNicId: "ජාතික හැඳුනුම්පත උඩුගත කරන්න:",
      chooseFile: "ගොනුව තෝරන්න",
      uploadFacePhoto: "මුහුණේ ඡායාරූපය උඩුගත කරන්න:",
      registerButton: "ලියාපදිංචි වන්න",
      alreadyHaveAccount: "දැනටමත් ගිණුමක් තිබේද?",
      loginLink: "පිවිසෙන්න",
      registeredSuccess: "සාර්ථකව ලියාපදිංචි විය!",
      registrationError: "ලියාපදිංචි කිරීමේ දෝෂය:",
      backButton: "ආපසු",
    },
    ta: {
      setupTitle: "உங்களை அமைக்கலாம்!",
      formInstruction: "பதிவு செய்ய கீழே உள்ள படிவத்தை நிரப்பவும்",
      fullNamePlaceholder: "முழு பெயர்",
      emailPlaceholder: "மின்னஞ்சல்",
      passwordPlaceholder: "கடவுச்சொல்",
      buyerOption: "வாங்குபவர்",
      sellerOption: "விற்பனையாளர்",
      addressPlaceholder: "முகவரி",
      agePlaceholder: "வயது",
      categoryPlaceholder: "நீங்கள் எந்த வகையை விற்கிறீர்கள்?",
      selectCategory: "வகையைத் தேர்ந்தெடுக்கவும்",
      categoryVegetables: "காய்கறிகள்",
      categoryFruits: "பழங்கள்",
      categoryPulsesGrains: "பருப்பு வகைகள் மற்றும் தானியங்கள்",
      itemsPlaceholder: "நீங்கள் என்ன பொருட்களை விற்கிறீர்கள்? (சேர்க்க Space/Enter ஐ அழுத்தவும்)",
      uploadNicId: "தேசிய அடையாள அட்டை / அடையாள அட்டையைப் பதிவேற்றவும்:",
      chooseFile: "கோப்பைத் தேர்ந்தெடு",
      uploadFacePhoto: "முகப் படத்தைப் பதிவேற்றவும்:",
      registerButton: "பதிவு",
      alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
      loginLink: "உள்நுழை",
      registeredSuccess: "வெற்றிகரமாகப் பதிவு செய்யப்பட்டது!",
      registrationError: "பதிவுப் பிழை:",
      backButton: "பின்",
    },
  };

  // Helper function to get the translated text
  const getText = (key) => {
    return translations[language]?.[key] || translations.en[key]; // Fallback to English
  };

  const handleAddItemTag = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault(); // Prevent default behavior (e.g., form submission for Enter)
      const newItem = currentItemInput.trim();
      if (newItem && !itemTags.includes(newItem)) {
        setItemTags([...itemTags, newItem]);
        setCurrentItemInput("");
      }
    }
  };

  const handleRemoveItemTag = (tagToRemove) => {
    setItemTags(itemTags.filter(tag => tag !== tagToRemove));
  };

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
        userData.items = itemTags; // Save itemTags array
        userData.pendingApproval = true; // Manual verification needed
      }

      await setDoc(doc(db, "users", user.uid), userData);

      // Use translated alert message
      alert(getText("registeredSuccess"));
      navigate("/login");
    } catch (error) {
      console.error(getText("registrationError"), error.message);
      alert(error.message); // Error message from Firebase might not be translatable directly
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative"> {/* Added relative for positioning */}
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Navigates back to the previous page in history
        className="absolute top-4 left-4 p-2 rounded-full bg-[#d6f1e4] text-[#097a45] hover:bg-[#c1e9d5] transition-colors duration-200"
        aria-label={getText('backButton')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <div className="w-full max-w-md p-8 bg-white rounded-lg flex flex-col gap-4">
        <h1 className="text-3xl font-[jura] text-[#097a45] text-center">{getText('setupTitle')}</h1>
        <h3 className="text-lg text-center text-gray-600">{getText('formInstruction')}</h3>

        <input type="text" placeholder={getText('fullNamePlaceholder')} value={name} onChange={e => setName(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]"  />
        <input type="email" placeholder={getText('emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]" />
        <select value={userType} onChange={e => setUserType(e.target.value)}  className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]">
          <option value="buyer">{getText('buyerOption')}</option>
          <option value="seller">{getText('sellerOption')}</option>
        </select>
        <input type="password" placeholder={getText('passwordPlaceholder')} value={password} onChange={e => setPassword(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]" />

        {/* Seller-specific fields */}
        {userType === "seller" && (
          <>
            <input type="text" placeholder={getText('addressPlaceholder')} value={address} onChange={e => setAddress(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]" />
            <input type="number" placeholder={getText('agePlaceholder')} value={age} onChange={e => setAge(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]" />
            
            {/* Category Selector */}
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]"
            >
              <option value="">{getText('selectCategory')}</option>
              <option value="vegetables">{getText('categoryVegetables')}</option>
              <option value="fruits">{getText('categoryFruits')}</option>
              <option value="pulses-grains">{getText('categoryPulsesGrains')}</option>
            </select>

            {/* Items as Tags Input */}
            <div className="border border-gray-300 rounded-md p-2 w-full outline-none focus-within:ring-2 focus-within:ring-[#097a45] flex flex-wrap gap-2 min-h-[42px] items-center">
              {itemTags.map((tag, index) => (
                <span key={index} className="bg-[#d6f1e4] text-[#097a45] px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => handleRemoveItemTag(tag)} className="ml-1 text-[#097a45] hover:text-[#086b3c] focus:outline-none">
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={itemTags.length === 0 ? getText('itemsPlaceholder') : ""}
                value={currentItemInput}
                onChange={e => setCurrentItemInput(e.target.value)}
                onKeyDown={handleAddItemTag}
                className="flex-grow bg-transparent outline-none border-none p-0 focus:ring-0"
              />
            </div>
            
            {/* NIC / ID Upload */}
          <div className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 w-full focus-within:ring-2 focus-within:ring-[#097a45] mb-4">
            <label className="text-sm text-gray-700">{getText('uploadNicId')}</label>
            <label className="cursor-pointer bg-[#d6f1e4] text-[#097a45] px-4 py-1 rounded-md text-sm font-medium hover:bg-[#c1e9d5] transition">{getText('chooseFile')}
              <input
                type="file"
                onChange={e => setIdPhoto(e.target.files[0])}
                className="hidden"/>
  </label>
</div>

{/* Face Photo Upload */}
<div className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 w-full focus-within:ring-2 focus-within:ring-[#097a45]">
  <label className="text-sm text-gray-700">{getText('uploadFacePhoto')}</label>
  <label className="cursor-pointer bg-[#d6f1e4] text-[#097a45] px-4 py-1 rounded-md text-sm font-medium hover:bg-[#c1e9d5] transition">
    {getText('chooseFile')}
    <input
      type="file"
      onChange={e => setFacePhoto(e.target.files[0])}
      className="hidden"
    />
  </label>
</div>

          </>
        )}

        <button onClick={handleRegister} className="bg-[#097a45] text-white rounded-md py-2 mt-2 hover:bg-[#086b3c] transition">{getText('registerButton')}</button>

        <div className="flex items-center gap-4 my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <h6 className="text-[12px] text-[#827f7f] whitespace-nowrap">{getText('alreadyHaveAccount')}</h6>
          <hr className="flex-grow border-t border-gray-300" />
        </div>
        <div className="login text-center">
          <Link to="/login" className="text-[#097a45] text-sm hover:underline">{getText('loginLink')}</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
