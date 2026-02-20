import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppWrapper from "../components/layout/AppWrapper";
import Button from "../components/common/Button";
import RatingStars from "../components/common/RatingStars";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthenticationContext";
import { useToast } from "../context/ToastContext"; // Import Toast
import Loader from "../components/common/Loader"; // Import Loader
import { getProductById, getProductReviews } from "../api"; 
import { products as localProducts } from "../data/products";
import { MinusIcon, PlusIcon, ShoppingBagIcon, TruckIcon, ShieldCheckIcon, ArrowPathIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import GlassCard from "../components/common/GlassCard";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const { addToast } = useToast(); // Use Toast Hook
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [reviews, setReviews] = useState([]); // Reviews State

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product, using local fallback", err);
        const found = localProducts.find(p => p.id === parseInt(id) || p.id === id || p._id === id);
        if (found) setProduct(found);
      }
      setLoading(false);
    };

    const fetchReviews = async () => {
        try {
            const res = await getProductReviews(id);
            setReviews(res.data);
        } catch (err) {
            console.error("Error fetching reviews:", err);
            // Optional: fallback mock reviews if API fails
        }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  if (loading) {
    return (
      <AppWrapper>
         <div className="flex items-center justify-center min-h-[80vh]">
             <Loader text="Loading product details..." />
         </div>
      </AppWrapper>
    );
  }

  // If product not found
  if (!product) {
       return (
         <AppWrapper>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
                <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                <Button onClick={() => navigate('/shop')} variant="primary">Back to Shop</Button>
            </div>
         </AppWrapper>
       )
  }

  // Ensure images array exists
  const galleryItems = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

  const nextImage = () => {
    if (galleryItems.length > 1) {
      setActiveImage((prev) => (prev + 1) % galleryItems.length);
    }
  };

  const prevImage = () => {
    if (galleryItems.length > 1) {
      setActiveImage((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
        addToast("Please login to add items to cart", "error");
        navigate('/login');
        return;
    }
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
    addToCart({ ...product, quantity });
    addToast("Product added to cart successfully!", "cart");
    setIsAdding(false);
  };

  const handleBuyNow = async () => {
    if (!user) {
        addToast("Please login to buy items", "error");
        navigate('/login');
        return;
    }
    setIsBuying(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
    addToCart({ ...product, quantity });
    setIsBuying(false);
    navigate('/checkout');
  };

  return (
    <AppWrapper>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Left: Image Gallery */}
                <div className="flex flex-col gap-4">
                    <div className="aspect-square bg-shop-navy/40 rounded-2xl overflow-hidden border border-white/5 relative group">
                        <img 
                          src={galleryItems[activeImage]} 
                          alt={product.name} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                        />
                    </div>

                    {/* Thumbnails */}
                    {galleryItems.length > 1 && (
                        <div className="flex gap-4 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                            {galleryItems.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                                        activeImage === index 
                                            ? 'border-indigo-500 ring-2 ring-indigo-500/20' 
                                            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                >
                                    <img 
                                        src={img} 
                                        alt={`${product.name} view ${index + 1}`} 
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Product Details */}
                <div>
                    <h1 className="text-3xl font-bold text-white font-poppins mb-2">{product.name}</h1>
                    <div className="flex items-center gap-4 mb-6">
                        <RatingStars rating={product.rating} count={product.reviews} />
                        <span className="text-shop-success text-sm font-medium px-2 py-0.5 bg-shop-success/10 rounded">In Stock</span>
                    </div>

                    <div className="flex items-end gap-3 mb-6">
                        <span className="text-4xl font-bold text-white">₹{product.price.toLocaleString()}</span>
                        {product.oldPrice && <span className="text-xl text-gray-500 line-through mb-1">₹{product.oldPrice.toLocaleString()}</span>}
                        {product.oldPrice && <span className="text-saleRed mb-1 font-bold">Save ₹{(product.oldPrice - product.price).toLocaleString()}</span>}
                    </div>

                    <p className="text-gray-300 leading-relaxed mb-8 border-b border-white/5 pb-8">
                        {product.description}
                    </p>

                    {product.features && product.features.length > 0 && (
                        <div className="mb-8 border-b border-white/5 pb-8">
                            <h4 className="font-bold text-white mb-3">Key Features</h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {product.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-gray-400 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brandBlue"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="mb-8">
                        <h4 className="font-bold text-white mb-3">Quantity</h4>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-white">
                                <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="text-xl font-mono w-8 text-center">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-white">
                                <PlusIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4 mb-10">
                        <Button 
                            onClick={handleAddToCart} 
                            disabled={isAdding || isBuying}
                            size="lg" 
                            className="flex-1 !text-base relative overflow-hidden"
                        >
                            {isAdding ? (
                                <>
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                    <span className="relative z-10 flex items-center">Adding...</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingBagIcon className="w-5 h-5 mr-2" />
                                    Add to Cart
                                </>
                            )}
                        </Button>
                        <Button 
                            variant="secondary" 
                            size="lg"
                            disabled={isAdding || isBuying}
                            className="flex-1 !text-base relative overflow-hidden"
                            onClick={handleBuyNow}
                        >
                            {isBuying ? (
                                <>
                                     <div className="absolute inset-0 bg-black/10 animate-pulse"></div>
                                     <span className="relative z-10 flex items-center">Processing...</span>
                                </>
                            ) : "Buy Now"}
                        </Button>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <TruckIcon className="w-6 h-6 text-shop-blue" />
                            <span>Free Delivery</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <ShieldCheckIcon className="w-6 h-6 text-shop-blue" />
                            <span>1 Year Warranty</span>
                        </div>
                         <div className="flex items-center gap-3 text-sm text-gray-400">
                            <ArrowPathIcon className="w-6 h-6 text-shop-blue" />
                            <span>30 Days Return</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-20 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    Customer Reviews 
                    <span className="text-sm font-normal text-gray-500 bg-white/5 px-3 py-1 rounded-full">{reviews.length}</span>
                </h3>
                
                {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
                        <UserCircleIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h4 className="text-gray-400 font-medium">No reviews yet for this product.</h4>
                        <p className="text-sm text-gray-500 mt-2">Be the first to review!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review, idx) => (
                            <GlassCard key={idx} className="p-6 hover:translate-y-[-5px] transition-transform duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brandBlue to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            {review.user?.username?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">
                                                {review.user?.username || 'Verified User'}
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                        {[...Array(5)].map((_, i) => (
                                            <StarIconSolid 
                                                key={i} 
                                                className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} 
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    "{review.comment}"
                                </p>
                            </GlassCard>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </AppWrapper>
  );
}