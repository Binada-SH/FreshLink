import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase'; // Adjust path based on your structure
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { useLanguage } from '../LanguageSelection/Language'; // Corrected import path

const Login = () => {
  const { language } = useLanguage(); // Get the current language from context

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Translation object for all texts on the page
  const translations = {
    en: {
      welcomeBack: "Welcome Back!",
      loginInstruction: "Login to your FreshLink account",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Password",
      loginButton: "Login",
      unknownUserType: "Unknown user type.",
      loginError: "Login error:",
      backButton: "Back", // Added translation for back button if needed
    },
    si: {
      welcomeBack: "නැවත සාදරයෙන් පිළිගනිමු!",
      loginInstruction: "ඔබගේ FreshLink ගිණුමට පිවිසෙන්න",
      emailPlaceholder: "විද්‍යුත් තැපෑල",
      passwordPlaceholder: "මුරපදය",
      loginButton: "පිවිසෙන්න",
      unknownUserType: "නොදන්නා පරිශීලක වර්ගය.",
      loginError: "පිවිසුම් දෝෂය:",
      backButton: "ආපසු",
    },
    ta: {
      welcomeBack: "மீண்டும் வருக!",
      loginInstruction: "உங்கள் FreshLink கணக்கில் உள்நுழையவும்",
      emailPlaceholder: "மின்னஞ்சல்",
      passwordPlaceholder: "கடவுச்சொல்",
      loginButton: "உள்நுழை",
      unknownUserType: "அறியப்படாத பயனர் வகை.",
      loginError: "உள்நுழைவு பிழை:",
      backButton: "பின்",
    },
  };

  // Helper function to get the translated text
  const getText = (key) => {
    return translations[language]?.[key] || translations.en[key]; // Fallback to English
  };

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
        alert(getText('unknownUserType')); // Use translated alert
      }
    } catch (error) {
      console.error(getText('loginError'), error.message);
      alert(error.message); // Error message from Firebase might not be translatable directly
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative"> {/* Added relative for positioning */}
      {/* Back Button */}
      <Link
        to="/register" // Assuming back navigates to the register page
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
      </Link>

      <div className="w-full max-w-md p-8 bg-white rounded-lg flex flex-col gap-4">
        <h1 className="text-3xl font-[jura] text-[#097a45] text-center">
          {getText('welcomeBack')}
        </h1>
        <h3 className="text-lg text-center text-[#827f7f]">
          {getText('loginInstruction')}
        </h3>

        <input
          type="email"
          placeholder={getText('emailPlaceholder')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]"
        />
        <input
          type="password"
          placeholder={getText('passwordPlaceholder')}
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]"
        />
        <button
          onClick={handleLogin}
          className="bg-[#097a45] text-white rounded-md py-2 mt-2 hover:bg-[#086b3c] transition"
        >
          {getText('loginButton')}
        </button>
      </div>
    </div>
  );
};

export default Login;
