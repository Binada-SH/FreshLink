import React, { useState, useEffect } from 'react';

// Load Jura font
const loadJuraFont = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Jura:wght@300;400;500;600;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

const buyerhome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(new Set());
  const [cart, setCart] = useState({});

  // Load Jura font on component mount
  useEffect(() => {
    loadJuraFont();
  }, []);

  const categories = ['All', 'Vegetables', 'Fruits', 'Herbs', 'Organic'];

  const products = [
    {
      id: 1,
      name: 'Fresh Broccoli',
      price: 2.99,
      unit: 'per lb',
      image: '🥦',
      category: 'Vegetables',
      rating: 4.5,
      inStock: true
    },
    {
      id: 2,
      name: 'Organic Avocado',
      price: 1.49,
      unit: 'each',
      image: '🥑',
      category: 'Fruits',
      rating: 4.8,
      inStock: true
    },
    {
      id: 3,
      name: 'Roma Tomatoes',
      price: 3.49,
      unit: 'per lb',
      image: '🍅',
      category: 'Vegetables',
      rating: 4.3,
      inStock: true
    },
    {
      id: 4,
      name: 'Red Bell Pepper',
      price: 2.79,
      unit: 'each',
      image: '🫑',
      category: 'Vegetables',
      rating: 4.6,
      inStock: true
    },
    {
      id: 5,
      name: 'Fresh Spinach',
      price: 2.29,
      unit: 'per bunch',
      image: '🥬',
      category: 'Vegetables',
      rating: 4.4,
      inStock: true
    },
    {
      id: 6,
      name: 'Organic Carrots',
      price: 1.99,
      unit: 'per lb',
      image: '🥕',
      category: 'Vegetables',
      rating: 4.7,
      inStock: false
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
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

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen" style={{ fontFamily: 'Jura, sans-serif' }}>
      {/* Header */}
      <div className="bg-white px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fresh Grocery</h1>
            <p className="text-gray-600 text-sm">Deliver to your door</p>
          </div>
          <div className="relative">
            <div className="w-6 h-6 text-gray-700">🛒</div>
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" style={{ backgroundColor: '#097a45' }}>
                {getCartCount()}
              </span>
            )}
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute left-3 top-3 w-5 h-5 text-gray-400">🔍</div>
          <input
            type="text"
            placeholder="Search for fresh groceries..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ '--tw-ring-color': '#097a45' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-0 py-3">
        <div className="flex space-x-2 overflow-x-auto pb-2">
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

      {/* Products Grid */}
      <div className="px-3 pb-6">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative">
                <div className="aspect-square bg-gray-50 flex items-center justify-center text-6xl">
                  {product.image}
                </div>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className={`w-4 h-4 ${
                      favorites.has(product.id) 
                        ? 'text-red-500' 
                        : 'text-gray-400'
                    }`}>
                    {favorites.has(product.id) ? '❤️' : '🤍'}
                  </div>
                </button>
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{product.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-bold text-lg" style={{ color: '#097a45' }}>${product.price}</span>
                    <span className="text-gray-500 text-xs ml-1">{product.unit}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-gray-600 text-xs ml-1">{product.rating}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => addToCart(product.id)}
                  disabled={!product.inStock}
                  className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    product.inStock
                      ? 'text-white hover:opacity-90'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  style={product.inStock ? { backgroundColor: '#097a45' } : {}}
                >
                  {product.inStock ? (
                    <div className="flex items-center justify-center">
                      <span className="mr-1">➕</span>
                      Add to Cart
                    </div>
                  ) : (
                    'Out of Stock'
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

export default buyerhome;