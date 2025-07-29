import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from "../../firebase";
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../LanguageSelection/Language';

const Register = () => {
  const { language } = useLanguage();

  const [userType, setUserType] = useState("buyer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Seller-specific
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [category, setCategory] = useState("");
  const [itemTags, setItemTags] = useState([]);
  const [currentItemInput, setCurrentItemInput] = useState("");
  const [idPhoto, setIdPhoto] = useState(null);
  const [facePhoto, setFacePhoto] = useState(null);

  // State for validation errors
  const [errors, setErrors] = useState({});

  // States for animations
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // New state for registration loading

  const navigate = useNavigate();

  // Effect for entry animation
  useEffect(() => {
    const entryTimer = setTimeout(() => {
      setIsEntering(false);
    }, 100);
    return () => clearTimeout(entryTimer);
  }, []);

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
      backButton: "Back",
      registrationInProgress: "Registration in progress...", // New translation for loading
      // Validation messages
      nameRequired: "Full Name is required.",
      emailRequired: "Email is required.",
      emailInvalid: "Email is invalid.",
      passwordRequired: "Password is required.",
      passwordMinLength: "Password must be at least 6 characters.",
      addressRequired: "Address is required.",
      ageRequired: "Age is required.",
      ageInvalid: "Age must be a positive number.",
      categoryRequired: "Category is required.",
      itemsRequired: "Please add at least one item.",
      idPhotoRequired: "NIC / ID photo is required.",
      facePhotoRequired: "Face photo is required.",
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
      registrationInProgress: "ලියාපදිංචි වෙමින් පවතී...",
      // Validation messages
      nameRequired: "සම්පූර්ණ නම අවශ්‍යයි.",
      emailRequired: "විද්‍යුත් තැපෑල අවශ්‍යයි.",
      emailInvalid: "වලංගු විද්‍යුත් තැපෑලක් ඇතුලත් කරන්න.",
      passwordRequired: "මුරපදය අවශ්‍යයි.",
      passwordMinLength: "මුරපදය අවම වශයෙන් අක්ෂර 6ක් විය යුතුය.",
      addressRequired: "ලිපිනය අවශ්‍යයි.",
      ageRequired: "වයස අවශ්‍යයි.",
      ageInvalid: "වයස ධන අංකයක් විය යුතුය.",
      categoryRequired: "කාණ්ඩය අවශ්‍යයි.",
      itemsRequired: "අවම වශයෙන් එක් අයිතමයක්වත් එක් කරන්න.",
      idPhotoRequired: "ජාතික හැඳුනුම්පතේ ඡායාරූපය අවශ්‍යයි.",
      facePhotoRequired: "මුහුණේ ඡායාරූපය අවශ්‍යයි.",
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
      registrationInProgress: "பதிவு நடைபெறுகிறது...",
      // Validation messages
      nameRequired: "முழு பெயர் தேவை.",
      emailRequired: "மின்னஞ்சல் தேவை.",
      emailInvalid: "மின்னஞ்சல் தவறானது.",
      passwordRequired: "கடவுச்சொல் தேவை.",
      passwordMinLength: "கடவுச்சொல் குறைந்தது 6 எழுத்துக்களைக் கொண்டிருக்க வேண்டும்.",
      addressRequired: "முகவரி தேவை.",
      ageRequired: "வயது தேவை.",
      ageInvalid: "வயது ஒரு நேர்மறை எண்ணாக இருக்க வேண்டும்.",
      categoryRequired: "வகை தேவை.",
      itemsRequired: "குறைந்தது ஒரு பொருளைச் சேர்க்கவும்.",
      idPhotoRequired: "தேசிய அடையாள அட்டை / அடையாள அட்டை புகைப்படம் தேவை.",
      facePhotoRequired: "முகப் புகைப்படம் தேவை.",
    },
  };

  // Helper function to get the translated text
  const getText = (key) => {
    return translations[language]?.[key] || translations.en[key]; // Fallback to English
  };

  const handleAddItemTag = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const newItem = currentItemInput.trim();
      if (newItem) {
        setItemTags([...itemTags, newItem]);
        setCurrentItemInput("");
        setErrors(prev => ({ ...prev, items: '' }));
      }
    }
  };

  const handleRemoveItemTag = (tagToRemove) => {
    setItemTags(itemTags.filter(tag => tag !== tagToRemove));
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Common fields
    if (!name.trim()) {
      newErrors.name = getText('nameRequired');
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = getText('emailRequired');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = getText('emailInvalid');
      isValid = false;
    }
    if (!password.trim()) {
      newErrors.password = getText('passwordRequired');
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = getText('passwordMinLength');
      isValid = false;
    }

    // Seller-specific fields
    if (userType === "seller") {
      if (!address.trim()) {
        newErrors.address = getText('addressRequired');
        isValid = false;
      }
      if (!age) {
        newErrors.age = getText('ageRequired');
        isValid = false;
      } else if (parseInt(age) <= 0) {
        newErrors.age = getText('ageInvalid');
        isValid = false;
      }
      if (!category) {
        newErrors.category = getText('categoryRequired');
        isValid = false;
      }
      if (itemTags.length === 0) {
        newErrors.items = getText('itemsRequired');
        isValid = false;
      }
      if (!idPhoto) {
        newErrors.idPhoto = getText('idPhotoRequired');
        isValid = false;
      }
      if (!facePhoto) {
        newErrors.facePhoto = getText('facePhotoRequired');
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsRegistering(true); // Start registration loading animation

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
        userData.items = itemTags;
        userData.pendingApproval = true;
      }

      await setDoc(doc(db, "users", user.uid), userData);

      alert(getText("registeredSuccess"));
      navigate("/login");
    } catch (error) {
      console.error(getText("registrationError"), error.message);
      alert(error.message);
    } finally {
      setIsRegistering(false); // End registration loading animation
    }
  };

  // Function to handle back button click with exit animation
  const handleBackClick = () => {
    setIsExiting(true); // Start exit animation
    setTimeout(() => {
      navigate('/language-select'); // Navigate after animation
    }, 500); // Match exit animation duration
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-white relative transition-all duration-500 ease-in-out ${isEntering ? 'opacity-0 scale-90' : 'opacity-100 scale-100'} ${isExiting ? 'translate-x-full' : 'translate-x-0'} overflow-hidden`}>
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="absolute top-4 left-4 p-2 rounded-full bg-[#d6f1e4] text-[#097a45] hover:bg-[#c1e9d5] transition-colors duration-200 z-10" // Added z-10 to ensure it's above loading overlay
        aria-label={getText('backButton')}
        disabled={isRegistering} // Disable back button during registration
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

      <div className="w-full max-w-md p-8 bg-white rounded-lg flex flex-col gap-4 relative"> {/* Added relative for loading overlay */}
        {isRegistering && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg z-20"> {/* Loading Overlay */}
            <p className="text-2xl font-[jura] text-[#097a45] animate-pulse">
              {getText('registrationInProgress')}
            </p>
          </div>
        )}

        <h1 className="text-3xl font-[jura] text-[#097a45] text-center">{getText('setupTitle')}</h1>
        <h3 className="text-lg text-center text-gray-600">{getText('formInstruction')}</h3>

        {/* Full Name */}
        <input
          type="text"
          placeholder={getText('fullNamePlaceholder')}
          value={name}
          onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
          className={`border rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45] ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          disabled={isRegistering}
        />
        {errors.name && <p className="text-red-500 text-sm -mt-2">{errors.name}</p>}

        {/* Email */}
        <input
          type="email"
          placeholder={getText('emailPlaceholder')}
          value={email}
          onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
          className={`border rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45] ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          disabled={isRegistering}
        />
        {errors.email && <p className="text-red-500 text-sm -mt-2">{errors.email}</p>}

        {/* User Type */}
        <select
          value={userType}
          onChange={e => { setUserType(e.target.value); setErrors({}); }}
          className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]"
          disabled={isRegistering}
        >
          <option value="buyer">{getText('buyerOption')}</option>
          <option value="seller">{getText('sellerOption')}</option>
        </select>

        {/* Password */}
        <input
          type="password"
          placeholder={getText('passwordPlaceholder')}
          value={password}
          onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
          className={`border rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45] ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          disabled={isRegistering}
        />
        {errors.password && <p className="text-red-500 text-sm -mt-2">{errors.password}</p>}

        {/* Seller-specific fields */}
        {userType === "seller" && (
          <>
            {/* Address */}
            <input
              type="text"
              placeholder={getText('addressPlaceholder')}
              value={address}
              onChange={e => { setAddress(e.target.value); setErrors(prev => ({ ...prev, address: '' })); }}
              className={`border rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45] ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              disabled={isRegistering}
            />
            {errors.address && <p className="text-red-500 text-sm -mt-2">{errors.address}</p>}

            {/* Age */}
            <input
              type="number"
              placeholder={getText('agePlaceholder')}
              value={age}
              onChange={e => { setAge(e.target.value); setErrors(prev => ({ ...prev, age: '' })); }}
              className={`border rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45] ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
              disabled={isRegistering}
            />
            {errors.age && <p className="text-red-500 text-sm -mt-2">{errors.age}</p>}
            
            {/* Category Selector */}
            <select
              value={category}
              onChange={e => { setCategory(e.target.value); setErrors(prev => ({ ...prev, category: '' })); }}
              className={`border rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45] ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
              disabled={isRegistering}
            >
              <option value="">{getText('selectCategory')}</option>
              <option value="vegetables">{getText('categoryVegetables')}</option>
              <option value="fruits">{getText('categoryFruits')}</option>
              <option value="pulses-grains">{getText('categoryPulsesGrains')}</option>
            </select>
            {errors.category && <p className="text-red-500 text-sm -mt-2">{errors.category}</p>}

            {/* Items as Tags Input */}
            <div className={`border rounded-md p-2 w-full outline-none focus-within:ring-2 focus-within:ring-[#097a45] flex flex-wrap gap-2 min-h-[42px] items-center ${errors.items ? 'border-red-500' : 'border-gray-300'}`}>
              {itemTags.map((tag, index) => (
                <span key={index} className="bg-[#d6f1e4] text-[#097a45] px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => handleRemoveItemTag(tag)} className="ml-1 text-[#097a45] hover:text-[#086b3c] focus:outline-none" disabled={isRegistering}>
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={itemTags.length === 0 ? getText('itemsPlaceholder') : ""}
                value={currentItemInput}
                onChange={e => { setCurrentItemInput(e.target.value); setErrors(prev => ({ ...prev, items: '' })); }}
                onKeyDown={handleAddItemTag}
                className="flex-grow bg-transparent outline-none border-none p-0 focus:ring-0"
                disabled={isRegistering}
              />
            </div>
            {errors.items && <p className="text-red-500 text-sm -mt-2">{errors.items}</p>}
            
            {/* NIC / ID Upload */}
          <div className={`flex items-center justify-between border rounded-md px-4 py-2 w-full focus-within:ring-2 focus-within:ring-[#097a45] mb-4 ${errors.idPhoto ? 'border-red-500' : 'border-gray-300'}`}>
            <label className="text-sm text-gray-700">{getText('uploadNicId')}</label>
            <label className="cursor-pointer bg-[#d6f1e4] text-[#097a45] px-4 py-1 rounded-md text-sm font-medium hover:bg-[#c1e9d5] transition">
              {getText('chooseFile')}
              <input
                type="file"
                onChange={e => { setIdPhoto(e.target.files[0]); setErrors(prev => ({ ...prev, idPhoto: '' })); }}
                className="hidden"
                disabled={isRegistering}
              />
            </label>
          </div>
          {errors.idPhoto && <p className="text-red-500 text-sm -mt-2">{errors.idPhoto}</p>}

          {/* Face Photo Upload */}
          <div className={`flex items-center justify-between border rounded-md px-4 py-2 w-full focus-within:ring-2 focus-within:ring-[#097a45] ${errors.facePhoto ? 'border-red-500' : 'border-gray-300'}`}>
            <label className="text-sm text-gray-700">{getText('uploadFacePhoto')}</label>
            <label className="cursor-pointer bg-[#d6f1e4] text-[#097a45] px-4 py-1 rounded-md text-sm font-medium hover:bg-[#c1e9d5] transition">
              {getText('chooseFile')}
              <input
                type="file"
                onChange={e => { setFacePhoto(e.target.files[0]); setErrors(prev => ({ ...prev, facePhoto: '' })); }}
                className="hidden"
                disabled={isRegistering}
              />
            </label>
          </div>
          {errors.facePhoto && <p className="text-red-500 text-sm -mt-2">{errors.facePhoto}</p>}

          </>
        )}

        <button
          onClick={handleRegister}
          className="bg-[#097a45] text-white rounded-md py-2 mt-2 hover:bg-[#086b3c] transition"
          disabled={isRegistering} // Disable the register button during registration
        >
          {getText('registerButton')}
        </button>

        <div className="flex items-center gap-4 my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <h6 className="text-[12px] text-[#827f7f] whitespace-nowrap">{getText('alreadyHaveAccount')}</h6>
          <hr className="flex-grow border-t border-gray-300" />
        </div>
        <div className="login text-center">
          <Link to="/login" className="text-[#097a45] text-sm hover:underline" disabled={isRegistering}>
            {getText('loginLink')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
