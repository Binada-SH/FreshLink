import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create a Language Context
const LanguageContext = createContext();

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// 2. Language Provider Component
export const LanguageProvider = ({ children }) => {
  // Initialize language state from localStorage or default to 'en' (English)
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    return savedLanguage || 'en';
  });

  // Effect to save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  // Function to change the language
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    // In a real app, you might also load translation files here
    console.log(`Language changed to: ${newLanguage}`);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 3. Language Selector Component
export const LanguageSelector = ({ onLanguageSelected }) => {
  const { language, changeLanguage } = useLanguage(); // Use the language context
  const [isChangingLanguage, setIsChangingLanguage] = useState(false); // State for button disabling delay
  const [isExiting, setIsExiting] = useState(false); // New state for exit animation

  const handleSelectLanguage = (lang) => {
    setIsChangingLanguage(true); // Disable buttons immediately
    setIsExiting(true); // Start exit animation

    // Delay for the language change to register and animation to start
    setTimeout(() => {
      changeLanguage(lang); // Update the language context
      // Delay for the exit animation to complete before navigating
      setTimeout(() => {
        if (onLanguageSelected) {
          onLanguageSelected(lang); // Navigate to the next screen
        }
        setIsChangingLanguage(false); // Reset button state (though component will unmount)
        setIsExiting(false); // Reset exit state (though component will unmount)
      }, 500); // This delay should match the exit animation duration (e.g., duration-500)
    }, 300); // Initial short delay for button click feedback
  };

  // Helper function to get text for the selector's own UI (always English)
  const getSelectorText = (key) => {
    const texts = {
      title: "Choose Your Language",
      welcome: "Please select your preferred language to continue.",
      continue: "Continue",
    };
    return texts[key];
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-white transition-all duration-500 ease-out ${isExiting ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
      <div className="w-full max-w-md p-8 bg-white rounded-lg flex flex-col gap-6">
        <h1 className="text-3xl font-[jura] text-[#097a45] text-center mb-2">
          {getSelectorText('title')}
        </h1>
        <p className="text-lg text-center text-gray-600 mb-4">
          {getSelectorText('welcome')}
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleSelectLanguage('en')}
            disabled={isChangingLanguage} // Disable buttons during delay
            className={`py-3 px-6 rounded-md text-lg font-medium transition-all duration-200
              ${language === 'en' ? 'bg-[#097a45] text-white shadow-md' : 'bg-[#d6f1e4] text-[#097a45] hover:bg-[#c1e9d5]'}
              ${isChangingLanguage ? 'opacity-70 cursor-not-allowed' : ''}
              focus:outline-none focus:ring-2 focus:ring-[#097a45] focus:ring-opacity-75`}
          >
            English
          </button>
          <button
            onClick={() => handleSelectLanguage('si')}
            disabled={isChangingLanguage} // Disable buttons during delay
            className={`py-3 px-6 rounded-md text-lg font-medium transition-all duration-200
              ${language === 'si' ? 'bg-[#097a45] text-white shadow-md' : 'bg-[#d6f1e4] text-[#097a45] hover:bg-[#c1e9d5]'}
              ${isChangingLanguage ? 'opacity-70 cursor-not-allowed' : ''}
              focus:outline-none focus:ring-2 focus:ring-[#097a45] focus:ring-opacity-75`}
          >
            සිංහල
          </button>
          <button
            onClick={() => handleSelectLanguage('ta')}
            disabled={isChangingLanguage} // Disable buttons during delay
            className={`py-3 px-6 rounded-md text-lg font-medium transition-all duration-200
              ${language === 'ta' ? 'bg-[#097a45] text-white shadow-md' : 'bg-[#d6f1e4] text-[#097a45] hover:bg-[#c1e9d5]'}
              ${isChangingLanguage ? 'opacity-70 cursor-not-allowed' : ''}
              focus:outline-none focus:ring-2 focus:ring-[#097a45] focus:ring-opacity-75`}>
            தமிழ்
          </button>
        </div>
      </div>
    </div>
  );
};
