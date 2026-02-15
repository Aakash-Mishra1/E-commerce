import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppWrapper from "../components/layout/AppWrapper";
import Button from "../components/common/Button";
import RatingStars from "../components/common/RatingStars";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { getProductById } from "../api";
import { products as localProducts } from "../data/products";
import { MinusIcon, PlusIcon, ShoppingBagIcon, TruckIcon, ShieldCheckIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch product, using local fallback", err);
        const found = localProducts.find(p => p.id === parseInt(id) || p.id === id || p._id === id);
        if (found) setProduct(found);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <AppWrapper><div className="text-white text-center py-20">Loading...</div></AppWrapper>;

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
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    if (!user) {
        if (window.confirm("You need to login to add items to cart. Go to login?")) {
            navigate('/login');
        }
        return;
    }
    addToCart({ ...product, quantity });
    alert("Product added to cart successfully!");
  };

  const handleBuyNow = () => {
    if (!user) {
        if (window.confirm("You need to login to buy items. Go to login?")) {
            navigate('/login');
        }
        return;
    }
    addToCart({ ...product, quantity });
    navigate('/checkout');
  };

  return (
    <AppWrapper>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Left: Image Gallery */}
                <div className="flex flex-col gap-4">
                    <div className="aspect-square bg-shop-navy/40 rounded-2xl overflow-hidden border border-white/5 relative group">
                         <img src={productImages[activeImage]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {productImages.map((img, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => setActiveImage(idx)}
                                className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === idx ? 'border-shop-blue' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
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
                            size="lg" 
                            className="flex-1 !text-base"
                        >
                            <ShoppingBagIcon className="w-5 h-5 mr-2" />
                            Add to Cart
                        </Button>
                        <Button 
                            variant="secondary" 
                            size="lg"
                            className="flex-1 !text-base"
                            onClick={handleBuyNow}
                        >
                            Buy Now
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
        </div>
    </AppWrapper>
  );
}