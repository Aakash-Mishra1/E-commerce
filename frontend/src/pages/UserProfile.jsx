import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import AppWrapper from '../components/layout/AppWrapper';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import { ShoppingBagIcon, HeartIcon, XMarkIcon, TruckIcon } from '@heroicons/react/24/outline';
import { useWishlist } from '../context/WishlistContext';
import { useOrders } from '../context/OrderContext';
import ProductCard from '../components/product/ProductCard';

const OrderDetailsModal = ({ order, onClose, onCancel }) => {
  if (!order) return null;

  const canCancel = ['Processing', 'Order Confirmed', 'Pending'].includes(order.status);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-5 relative shadow-2xl shadow-black/50">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <XMarkIcon className="w-5 h-5" />
        </button>

        <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
          <div>
             <h2 className="text-xl font-bold text-white mb-1">Order Details</h2>
             <p className="text-brandBlue font-mono text-sm">{order.id}</p>
          </div>
          <div className="text-right">
             <p className="text-xs text-gray-400 mb-0.5">Order Placed</p>
             <p className="font-bold text-white text-sm">{order.date}</p>
          </div>
        </div>

        {/* Tracking Status - Compact */}
        <div className="mb-5 bg-black/30 p-4 rounded-xl border border-white/5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <TruckIcon className="w-4 h-4 text-brandBlue" />
                Order Tracking
            </h3>
            <div className="relative pl-2">
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-white/10"></div>
                
                <div className="space-y-4">
                    <div className="relative pl-8">
                        <div className={`absolute left-0 top-0.5 w-3.5 h-3.5 rounded-full border-[1.5px] ${order.status !== 'Cancelled' ? 'bg-brandBlue border-brandBlue' : 'border-gray-600 bg-gray-600'} flex items-center justify-center`}></div>
                        <p className="text-white text-sm font-bold leading-none">Order Confirmed</p>
                    </div>
                    <div className="relative pl-8">
                         <div className={`absolute left-0 top-0.5 w-3.5 h-3.5 rounded-full border-[1.5px] ${['Shipped', 'Delivered'].includes(order.status) ? 'bg-brandBlue border-brandBlue' : 'border-gray-600 bg-black'}`}></div>
                         <p className={`${['Shipped', 'Delivered'].includes(order.status) ? 'text-white' : 'text-gray-500'} text-sm font-bold leading-none`}>Shipped</p>
                    </div>
                    <div className="relative pl-8">
                         <div className={`absolute left-0 top-0.5 w-3.5 h-3.5 rounded-full border-[1.5px] ${order.status === 'Delivered' ? 'bg-green-500 border-green-500' : 'border-gray-600 bg-black'}`}></div>
                         <p className={`${order.status === 'Delivered' ? 'text-white' : 'text-gray-500'} text-sm font-bold leading-none`}>Delivered</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Order Items - Compact */}
        <div className="space-y-3 mb-5">
           <h3 className="text-sm font-bold text-white">Items</h3>
           <div className="bg-white/5 rounded-xl p-3 divide-y divide-white/10 max-h-40 overflow-y-auto custom-scrollbar">
              {order.cartDetails && order.cartDetails.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center gap-3 first:pt-0 last:pb-0">
                      <div className="w-10 h-10 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity || 1}</p>
                      </div>
                      <p className="text-white text-sm font-bold">₹{(item.price * (item.quantity || 1)).toLocaleString()}</p>
                  </div>
              ))}
           </div>
        </div>

        <div className="flex justify-between items-center text-lg font-bold border-t border-white/10 pt-4 mb-4">
            <span className="text-white">Total Amount</span>
            <span className="text-brandBlue">{order.total}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
            {canCancel && (
                <button 
                    onClick={() => {
                        onClose();
                        onCancel(order);
                    }}
                    className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-bold hover:bg-red-500/20 transition-colors"
                >
                    Cancel Order
                </button>
            )}
            <button 
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/10 text-sm font-bold hover:bg-white/20 transition-colors"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

const CancelOrderModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-sm p-5 relative animate-in fade-in zoom-in duration-200 shadow-2xl shadow-red-900/20">
        <h3 className="text-lg font-bold text-white mb-2">Cancel Order</h3>
        <p className="text-gray-400 mb-4 text-sm">Are you sure you want to cancel? This action cannot be undone.</p>
        
        <label className="text-xs text-gray-500 block mb-1">Reason (Optional)</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-brandBlue focus:outline-none mb-6 h-24 resize-none placeholder-gray-600"
          placeholder="Tell us why you're cancelling..."
        />

        <div className="flex gap-2 justify-end">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="text-gray-400 hover:text-white border-transparent text-sm h-9"
          >
            Keep Order
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
                onConfirm(reason || "No reason provided");
                setReason(''); 
            }}
            className="!bg-red-600 hover:!bg-red-700 border-none shadow-none text-sm h-9"
          >
            Confirm Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('Order History');
  const { user, logout } = useContext(AuthContext); // Use real user data
  const navigate = useNavigate();
  const { wishlistItems } = useWishlist();
  const { orders: allOrders, cancelOrder } = useOrders();
  // Filter orders so users only see their own
  const orders = (allOrders || []).filter(order => !order.userId || order.userId === user?._id);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Cancel Logic state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const userInfo = {
    name: user.username || "Guest User",
    email: user.email || "guest@example.com",
    role: user.isAdmin ? "Admin User" : "Valued Customer",
    joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Just Joined",
    // Use fallback avatar correctly
    avatar: user.img || null
  };

  const handleCancelClick = (order) => {
    setOrderToCancel(order);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = (reason) => {
    if (orderToCancel) {
      cancelOrder(orderToCancel.id, reason);
      setCancelModalOpen(false);
      setOrderToCancel(null);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Wishlist':
        return (
          <div className="space-y-6">
             <h3 className="text-xl font-bold text-white mb-4">My Wishlist</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wishlistItems.length === 0 ? (
                    <div className="col-span-2 text-center py-10 text-gray-400 bg-navy/40 rounded-xl border border-white/5">
                        <HeartIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Your wishlist is empty.</p>
                    </div>
                ) : (
                    wishlistItems.map(product => (
                        <div key={product.id} className="relative">
                            <ProductCard product={product} /> 
                        </div>
                    ))
                )}
             </div>
          </div>
        );
      case 'Order History':
      default:
        return (
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">My Orders</h3>
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white/5 rounded-2xl border border-white/10 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                             <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">No orders yet</h4>
                        <p className="text-gray-400 mb-8">Time to start shopping!</p>
                        <Button 
                            onClick={() => navigate('/shop')} 
                            className="bg-brandBlue text-white hover:bg-blue-600 px-8"
                        >
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    orders.map(order => (
                    <div key={order.id} className="bg-navy/40 border border-white/5 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <p className="text-white font-bold">{order.id}</p>
                            <p className="text-sm text-gray-400">{order.date}</p>
                        </div>
                        <div className="flex-1 md:text-center">
                            <p className="text-gray-300 text-sm">Total</p>
                            <p className="text-white font-bold">{order.total}</p>
                        </div>
                        <div>
                             <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                 order.status === 'Delivered' ? 'bg-green-500/10 text-green-400' : 
                                 order.status === 'Cancelled' ? 'bg-red-500/10 text-red-400' :
                                 'bg-yellow-500/10 text-yellow-400'
                             }`}>
                                 {order.status}
                             </span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                           {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                                <button
                                    onClick={() => handleCancelClick(order)}
                                    className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors"
                                >
                                    Cancel
                                </button>
                           )}
                            <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-3 py-1.5 rounded-lg border border-white/20 text-white text-sm hover:bg-white/10 transition-colors"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))
               )}
               {/* Shop More Button at Bottom of History */}
                {orders.length > 0 && (
                    <div className="flex justify-center mt-8 pt-4 border-t border-white/5">
                        <Button 
                            onClick={() => navigate('/shop')}
                            className="bg-transparent border border-brandBlue text-brandBlue hover:bg-brandBlue hover:text-white px-8 transition-colors"
                        >
                            Shop More
                        </Button>
                    </div>
                )}
            </div>
        );
    }
  };

  return (
    <AppWrapper>
      <CancelOrderModal 
        isOpen={cancelModalOpen} 
        onClose={() => setCancelModalOpen(false)} 
        onConfirm={handleConfirmCancel} 
      />
      {selectedOrder && (
        <OrderDetailsModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
            onCancel={handleCancelClick}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-white mb-8 font-poppins">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="p-8 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-brandBlue/20 mb-4 shadow-glowBlue">
                {userInfo.avatar ? (
                  <img src={userInfo.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-brandBlue text-white flex items-center justify-center text-4xl font-bold">
                    {userInfo.name.charAt(0)}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-white">{userInfo.name}</h2>
              <p className="text-shop-blue font-medium mb-1">{userInfo.role}</p>
              <p className="text-gray-400 text-sm mb-6">Member since {userInfo.joinDate}</p>
              
              <Button className="w-full mb-3" variant="primary">Edit Profile</Button> 
              <Button onClick={handleLogout} className="w-full !bg-white/5 !text-white hover:!bg-white/10" variant="secondary">Log Out</Button>
            </GlassCard>

            <nav className="flex flex-col gap-2">
               {['Order History', 'Wishlist'].map((item, idx) => ( 
                 <button 
                    key={idx} 
                    onClick={() => setActiveTab(item)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${activeTab === item ? 'bg-brandBlue text-white border-brandBlue' : 'bg-navy/40 border-white/5 text-gray-300 hover:text-white hover:bg-white/5'}`}
                 >
                    {item === 'Order History' && <ShoppingBagIcon className="w-5 h-5" />}
                    {item === 'Wishlist' && <HeartIcon className="w-5 h-5" />}
                    {item}
                 </button>
               ))}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-navy/60 p-6 rounded-2xl border border-white/5">
                    <span className="text-gray-400 text-sm block mb-1">Total Orders</span>
                    <span className="text-2xl font-bold text-white">{orders.length}</span>
                </div>
                <div className="bg-navy/60 p-6 rounded-2xl border border-white/5">
                    <span className="text-gray-400 text-sm block mb-1">Total Spent</span>
                    <span className="text-2xl font-bold text-white">
                        ₹{orders.reduce((acc, order) => {
                                // Ensure total is a string before replacing
                                const totalStr = String(order.total || '0');
                                const amount = parseFloat(totalStr.replace(/[^0-9.-]+/g,""));
                                return acc + (isNaN(amount) ? 0 : amount);
                        }, 0).toLocaleString()}
                    </span>
                </div>
                <div className="bg-navy/60 p-6 rounded-2xl border border-white/5">
                    <span className="text-gray-400 text-sm block mb-1">Points</span>
                    <span className="text-2xl font-bold text-brandBlue text-center">450</span>
                </div>
            </div>

            {/* Dynamic Content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </AppWrapper>
  );
};

export default UserProfile;
