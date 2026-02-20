import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { AuthContext } from '../../context/AuthenticationContext';
import { useToast } from '../../context/ToastContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const navigate = useNavigate();

  const productId = product._id || product.id; 
  const isWishlisted = isInWishlist(productId);

  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
        toast.error("Please login to add items to cart");
        navigate('/login');
        return;
    }
    
    setIsAdding(true);
    // Simulate a small delay for better UX or wait for actual async operation if addToCart was async
    await new Promise(resolve => setTimeout(resolve, 500));
    addToCart(product);
    setIsAdding(false);
  };
    
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
        toast.error("Please login to like items");
        navigate('/login');
        return;
    }
    toggleWishlist(product);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-[#1e293b] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/50 hover:border-indigo-500/30 dark:hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col h-full font-sans group relative"
    >
        {/* Discount Badge */}
        {product.discount > 0 && (
            <span className="absolute top-3 left-3 z-10 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-pink-500/20 backdrop-blur-md">
                -{product.discount}% OFF
            </span>
        )}

      {/* Image Area */}
      <div className="relative pt-[100%] overflow-hidden bg-gray-50 dark:bg-[#0f172a] group-hover:bg-gray-100 dark:group-hover:bg-[#111827] transition-colors p-6">
         <Link to={`/product/${productId}`} className="absolute inset-0 flex items-center justify-center p-6">
             <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 will-change-transform drop-shadow-sm"
             />
         </Link>
         
         <button 
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-black/40 backdrop-blur-md hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm z-10 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 duration-300 transform"
         >
            {isWishlisted ? <HeartIconSolid className="w-5 h-5 text-rose-500" /> : <HeartIcon className="w-5 h-5 text-gray-400 hover:text-rose-400" />}
         </button>
      </div>

      {/* Infomation Area */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-[10px] font-bold tracking-wider text-indigo-500 uppercase mb-1.5">{product.category}</div>
        
        <Link to={`/product/${productId}`} className="block mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <h3 className="text-gray-900 dark:text-white font-bold leading-tight line-clamp-2 h-10 text-sm md:text-base">
                {product.name}
            </h3>
        </Link>
        
        <div className="flex items-center gap-1 mb-4">
             <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                    <StarIconSolid key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
                ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-1">({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-gray-100 dark:border-gray-700/50 pt-4">
            <div className="flex flex-col">
                 <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">₹</span>
                    <span className="text-xl font-extrabold text-gray-900 dark:text-white">{product.price.toLocaleString()}</span>
                </div>
                 {product.oldPrice && (
                    <span className="text-xs text-gray-400 line-through font-medium">₹{product.oldPrice.toLocaleString()}</span>
                )}
            </div>

            <button 
                onClick={handleAddToCart} 
                disabled={isAdding}
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center group/btn relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                {isAdding ? (
                   <svg className="animate-spin h-5 w-5 text-white relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <ShoppingCartIcon className="w-5 h-5 relative z-10" />
                )}
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
