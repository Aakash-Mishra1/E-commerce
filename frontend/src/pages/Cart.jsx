import React from 'react';
import AppWrapper from '../components/layout/AppWrapper';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import { TrashIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  if (cartItems.length === 0) {
      return (
          <AppWrapper>
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                  <h2 className="text-3xl font-bold text-white font-poppins mb-4">Your Cart is Empty</h2>
                  <p className="text-gray-400 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Explore our products and find something you love!</p>
                  <Link to="/shop">
                      <Button size="lg">Start Shopping</Button>
                  </Link>
              </div>
          </AppWrapper>
      )
  }

  return (
    <AppWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-white font-poppins mb-8">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items List */}
            <div className="flex-1 space-y-4">
                {cartItems.map((item) => (
                    <div key={item.id} className="bg-shop-navy/40 border border-white/5 rounded-xl p-4 flex gap-4 items-center">
                        <div className="w-24 h-24 bg-shop-bg rounded-lg overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1">
                            <h3 className="font-bold text-white text-lg mb-1">{item.name}</h3>
                            <p className="text-gray-400 text-sm mb-2">{item.category}</p>
                            <span className="text-shop-blue font-bold">₹{item.price.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <select 
                                value={item.quantity || 1}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                className="bg-shop-bg border border-white/10 rounded-md px-2 py-1 text-white text-sm focus:outline-none"
                            >
                                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                            <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-400 hover:text-shop-danger transition-colors p-2"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-80 flex-shrink-0">
                <div className="bg-shop-navy/60 border border-white/5 rounded-xl p-6 sticky top-24">
                    <h3 className="font-bold text-white text-lg mb-6">Order Summary</h3>
                    
                    <div className="space-y-3 text-sm border-b border-white/5 pb-6 mb-6">
                        <div className="flex justify-between text-gray-300">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Tax (18%)</span>
                            <span>₹{(subtotal * 0.18).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Shipping</span>
                            <span className="text-shop-success">Free</span>
                        </div>
                    </div>

                    <div className="flex justify-between text-white font-bold text-lg mb-8">
                        <span>Total</span>
                        <span>₹{(subtotal * 1.18).toLocaleString()}</span>
                    </div>

                    <Link to="/checkout" className="block w-full">
                        <Button className="w-full flex justify-between items-center group">
                            Checkout
                            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </AppWrapper>
  );
};

export default Cart;