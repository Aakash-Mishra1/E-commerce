import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AppWrapper from '../components/layout/AppWrapper';
import ProductCard from '../components/product/ProductCard';
import { getProducts } from '../api';
import { products as localProducts } from '../data/products';

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryParam = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [priceRange, setPriceRange] = useState(200000);
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
        try {
            setLoading(true);
            // Handle special UI categories that don't map to DB categories directly
            let apiCategory = selectedCategory;
            if (selectedCategory === 'All' || selectedCategory === 'Bestsellers' || selectedCategory === 'New Arrivals') {
                apiCategory = null;
            }
            
            const res = await getProducts(apiCategory);
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch products, using local fallback", err);
            const filtered = localProducts.filter(p => {
                if (['All', 'Bestsellers', 'New Arrivals'].includes(selectedCategory)) return true;
                return p.category === selectedCategory;
            });
            setProducts(filtered);
            setLoading(false);
        }
    };
    fetchProducts();
  }, [selectedCategory]);

  // Update selected category if URL param changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const categories = ['All', 'Audio', 'Gaming', 'Wearables', 'Monitors', 'Photography', 'Furniture', 'Computers', 'Sports'];

  const filteredProducts = products.filter(product => {
    // Price check - handle both number and string inputs from DB
    const pPrice = typeof product.price === 'string' ? parseFloat(product.price.replace(/[^0-9.]/g, '')) : product.price;
    const matchesPrice = (pPrice || 0) <= priceRange;
    
    // Safety check for search
    const searchLower = searchQuery ? searchQuery.toLowerCase() : '';
    const nameMatch = product.name ? product.name.toLowerCase().includes(searchLower) : false;
    const categoryMatch = product.category ? product.category.toLowerCase().includes(searchLower) : false;

    const matchesSearch = !searchQuery || nameMatch || categoryMatch;
    
    return matchesPrice && matchesSearch;
  }).sort((a, b) => {
    // Sort logic needs parsed prices
    const getPrice = (p) => typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.]/g, '')) : p.price;
    if (sortBy === 'price-low') return getPrice(a) - getPrice(b);
    if (sortBy === 'price-high') return getPrice(b) - getPrice(a);
    return 0; 
  });

  return (
    <AppWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">
            
            {/* Filters Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-navy/80 border border-white/5 rounded-xl p-6 sticky top-40 backdrop-blur-sm shadow-xl">
                    <h3 className="font-bold text-white mb-4">Categories</h3>
                    <ul className="space-y-2 text-sm text-gray-400 mb-8">
                        {categories.map(cat => (
                            <li key={cat} className="flex items-center gap-2 hover:text-white cursor-pointer group" onClick={() => setSelectedCategory(cat)}>
                                <div className={`w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center group-hover:border-brandBlue ${selectedCategory === cat ? 'bg-brandBlue border-brandBlue' : ''}`}>
                                  {selectedCategory === cat && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                                <span className={selectedCategory === cat ? 'text-brandBlue font-medium' : ''}>{cat}</span>
                            </li>
                        ))}
                    </ul>

                    <h3 className="font-bold text-white mb-4">Price Range</h3>
                    <div className="space-y-4">
                        <input 
                            type="range" 
                            min="0" 
                            max="200000" 
                            step="1000"
                            value={priceRange}
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brandBlue" 
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>₹0</span>
                            <span className="text-brandBlue font-bold">₹{priceRange.toLocaleString()}</span>
                            <span>₹2L+</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">
                        {selectedCategory === 'All' ? 'All Products' : `${selectedCategory}`} 
                        <span className="text-sm font-normal text-gray-400 ml-2">({filteredProducts.length} items)</span>
                    </h2>
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-navy border border-white/10 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-brandBlue cursor-pointer shadow-lg"
                    >
                        <option value="featured" className="bg-navy text-white">Sort by: Featured</option>
                        <option value="price-low" className="bg-navy text-white">Price: Low to High</option>
                        <option value="price-high" className="bg-navy text-white">Price: High to Low</option>
                    </select>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
                        <p className="text-gray-400 mb-6">
                            {searchQuery 
                                ? `We couldn't find anything matching "${searchQuery}"`
                                : "Try adjusting your filters or category."}
                        </p>
                        <button 
                            onClick={() => {
                                setSelectedCategory('All'); 
                                setPriceRange(200000);
                                // If there is a search query, we might want to clear it too, but that requires navigation.
                                // simpler to junavigate(r use window.location if real clear is needed
                                if(searchQuery) window.history.pushState({}, '', '/shop'); 
                            }}
                            className="px-6 py-2 bg-brandBlue text-white rounded-lg hover:bg-blue-600 transition shadow-lg shadow-blue-500/20"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </AppWrapper>
  );
};

export default ProductList;
