import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppWrapper from '../components/layout/AppWrapper';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { createPaymentOrder, verifyPayment } from '../api';
import { useToast } from '../context/ToastContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('googlepay'); // Default to Gpay for demo
  const [upiId, setUpiId] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const total = subtotal * 1.18; // Adding 18% tax

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (paymentMethod === 'googlepay') {
        const upiValue = upiId.trim();
        
        // Mock UPI Logic
        if (upiValue === 'success@upi') {
             setLoading(true);
             setTimeout(async () => {
                const orderData = {
                    total: total,
                    items: cartItems.length,
                    cartDetails: cartItems,
                    paymentMethod: 'UPI (Demo)',
                    paymentInfo: { 
                        id: `upi_${Date.now()}`, 
                        status: 'captured', 
                        method: 'upi',
                        vpa: upiValue 
                    },
                    date: new Date().toISOString(),
                    address: { 
                        line1: "123 Tech Park", 
                        city: "Bangalore", 
                        state: "KA",
                        postal_code: "560001",
                        country: "India" 
                    },
                    status: "Order Confirmed" // Initial status to show in tracking
                };

                const success = await addOrder(orderData);
                if (success) {
                    if (clearCart) clearCart();
                    addToast("Order placed successfully!", "success");
                    navigate('/profile');
                } else {
                    addToast("Failed to place order.", "error");
                }
                setLoading(false);
             }, 1500);
             return;
        } else {
            addToast("Please enter valid UPI ID (Hint: success@upi)", "error");
            setLoading(false);
            return;
        }
    }

    if (paymentMethod === 'card') {
        const res = await loadRazorpay();
        if (!res) {
            addToast('Razorpay SDK failed to load. Are you online?', "error");
            setLoading(false);
            return;
        }

        try {
            // 1. Create Order on Backend
            const result = await createPaymentOrder(total);
            if (!result) {
                addToast("Server error. Are you online?", "error");
                setLoading(false);
                return;
            }

            const { amount, id: order_id, currency } = result.data;

            const options = {
                key: "rzp_test_YourKeyHere", // Replace with your actual Razorpay Key ID
                amount: amount.toString(),
                currency: currency,
                name: "Your Store Name",
                description: "Purchase Transaction",
                order_id: order_id,
                handler: async function (response) {
                    const data = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                    };

                    // 2. Verify Payment
                    try {
                        const verifyRes = await verifyPayment(data);
                        if (verifyRes.data.message === "Payment verified successfully") {
                            // 3. Save Order to Database
                            const orderData = {
                                total: total,
                                items: cartItems.length,
                                cartDetails: cartItems,
                                paymentMethod: 'Card (Razorpay)',
                                paymentInfo: data,
                                date: new Date().toISOString(),
                                address: { 
                                    line1: "123 Main St",
                                    city: "Metropolis",
                                    state: "NY",
                                    postal_code: "10001",
                                    country: "India"
                                },
                                status: "Order Confirmed"
                            };
                            
                            const success = await addOrder(orderData);
                            if (success) {
                                if (clearCart) clearCart();
                                addToast("Order placed successfully!", "success");
                                navigate('/profile');
                            }
                        } else {
                            addToast("Payment verification failed!", "error");
                        }
                    } catch (err) {
                        console.error(err);
                        addToast("Payment verification failed!", "error");
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    // ...
                },
                // ...
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (err) {
            console.error(err);
            setLoading(false);
            addToast("Payment initiation failed. Are you online?", "error");
        }
    }
  };

  return (
    <AppWrapper>
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-white font-poppins mb-8 text-center">Secure Payment</h1>
            
            <form onSubmit={handlePayment} className="flex flex-col md:flex-row gap-8">
                
                {/* Left Side: Payment Options */}
                <div className="flex-1 space-y-6">
                    <h3 className="text-xl font-bold text-white mb-4">Select Payment Method</h3>
                    
                    {/* Payment Method Selection */}
                    <div className="space-y-4">
                         
                         {/* Card Option */}
                         <div onClick={() => setPaymentMethod('card')} className={`cursor-pointer rounded-xl border p-4 transition-all ${paymentMethod === 'card' ? 'bg-brandBlue/10 border-brandBlue' : 'bg-navy/40 border-white/5 hover:bg-white/5'}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-brandBlue' : 'border-gray-500'}`}>
                                    {paymentMethod === 'card' && <div className="w-2 h-2 bg-brandBlue rounded-full"></div>}
                                </div>
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-white font-medium">Credit / Debit Card</span>
                                    <div className="flex gap-2 ml-auto">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 bg-white rounded-sm px-1 object-contain" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 bg-white rounded-sm px-1 object-contain" />
                                    </div>
                                </div>
                            </div>
                            {paymentMethod === 'card' && (
                                <div className="mt-4 grid grid-cols-2 gap-4 pl-7 animate-fadeIn">
                                    <div className="col-span-2">
                                        <InputField placeholder="Card Number" required />
                                    </div>
                                    <InputField placeholder="Expiry Date (MM/YY)" required />
                                    <InputField placeholder="CVV" type="password" maxLength={3} required />
                                    <div className="col-span-2">
                                        <InputField placeholder="Card Holder Name" required />
                                    </div>
                                </div>
                            )}
                         </div>

                         {/* Google Pay / UPI Option */}
                         <div onClick={() => setPaymentMethod('googlepay')} className={`cursor-pointer rounded-xl border p-4 transition-all ${paymentMethod === 'googlepay' ? 'bg-brandBlue/10 border-brandBlue' : 'bg-navy/40 border-white/5 hover:bg-white/5'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'googlepay' ? 'border-brandBlue' : 'border-gray-500'}`}>
                                    {paymentMethod === 'googlepay' && <div className="w-2 h-2 bg-brandBlue rounded-full"></div>}
                                </div>
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-white font-medium">Google Pay / UPI (Demo)</span>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg" alt="GPay" className="h-6 ml-auto bg-white rounded-sm px-2 object-contain" />
                                </div>
                            </div>
                            {paymentMethod === 'googlepay' && (
                                <div className="mt-4 pl-7 text-gray-400 text-sm">
                                    <p className="mb-2">Enter your UPI ID to verify payment</p>
                                    
                                    {/* Demo Helper for Google Pay */}
                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-3">
                                        <p className="text-xs text-blue-300 mb-1">💡 For Demo/Testing, copy this ID:</p>
                                        <div className="flex items-center gap-2 bg-black/40 p-2 rounded border border-white/10">
                                            <code className="text-sm font-mono text-white">success@upi</code>
                                            <span className="text-xs text-gray-500 ml-auto select-none">Free Payment</span>
                                        </div>
                                    </div>

                                    <InputField 
                                        placeholder="Example: success@upi" 
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                    />
                                </div>
                            )}
                         </div>
                   </div>
                </div>

                {/* Right Side: Order Summary */}
                <div className="w-full md:w-96">
                    <div className="bg-navy/60 backdrop-blur-md rounded-xl border border-white/10 p-6 sticky top-24">
                        <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
                        
                        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map((item, idx) => (
                                <div key={idx} className="flex gap-3 text-sm">
                                    <div className="w-12 h-12 rounded bg-white/5 flex-shrink-0 overflow-hidden">
                                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white truncate">{item.name}</p>
                                        <p className="text-gray-400">Qty: {item.quantity || 1}</p>
                                    </div>
                                    <div className="text-white">
                                        ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-6 border-t border-white/10 text-sm">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>GST (18%)</span>
                                <span>₹{(total - subtotal).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-white/10">
                                <span>Total</span>
                                <span className="text-brandBlue">₹{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                        </div>

                        <Button 
                            className="w-full mt-8 shadow-lg shadow-brandBlue/20" 
                            variant="primary" 
                            size="lg"
                            type="submit"
                            disabled={loading || cartItems.length === 0}
                        >
                            {loading ? 'Processing...' : `Confirm Order ₹${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                        </Button>

                        <p className="text-xs text-center text-gray-500 mt-4">
                            By placing this order, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>

            </form>
        </div>
    </AppWrapper>
  );
};

export default Checkout;
// dpxa77
