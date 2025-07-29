import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase'; // Adjust path based on your structure
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../LanguageSelection/Language';

const Login = () => {
  const { language } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // States for animations
  const [isEntering, setIsEntering] = useState(true); // For initial slide-in of login form
  const [isExiting, setIsExiting] = useState(false); // For slide-out of login form (back button)
  const [isLoggingIn, setIsLoggingIn] = useState(false); // For "Getting things ready..." overlay
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false); // For "Welcome to FreshLink" animation
  const [welcomeMessageExiting, setWelcomeMessageExiting] = useState(false); // For "Welcome to FreshLink" exit animation

  const navigate = useNavigate();

  // Effect for initial login form entry (slide in from right)
  useEffect(() => {
    const entryTimer = setTimeout(() => {
      setIsEntering(false);
    }, 100); // Small delay to ensure classes are applied before removal
    return () => clearTimeout(entryTimer);
  }, []);

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
      backButton: "Back",
      incorrectCredentials: "Email or Password is not correct. Please try again.",
      gettingReady: "Getting things ready for you...",
      welcomeToFreshLink: "Welcome to FreshLink!", // New translation
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
      incorrectCredentials: "විද්‍යුත් තැපෑල හෝ මුරපදය නිවැරදි නැත. කරුණාකර නැවත උත්සාහ කරන්න.",
      gettingReady: "ඔබ වෙනුවෙන් දේවල් සූදානම් කරමින්...",
      welcomeToFreshLink: "FreshLink වෙත සාදරයෙන් පිළිගනිමු!",
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
      incorrectCredentials: "மின்னஞ்சல் அல்லது கடவுச்சொல் தவறானது. மீண்டும் முயற்சிக்கவும்.",
      gettingReady: "உங்களுக்காக விஷயங்களைத் தயார் செய்கிறது...",
      welcomeToFreshLink: "FreshLink க்கு வரவேற்கிறோம்!",
    },
  };

  // Helper function to get the translated text
  const getText = (key) => {
    return translations[language]?.[key] || translations.en[key]; // Fallback to English
  };

  const handleLogin = async () => {
    setLoginError(''); // Clear previous errors on new login attempt
    setIsLoggingIn(true); // Start "Getting things ready..." animation

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user type from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userType = userDoc.data()?.userType;

      setIsLoggingIn(false); // Hide "Getting things ready..." overlay
      setShowWelcomeMessage(true); // Trigger the "Welcome to FreshLink" animation

      // Start the exit animation for the welcome message after a delay
      setTimeout(() => {
        setWelcomeMessageExiting(true);
        // Navigate after the welcome message exit animation completes
        setTimeout(() => {
          if (userType === 'buyer') {
            navigate('/buyer-home');
          } else if (userType === 'seller') {
            navigate('/seller-home');
          } else {
            setLoginError(getText('unknownUserType'));
            // If there's an unknown user type after welcome, hide welcome and reset
            setShowWelcomeMessage(false);
            setWelcomeMessageExiting(false);
          }
        }, 700); // Duration of welcomeMessageExiting animation (e.g., opacity-0 scale-[5])
      }, 800); // Duration before welcome message starts exiting (e.g., for initial scale-in)

    } catch (error) {
      console.error(getText('loginError'), error.message);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        setLoginError(getText('incorrectCredentials'));
      } else {
        setLoginError(error.message);
      }
      setIsLoggingIn(false); // Ensure loading is off if error
    }
  };

  // Function to handle back button click with exit animation
  const handleBackClick = () => {
    setIsExiting(true); // Start exit animation for the login form
    setTimeout(() => {
      navigate('/register'); // Navigate to register page after animation
    }, 500); // Match exit animation duration
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-white relative transition-all duration-500 ease-in-out ${isEntering ? 'translate-x-full' : 'translate-x-0'} ${isExiting ? 'translate-x-full' : 'translate-x-0'} overflow-hidden`}>
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="absolute top-4 left-4 p-2 rounded-full bg-[#d6f1e4] text-[#097a45] hover:bg-[#c1e9d5] transition-colors duration-200 z-10"
        aria-label={getText('backButton')}
        disabled={isLoggingIn || showWelcomeMessage} // Disable back button during any loading/animation
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

      {/* Main Login Form Content (conditionally rendered) */}
      {!(isLoggingIn || showWelcomeMessage) && ( // Only show login form if no loading/welcome animation is active
        <div className="w-full max-w-md p-8 bg-white rounded-lg flex flex-col gap-4 relative">
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
            onChange={e => { setEmail(e.target.value); setLoginError(''); }}
            className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]"
            disabled={isLoggingIn || showWelcomeMessage} // Disable input during loading/animation
          />
          <input
            type="password"
            placeholder={getText('passwordPlaceholder')}
            value={password}
            onChange={e => { setPassword(e.target.value); setLoginError(''); }}
            className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-[#097a45]"
            disabled={isLoggingIn || showWelcomeMessage} // Disable input during loading/animation
          />
          {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
          <button
            onClick={handleLogin}
            className="bg-[#097a45] text-white rounded-md py-2 mt-2 hover:bg-[#086b3c] transition"
            disabled={isLoggingIn || showWelcomeMessage} // Disable button during loading/animation
          >
            {getText('loginButton')}
          </button>
        </div>
      )}

      {/* "Getting things ready..." Overlay */}
      {isLoggingIn && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg z-20">
          <p className="text-2xl font-[jura] text-[#097a45] animate-pulse">
            {getText('gettingReady')}
          </p>
        </div>
      )}

      {/* "Welcome to FreshLink" Animation Overlay */}
      {showWelcomeMessage && (
        <div className="absolute text-center flex items-center justify-center bg-white z-30">
          <p className={`text-5xl font-[jura] text-[#097a45] transition-all duration-1700 ease-in-out
            ${welcomeMessageExiting ? 'opacity-0 scale-[5]' : 'opacity-100 scale-100'}
          `}>
            {getText('welcomeToFreshLink')}
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
