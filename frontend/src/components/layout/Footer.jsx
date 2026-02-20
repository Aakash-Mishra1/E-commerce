import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#050914] border-t border-white/10 pt-16 pb-8 mt-auto relative z-10 overflow-hidden">
    
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-brandBlue to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold font-poppins text-white tracking-tight mb-4 inline-block">
                <span className="text-brandBlue drop-shadow-lg">Shop</span>Verse
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium">
                Your premium destination for the latest tech, gadgets, and lifestyle products. Quality guaranteed.
            </p>
            <div className="flex space-x-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brandBlue hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg shadow-black/20">Fb</div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brandBlue hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg shadow-black/20">Tw</div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brandBlue hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg shadow-black/20">Ig</div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 font-poppins text-lg">Shop</h3>
            <ul className="space-y-3 text-sm text-gray-300 font-medium">
                <li><Link to="/shop" className="hover:text-brandBlue hover:translate-x-1 transition-all inline-block">All Products</Link></li>
                <li><Link to="/shop?cat=electronics" className="hover:text-brandBlue hover:translate-x-1 transition-all inline-block">Electronics</Link></li>
                <li><Link to="/shop?cat=fashion" className="hover:text-brandBlue hover:translate-x-1 transition-all inline-block">Fashion</Link></li>
                <li><Link to="/shop?cat=home" className="hover:text-brandBlue hover:translate-x-1 transition-all inline-block">Home & Living</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 font-poppins text-lg">Support</h3>
             <ul className="space-y-3 text-sm text-gray-300 font-medium">
                <li><Link to="/contact" className="hover:text-brandBlue hover:translate-x-1 transition-all inline-block">Contact Us</Link></li>
                <li><Link to="/faq" className="hover:text-brandBlue hover:translate-x-1 transition-all inline-block">FAQs</Link></li>
                <li><Link to="/shipping" className="hover:text-brandBlue hover:translate-x-1 transition-all inline-block">Shipping Info</Link></li>
                <li><Link to="/returns" className="hover:text-brandBlue hover:translate-x-1 transition-all inline-block">Returns & Refunds</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 font-poppins text-lg">Stay Updated</h3>
            <p className="text-gray-300 text-sm mb-4 font-medium">Subscribe for exclusive offers and deals.</p>
            <form className="flex flex-col gap-3">
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brandBlue focus:ring-1 focus:ring-brandBlue transition-all placeholder:text-gray-500"
                />
                <button className="bg-brandBlue text-white rounded-lg px-4 py-3 text-sm font-bold hover:bg-blue-600 hover:shadow-lg hover:shadow-brandBlue/25 transition-all transform hover:-translate-y-0.5">
                    Subscribe
                </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} ShopVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;