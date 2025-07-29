import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../LanguageSelection/Language'; // Import the useLanguage hook

const BuyerHome = () => {
  const { language } = useLanguage(); // Get the current language from context

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(new Set());
  const [cart, setCart] = useState({});

  // States for animations
  const [isEntering, setIsEntering] = useState(true); // For entry animation
  const [isExiting, setIsExiting] = useState(false); // For exit animation

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
      headerTitle: "Fresh Grocery",
      headerSubtitle: "Deliver to your door",
      searchPlaceholder: "Search for fresh groceries...",
      allCategory: "All",
      vegetablesCategory: "Vegetables",
      fruitsCategory: "Fruits",
      herbsCategory: "Herbs",
      organicCategory: "Organic",
      unitLb: "per lb",
      unitEach: "each",
      unitBunch: "per bunch",
      outOfStock: "Out of Stock",
      addToCart: "Add to Cart",
      backButton: "Back",
      farmerNameLabel: "Farmer:", // New translation
    },
    si: {
      headerTitle: "නැවුම් සිල්ලර බඩු",
      headerSubtitle: "ඔබේ දොරකඩටම ගෙන්වා ගන්න",
      searchPlaceholder: "නැවුම් සිල්ලර බඩු සොයන්න...",
      allCategory: "සියල්ල",
      vegetablesCategory: "එළවළු",
      fruitsCategory: "පලතුරු",
      herbsCategory: "ඖෂධ පැළෑටි",
      organicCategory: "කාබනික",
      unitLb: "රාත්තලකට",
      unitEach: "එකකට",
      unitBunch: "කැට්ටුවකට",
      outOfStock: "තොග අවසන්",
      addToCart: "කරත්තයට එක් කරන්න",
      backButton: "ආපසු",
      farmerNameLabel: "ගොවියා:",
    },
    ta: {
      headerTitle: "புதிய மளிகை",
      headerSubtitle: "உங்கள் வீட்டிற்கு டெலிவரி",
      searchPlaceholder: "புதிய மளிகை பொருட்களைத் தேடுங்கள்...",
      allCategory: "அனைத்தும்",
      vegetablesCategory: "காய்கறிகள்",
      fruitsCategory: "பழங்கள்",
      herbsCategory: "மூலிகைகள்",
      organicCategory: "ஆர்கானிக்",
      unitLb: "ஒரு பவுண்டுக்கு",
      unitEach: "ஒன்றுக்கு",
      unitBunch: "ஒரு கொத்துக்கு",
      outOfStock: "இருப்பு இல்லை",
      addToCart: "கார்ட்டில் சேர்",
      backButton: "பின்",
      farmerNameLabel: "விவசாயி:",
    },
  };

  // Helper function to get the translated text
  const getText = (key) => {
    return translations[language]?.[key] || translations.en[key]; // Fallback to English
  };

  const categories = [
    getText('allCategory'),
    getText('vegetablesCategory'),
    getText('fruitsCategory'),
    getText('herbsCategory'),
    getText('organicCategory')
  ];

  const products = [
    {
      id: 1,
      name: 'Fresh Broccoli',
      price: 2.99,
      unit: getText('unitLb'),
      image: '🥦',
      category: getText('vegetablesCategory'),
      rating: 4.5,
      inStock: true,
      farmerName: 'Green Fields Farm' // Added farmer name
    },
    {
      id: 2,
      name: 'Organic Avocado',
      price: 1.49,
      unit: getText('unitEach'),
      image: '�',
      category: getText('fruitsCategory'),
      rating: 4.8,
      inStock: true,
      farmerName: 'Sunny Orchard'
    },
    {
      id: 3,
      name: 'Roma Tomatoes',
      price: 3.49,
      unit: getText('unitLb'),
      image: '🍅',
      category: getText('vegetablesCategory'),
      rating: 4.3,
      inStock: true,
      farmerName: 'Harvest Valley'
    },
    {
      id: 4,
      name: 'Red Bell Pepper',
      price: 2.79,
      unit: getText('unitEach'),
      image: '🫑',
      category: getText('vegetablesCategory'),
      rating: 4.6,
      inStock: true,
      farmerName: 'Pepper Patch'
    },
    {
      id: 5,
      name: 'Fresh Spinach',
      price: 2.29,
      unit: getText('unitBunch'),
      image: '🥬',
      category: getText('vegetablesCategory'),
      rating: 4.4,
      inStock: true,
      farmerName: 'Leafy Greens Co.'
    },
    {
      id: 6,
      name: 'Organic Carrots',
      price: 1.99,
      unit: getText('unitLb'),
      image: '🥕',
      category: getText('vegetablesCategory'),
      rating: 4.7,
      inStock: false,
      farmerName: 'Root Cellar Farms'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === getText('allCategory') || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const addToCart = (productId) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const getCartCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  // Function to handle back button click with exit animation
  const handleBackClick = () => {
    setIsExiting(true); // Start exit animation
    setTimeout(() => {
      navigate('/login'); // Navigate to login page after animation
    }, 500); // Match exit animation duration
  };

  // Calculate the height of the fixed header dynamically or use a fixed value that works
  // Based on the current padding/margins, a height of ~200px-210px seems appropriate.
  // Let's use a fixed value for simplicity and consistency with Tailwind classes.
  const FIXED_HEADER_HEIGHT = '210px'; // This value needs to be precise based on your CSS

  return (
    <div className={`h-screen flex flex-col bg-white relative transition-all duration-500 ease-in-out ${isEntering ? 'opacity-0 scale-90' : 'opacity-100 scale-100'} ${isExiting ? 'translate-x-full' : 'translate-x-0'} overflow-hidden`}>
      {/* Fixed Header, Search Bar, and Categories Container */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-lg z-20" style={{ height: FIXED_HEADER_HEIGHT }}>
        {/* Header */}
        <div className="px-4 py-5">
          <div className="flex items-center justify-between mb-4 mt-0"> {/* Adjusted mt for back button */}
            <div>
              <h1 className="text-2xl font-bold text-[#097a45] font-[jur]">{getText('headerTitle')}</h1>
              <p className="text-[#097a45] text-sm">{getText('headerSubtitle')}</p>
            </div>
            <div className="relative">
              {/* Shopping Cart Icon (Bootstrap Icon) */}
              <i className="bi bi-cart text-gray-700 text-2xl"></i> {/* Bootstrap Cart Icon */}
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" style={{ backgroundColor: '#097a45' }}>
                  {getCartCount()}
                </span>
              )}
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-3"> {/* Added mb-3 for spacing */}
            <div className="absolute left-3 top-3 w-5 h-5 text-gray-400">🔍</div>
            <input
              type="text"
              placeholder={getText('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#097a45' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 py-3 bg-white shadow-sm overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedCategory === category ? { backgroundColor: '#097a45' } : {}}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products List (Scrollable Content) */}
      {/* This div will take the remaining height and scroll */}
      <div className="absolute left-0 right-0 bottom-0 overflow-y-auto px-4 py-4" style={{ top: FIXED_HEADER_HEIGHT }}>
        <div className="flex flex-col gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden w-full">
              <div className="relative">
                {/* Product Image (Emoji) */}
                <div className="aspect-video bg-gray-50 flex items-center justify-center text-8xl">
                  {product.image}
                </div>
                {/* Favorite Button (Bootstrap Icon) */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <i className={`text-2xl ${ // Larger icon, adjusted text size for better visibility
                      favorites.has(product.id) 
                        ? 'bi bi-heart-fill text-red-500' // Filled heart
                        : 'bi bi-heart text-gray-400' // Outlined heart
                    }`}>
                  </i>
                </button>
                {/* Out of Stock Overlay */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">{getText('outOfStock')}</span>
                  </div>
                )}
              </div>
              
              {/* Product Details */}
              <div className="p-4">
                <h3 className="font-bold text-xl text-gray-900 mb-1">{product.name}</h3>
                <p className="text-gray-700 text-sm mb-2">
                  <span className="font-semibold">{getText('farmerNameLabel')}</span> {product.farmerName}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-bold text-2xl" style={{ color: '#097a45' }}>${product.price}</span>
                    <span className="text-gray-500 text-sm ml-1">{product.unit}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-base">★</span>
                    <span className="text-gray-600 text-sm ml-1">{product.rating}</span>
                  </div>
                </div>
                
                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product.id)}
                  disabled={!product.inStock}
                  className={`w-full py-3 px-4 rounded-xl text-lg font-medium transition-colors ${
                    product.inStock
                      ? 'text-white hover:opacity-90'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  style={product.inStock ? { backgroundColor: '#097a45' } : {}}
                >
                  {product.inStock ? (
                    <div className="flex items-center justify-center">
                      <span className="mr-2 text-xl">➕</span>
                      {getText('addToCart')}
                    </div>
                  ) : (
                    getText('outOfStock')
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom spacing for mobile */}
      <div className="h-6"></div>
    </div>
  );
};

export default BuyerHome;
