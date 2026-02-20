import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppWrapper from '../components/layout/AppWrapper';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import Loader from '../components/common/Loader'; // Import Loader
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext'; // Import Toast
import { AuthContext } from '../context/AuthenticationContext';
import { GiftIcon, ArrowRightIcon, SparklesIcon, MapPinIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'; // Import icons for modal

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { addToast } = useToast();
  const { user, updateUser } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null); // Store the applied coupon code

  // Address State
  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [selectedAddress, setSelectedAddress] = useState(user?.addresses?.[0] || null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState({
      fullName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      phone: ''
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const tax = subtotal * 0.18;
  const total = (subtotal + tax) - discount;

  const handleApplyCoupon = () => {
      // Logic for coupons
      const code = couponCode.trim().toUpperCase();

      // 1. Check User's Unlocked Coupons first
      if (user && user.coupons) {
          const userCoupon = user.coupons.find(c => c.code === code);
          
          if (userCoupon) {
            if (userCoupon.isUsed) {
                 addToast("This coupon has already been used", "error");
                 return;
            }
            if (new Date(userCoupon.expiryDate) < new Date()) {
                 addToast("This coupon has expired", "error");
                 return;
            }
            
            setDiscount(userCoupon.discount);
            setAppliedCoupon(userCoupon.code); 
            addToast(`Coupon Applied: ₹${userCoupon.discount} Off`, "success");
            return;
          }
      }

      // 2. Fallback to hardcoded coupons
      if (code === 'SAVE100') {
          setDiscount(100);
          addToast("Coupon Applied: ₹100 Off", "success");
      } else if (code === 'SAVE1000') {
          setDiscount(1000);
          addToast("Coupon Applied: ₹1000 Off", "success");
      } else if (code === 'SAVE10000') {
          setDiscount(10000);
          addToast("Coupon Applied: ₹10000 Off", "success");
      } else {
          addToast("Invalid or Expired Coupon Code", "error");
          setDiscount(0);
          setAppliedCoupon(null);
      }
  };

  const handleAddressSubmit = (e) => {
      e.preventDefault();
      // Add logic to save address to user profile
      const updatedAddresses = [...(user?.addresses || []), newAddress];
      updateUser({ addresses: updatedAddresses });
      setSelectedAddress(newAddress);
      setIsAddingNew(false);
      setNewAddress({ fullName: '', street: '', city: '', state: '', zipCode: '', country: 'India', phone: '' });
      addToast("Address Added Successfully", "success");
  };

  const proceedToPayment = () => {
      if (!selectedAddress) {
          addToast("Please select a delivery address", "error");
          return;
      }
      setStep(2);
      window.scrollTo(0, 0);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);

    // Create format for storing order
    const orderData = {
        total: `₹${Math.max(0, total).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
        items: cartItems.length,
        cartDetails: cartItems,
        paymentMethod,
        date: new Date().toISOString(),
        address: selectedAddress, // Include address in order
        couponCode: appliedCoupon // Pass applied coupon code
    };

    // Simulate API call
    setTimeout(() => {
        addOrder(orderData);
        setLoading(false);
        if (clearCart) clearCart(); 
        setShowRewardModal(true); // Show modal instead of navigating immediately
    }, 2000);
  };

  const handleClaimPoints = () => {
      // Update points in context optimistically (backend already added them)
      const currentPoints = user.points || 0;
      updateUser({ points: currentPoints + 1000 });
      addToast("1000 Points Added to Wallet!", "success");
      setShowRewardModal(false);
      navigate('/profile');
  };

  const handleLater = () => {
      const currentPoints = user?.points || 0;
      updateUser({ points: currentPoints + 1000 });
      setShowRewardModal(false);
      navigate('/shop');
  };

  if (loading) {
      return (
          <AppWrapper>
             <div className="flex items-center justify-center min-h-[70vh]">
                 <Loader text="Processing Payment..." />
             </div>
          </AppWrapper>
      )
  }

  return (
    <AppWrapper>
        {/* Success / Reward Modal */}
        {showRewardModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 max-w-xs w-full text-center relative shadow-2xl animate-fade-in-up">
                    <div className="w-16 h-16 bg-brandBlue/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-brandBlue/10">
                        <GiftIcon className="w-8 h-8 text-brandBlue animate-bounce" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">Order Successful!</h2>
                    <p className="text-gray-400 text-sm mb-4">Thank you for your purchase.</p>
                    
                    <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-3 mb-6">
                        <p className="text-yellow-400 font-bold uppercase tracking-wider text-[10px] mb-1">Rewards Earned</p>
                        <p className="text-2xl font-black text-white">+1000 Points</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button onClick={handleClaimPoints} className="w-full py-2 text-sm font-bold shadow-lg shadow-brandBlue/25 hover:shadow-brandBlue/40 transition-all flex items-center justify-center gap-2">
                            <span>Claim 1000 Points</span>
                            <SparklesIcon className="w-5 h-5" />
                        </Button>
                        <button 
                            onClick={handleLater}
                            className="text-gray-400 hover:text-white font-medium py-2 transition-colors text-sm hover:underline"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        )}

        <div className="max-w-6xl mx-auto px-4 py-10">
            {/* Step 1: Address Selection */}
            {step === 1 && (
                <div className="animate-fade-in-up">
                    <h1 className="text-3xl font-bold text-white font-poppins mb-8 text-center">Select Delivery Address</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Add New Address Card */}
                        <div 
                            onClick={() => setIsAddingNew(true)}
                            className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-brandBlue/50 transition-all min-h-[200px]"
                        >
                            <PlusIcon className="w-12 h-12 text-gray-400 mb-2" />
                            <p className="text-gray-400 font-medium">Add New Address</p>
                        </div>

                        {/* Existing Addresses */}
                        {isAddingNew && (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-[#1e1e1e] p-6 rounded-xl border border-white/10 relative">
                                <h3 className="text-xl font-bold text-white mb-4">Add New Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField 
                                        label="Full Name" placeholder="John Doe" required 
                                        value={newAddress.fullName} onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
                                    />
                                    <InputField 
                                        label="Phone Number" placeholder="9876543210" required 
                                        value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                                    />
                                    <div className="md:col-span-2">
                                        <InputField 
                                            label="Address (Area and Street)" placeholder="Flat 101, Galaxy Apartments" required 
                                            value={newAddress.street} onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                                        />
                                    </div>
                                    <InputField 
                                        label="City/Town" placeholder="Mumbai" required 
                                        value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                                    />
                                    <InputField 
                                        label="State" placeholder="Maharashtra" required 
                                        value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                                    />
                                    <InputField 
                                        label="Zip Code" placeholder="400001" required 
                                        value={newAddress.zipCode} onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                                    />
                                    <div className="md:col-span-2 flex gap-3 mt-4">
                                        <Button onClick={handleAddressSubmit} className="flex-1">Save Address</Button>
                                        <Button variant="secondary" onClick={() => setIsAddingNew(false)} className="flex-1">Cancel</Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {user?.addresses?.map((addr, idx) => (
                             <div 
                                key={idx}
                                onClick={() => setSelectedAddress(addr)}
                                className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer min-h-[200px] flex flex-col justify-between ${
                                    JSON.stringify(selectedAddress) === JSON.stringify(addr) 
                                    ? 'border-brandBlue bg-brandBlue/5 text-white shadow-lg shadow-brandBlue/10' 
                                    : 'border-white/10 bg-navy/40 text-gray-400 hover:border-white/30'
                                }`}
                             >
                                 <div>
                                     <div className="flex justify-between items-start mb-2">
                                         <h3 className="font-bold text-lg text-white">{addr.fullName}</h3>
                                         {JSON.stringify(selectedAddress) === JSON.stringify(addr) && <span className="bg-brandBlue text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Selected</span>}
                                     </div>
                                     <p className="text-sm mb-1">{addr.street}</p>
                                     <p className="text-sm mb-1">{addr.city}, {addr.state} - {addr.zipCode}</p>
                                     <p className="text-sm mb-3">{addr.country}</p>
                                     <p className="text-sm font-medium">Phone: {addr.phone}</p>
                                 </div>
                                 <button 
                                    className="mt-4 text-xs text-brandBlue hover:underline flex items-center gap-1"
                                    onClick={(e) => { e.stopPropagation(); setIsAddingNew(true); setNewAddress(addr); }}
                                 >
                                     <PencilSquareIcon className="w-4 h-4" /> Edit
                                 </button>
                             </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-8">
                        <Button 
                            onClick={proceedToPayment} 
                            disabled={!selectedAddress}
                            className={`px-12 py-4 text-lg font-bold rounded-full shadow-xl transition-all ${
                                selectedAddress ? 'shadow-brandBlue/25 hover:shadow-brandBlue/40 translate-y-0' : 'opacity-50 cursor-not-allowed'
                            }`}
                        >
                            Proceed to Payment
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
            <>
            <h1 className="text-3xl font-bold text-white font-poppins mb-8 text-center">Secure Payment</h1>

            {/* Address Summary Bar */}
            <div className="bg-[#1e1e1e] border border-white/10 rounded-xl p-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg animate-fade-in-down">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-10 h-10 bg-brandBlue/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPinIcon className="w-5 h-5 text-brandBlue" />
                    </div>
                    <div>
                        <p className="text-xs text-brandBlue font-bold uppercase tracking-wider mb-0.5">Delivering to:</p>
                        <p className="text-white font-medium text-sm">
                            <span className="font-bold">{selectedAddress?.fullName}</span>, {selectedAddress?.street}, {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.zipCode}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => setStep(1)}
                    className="text-brandBlue text-sm font-bold border border-brandBlue/30 px-4 py-2 rounded-lg hover:bg-brandBlue/10 transition whitespace-nowrap"
                >
                    Change Address
                </button>
            </div>
            
            <form onSubmit={handlePayment} className="flex flex-col md:flex-row gap-8 animate-fade-in-up">
                
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

                         {/* Google Pay Option */}
                         <div onClick={() => setPaymentMethod('googlepay')} className={`cursor-pointer rounded-xl border p-4 transition-all ${paymentMethod === 'googlepay' ? 'bg-brandBlue/10 border-brandBlue' : 'bg-navy/40 border-white/5 hover:bg-white/5'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'googlepay' ? 'border-brandBlue' : 'border-gray-500'}`}>
                                    {paymentMethod === 'googlepay' && <div className="w-2 h-2 bg-brandBlue rounded-full"></div>}
                                </div>
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-white font-medium">Google Pay</span>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg" alt="GPay" className="h-6 ml-auto bg-white rounded-sm px-2 object-contain" />
                                </div>
                            </div>
                            {paymentMethod === 'googlepay' && (
                                <div className="mt-4 pl-7 text-gray-400 text-sm">
                                    <p className="mb-2">Enter your UPI ID to verify payment</p>
                                    <InputField placeholder="Example: mobile@oksbi" />
                                    <p className="text-[10px] text-gray-500 mt-1">Demo UPI ID: <span className="text-brandBlue font-mono">user@bank</span></p>
                                </div>
                            )}
                         </div>

                         {/* Paytm Option */}
                         <div onClick={() => setPaymentMethod('paytm')} className={`cursor-pointer rounded-xl border p-4 transition-all ${paymentMethod === 'paytm' ? 'bg-brandBlue/10 border-brandBlue' : 'bg-navy/40 border-white/5 hover:bg-white/5'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'paytm' ? 'border-brandBlue' : 'border-gray-500'}`}>
                                    {paymentMethod === 'paytm' && <div className="w-2 h-2 bg-brandBlue rounded-full"></div>}
                                </div>
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-white font-medium">Paytm Wallet / UPI</span>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="h-6 ml-auto bg-white rounded-sm px-2 object-contain" />
                                </div>
                            </div>
                             {paymentMethod === 'paytm' && (
                                <div className="mt-4 pl-7 text-gray-400 text-sm">
                                    <p className="mb-2">Link your Paytm Wallet or enter UPI ID</p>
                                    <InputField placeholder="Enter Paytm Number or UPI" />
                                </div>
                            )}
                         </div>
                   </div>
                </div>

                {/* Right Side: Order Summary */}
                <div className="w-full md:w-96">
                    <div className="bg-navy/60 backdrop-blur-md rounded-xl border border-white/10 p-6 sticky top-24">
                        <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
                        
                        {/* Coupon Code Section */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Have a Coupon?</label>
                            <div className="flex gap-2 mb-2">
                                <InputField 
                                    className="h-10 text-sm"
                                    placeholder="Enter Code" 
                                    value={couponCode} 
                                    onChange={(e) => setCouponCode(e.target.value)}
                                />
                                <Button 
                                    type="button" 
                                    variant="secondary" 
                                    className="h-10 px-4 whitespace-nowrap"
                                    onClick={handleApplyCoupon}
                                >
                                    Apply
                                </Button>
                            </div>
                            <p className="text-xs text-brandBlue/80">Try code: <span className="font-mono font-bold">SAVE100</span> (Get ₹100 OFF)</p>
                            {discount > 0 && (
                                <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                    Coupon Applied Successfully!
                                </p>
                            )}
                        </div>
                        
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
                                <span>₹{tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-400">
                                    <span>Discount</span>
                                    <span>-₹{discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-white/10">
                                <span>Total</span>
                                <span className="text-brandBlue">
                                    ₹{Math.max(0, total).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                        </div>

                        <Button 
                            className="w-full mt-8 shadow-lg shadow-brandBlue/20" 
                            variant="primary" 
                            size="lg"
                            type="submit"
                            disabled={loading || cartItems.length === 0}
                        >
                            {loading ? 'Processing...' : `Pay ₹${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                        </Button>

                        <p className="text-xs text-center text-gray-500 mt-4">
                            By placing this order, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>

            </form>
            </>
            )}
        </div>
    </AppWrapper>
  );
};

export default Checkout;
// dpxa77
