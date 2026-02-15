import React, { useEffect, useState } from 'react';
import ProductCard from '../product/ProductCard';
import { getProducts } from '../../api';
import { products as localProducts } from '../../data/products';

const FeaturedProducts = ({ title = "Featured Products", category = null }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch strictly by category if provided, otherwise all
        const res = await getProducts(category);
        let data = res.data;
        
        // Simulating "Featured" vs "New" by simple shuffling or slicing if no backend support
        // For now, we will just slice differently based on title hash or random to make it look different
        if (!category) {
             // If generic "Featured", just take first 4-8
             data = data.slice(0, 8);
        } else {
             data = data.slice(0, 8);
        }
        
        setProducts(data); 
      } catch (err) {
        console.error("Error fetching featured products, using local fallback", err);
        let data = localProducts;
        if (category) {
            data = data.filter(p => p.category === category);
        }
        setProducts(data.slice(0, 8));
      }
    };
    fetchProducts();
  }, [category]); // added category dependency

  return (
    <div className="py-12" data-aos="fade-up">
      <div className="flex justify-between items-end mb-8 px-2">
        <div className="border-l-4 border-brandBlue pl-4">
            <h2 className="text-2xl font-bold text-white font-poppins">{title}</h2>
            <p className="text-gray-400 text-sm mt-1">Handpicked for your digital lifestyle</p>
        </div>
        <a href={`/shop?category=${category || 'All'}`} className="text-brandBlue hover:text-white transition-colors text-sm font-medium flex items-center">
            View all &rarr;
        </a>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
             <div key={product._id || product.id}>
                <ProductCard product={product} />
             </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            No featured products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;
