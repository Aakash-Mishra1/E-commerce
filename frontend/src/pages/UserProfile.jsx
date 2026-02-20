import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import AppWrapper from '../components/layout/AppWrapper';
import GlassCard from '../components/common/GlassCard';
import ProductCard from '../components/product/ProductCard';
import { 
    ShoppingBagIcon, 
    XMarkIcon, 
    TruckIcon, 
    GiftIcon, 
    SparklesIcon, 
    UserIcon,
    ArrowRightOnRectangleIcon,
    MapPinIcon,
    CreditCardIcon,
    HeartIcon,
    ClockIcon,
    ChevronRightIcon,
    DocumentTextIcon,
    ArrowPathIcon,
    StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useOrders } from '../context/OrderContext';
import { useWishlist } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthenticationContext'; 
import { useToast } from '../context/ToastContext';
import { 
    getUserReviews, 
    getUser,
    addUserAddress, 
    removeUserAddress,
    getProducts,
    createReview,
    redeemPoints // Import redeemPoints
} from '../api';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { products as dummyProducts } from '../data/products';

// --- Sub-Components for Tabs ---

const DashboardTab = ({ user, orders, products, setActiveTab, wishlistCount }) => {
    // Local state for products if parent fails to provide them
    const [localProducts, setLocalProducts] = useState(products || []);
    const [loading, setLoading] = useState(!products || products.length === 0);

    useEffect(() => {
        if (products && products.length > 0) {
            setLocalProducts(products);
            setLoading(false);
        } else {
            // Fallback: fetch products if not provided or empty
            const fetchFallback = async () => {
                try {
                   const res = await getProducts();
                   // If API returns data, use it, otherwise fallback to local dummy data
                   if (res.data && res.data.length > 0) {
                        setLocalProducts(res.data);
                   } else {
                        setLocalProducts(dummyProducts);
                   }
                } catch (e) { 
                    console.error("Failed to fetch products, using fallback", e);
                    setLocalProducts(dummyProducts);
                }
                finally { setLoading(false); }
            };
            fetchFallback();
        }
    }, [products]);

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard 
                    className="p-5 flex items-center justify-between group hover:border-brandBlue/30 transition-all cursor-pointer relative overflow-hidden"
                    onClick={() => setActiveTab('orders')}
                >
                     <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingBagIcon className="w-24 h-24 rotate-12 text-white" />
                     </div>
                     <div>
                        <p className="text-gray-400 text-xs font-bold uppercase mb-1">Total Orders</p>
                        <h3 className="text-3xl font-black text-white">{orders?.length || 0}</h3>
                     </div>
                     <div className="p-3 bg-brandBlue/10 rounded-xl text-brandBlue group-hover:scale-110 transition-transform">
                        <ShoppingBagIcon className="w-8 h-8" />
                     </div>
                </GlassCard>

                <GlassCard 
                    className="p-5 flex items-center justify-between group hover:border-purple-500/30 transition-all cursor-pointer relative overflow-hidden"
                    onClick={() => setActiveTab('wallet')}
                >
                     <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
                        <GiftIcon className="w-24 h-24 rotate-12 text-white" />
                     </div>
                     <div>
                        <p className="text-gray-400 text-xs font-bold uppercase mb-1">Wallet Points</p>
                        <h3 className="text-3xl font-black text-white">{user?.points || 0}</h3>
                     </div>
                     <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
                        <GiftIcon className="w-8 h-8" />
                     </div>
                </GlassCard>

                <GlassCard 
                    className="p-5 flex items-center justify-between group hover:border-pink-500/30 transition-all cursor-pointer relative overflow-hidden"
                    onClick={() => setActiveTab('wishlist')}
                >
                     <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
                        <HeartIcon className="w-24 h-24 rotate-12 text-white" />
                     </div>
                     <div>
                        <p className="text-gray-400 text-xs font-bold uppercase mb-1">Wishlist</p>
                        <h3 className="text-3xl font-black text-white">{wishlistCount} Items</h3>
                     </div>
                     <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400 group-hover:scale-110 transition-transform">
                        <HeartIcon className="w-8 h-8" />
                     </div>
                </GlassCard>
            </div>

            {/* Recent Orders Preview */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 text-brandBlue" /> Recent Activity
                    </h3>
                    <button className="text-xs text-brandBlue hover:text-white transition-colors">View All</button>
                </div>
                
                {orders.length === 0 ? (
                    <div className="text-center py-10 bg-white/5 rounded-2xl border border-dashed border-gray-700">
                        <p className="text-gray-400 text-sm">No recent orders found.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.slice(0, 3).map((order) => (
                             <div key={order.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between hover:bg-white/10 transition-colors">
                                 <div className="flex items-center gap-4 mb-3 md:mb-0 w-full md:w-auto">
                                     <div className="w-10 h-10 rounded-full bg-brandBlue/20 flex items-center justify-center text-brandBlue">
                                         <ShoppingBagIcon className="w-5 h-5" />
                                     </div>
                                     <div>
                                         <p className="font-bold text-sm text-white">Order #{order.id.slice(-8)}</p>
                                         <p className="text-xs text-gray-400">{order.date}</p>
                                     </div>
                                 </div>
                                 <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                     <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                         order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                         'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                     }`}>
                                         {order.status}
                                     </span>
                                     <p className="font-mono font-bold text-white">{order.total}</p>
                                 </div>
                             </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recommended Products */}
             <div className="mt-8">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <SparklesIcon className="w-5 h-5 text-yellow-400" /> Recommended For You
                </h3>
                {loading ? (
                    <Loader text="Finding products for you..." />
                ) : localProducts.length === 0 ? (
                    <div className="text-center py-10 bg-white/5 rounded-2xl border border-dashed border-gray-700">
                        <p className="text-gray-400">No recommendations available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {localProducts.slice(0, 4).map(product => (
                            <div key={product._id || product.id} className="scale-90 origin-top-left transform hover:scale-95 transition-transform duration-300">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const OrdersTab = ({ orders, user }) => {
    const navigate = useNavigate();
    const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);
    const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', productId: '' });
    const { addToast } = useToast();

    // Invoice Generation Handler
    const handleDownloadInvoice = (order) => {
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text("INVOICE", 105, 20, null, null, "center");
        
        doc.setFontSize(12);
        doc.text(`Order ID: ${order.id}`, 20, 40);
        doc.text(`Date: ${order.date}`, 20, 50);
        doc.text(`Status: ${order.status}`, 20, 60);
        
        doc.text("Bill To:", 140, 40);
        doc.setFontSize(10);
        if (order.address) {
            doc.text(`${order.address.fullName || (user?.username || 'User')}`, 140, 45);
            doc.text(`${order.address.street || ''}`, 140, 50);
            doc.text(`${order.address.city || ''}, ${order.address.state || ''}`, 140, 55);
        } else {
            doc.text(user?.username || "Customer", 140, 45);
        }

        const tableColumn = ["Item", "Quantity", "Price", "Total"];
        const tableRows = [];

        order.cartDetails.forEach(item => {
            const itemData = [
                item.name,
                item.quantity,
                parseFloat(item.price).toFixed(2),
                (parseFloat(item.price) * parseFloat(item.quantity)).toFixed(2)
            ];
            tableRows.push(itemData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 70,
        });

        doc.text(`Total Amount: ${order.total}`, 140, doc.lastAutoTable.finalY + 20);
        
        doc.save(`invoice_${order.id.slice(-8)}.pdf`);
        addToast("Invoice Downloaded", "success");
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        if (!user || !user._id) {
            addToast("Please login properly to submit a review.", "error");
            return;
        }

        try {
            console.log("Submitting review:", { ...reviewForm, user: user._id, orderId: selectedOrderForReview.id });
            await createReview({
                ...reviewForm,
                user: user._id, // Use actual user ID
                orderId: selectedOrderForReview.id
            });
            addToast("Review Submitted Successfully!", "success");
            setSelectedOrderForReview(null);
            setReviewForm({ rating: 5, comment: '', productId: '' });
        } catch (error) {
            console.error("Review submission failed:", error);
            const errorMessage = error.response?.data?.message || "Failed to submit review. Try again.";
            addToast(errorMessage, "error");
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-4">My Orders</h2>
             {orders.length === 0 ? (
                 <div className="text-center py-20">
                     <ShoppingBagIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                     <h3 className="text-gray-400 mb-6">No orders placed yet.</h3>
                     <Button onClick={() => navigate('/shop')} size="lg" className="mx-auto">
                        Start Shopping
                     </Button>
                 </div>
             ) : (
                <div className="space-y-8">
                    <div className="space-y-4">
                    {orders.map((order) => (
                        <GlassCard key={order.id} className="p-0 overflow-hidden group hover:border-brandBlue/30 transition-all">
                            {/* Order Header */}
                            <div className="p-4 bg-white/5 border-b border-white/5 flex flex-wrap justify-between items-center gap-4">
                                <div className="flex gap-4">
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-500 font-bold">Order Placed</p>
                                        <p className="text-xs text-white bg-white/5 px-2 py-1 rounded mt-1">{order.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-500 font-bold">Total</p>
                                        <p className="text-xs text-white font-mono mt-1">{order.total}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-500 font-bold">Ship To</p>
                                        <p className="text-xs text-brandBlue mt-1 cursor-pointer hover:underline">
                                            {order.address ? order.address.fullName : "User"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="text-xs text-gray-400 mb-1">Order # {order.id.slice(-8)}</p>
                                    <div className="flex gap-2">
                                        <button 
                                            className="text-xs flex items-center gap-1 text-gray-300 hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-lg border border-white/5" 
                                            onClick={() => handleDownloadInvoice(order)}
                                        >
                                            <DocumentTextIcon className="w-3 h-3" /> Invoice
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Order Body */}
                            <div className="p-6 flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <h4 className={`text-lg font-bold ${order.status === 'Delivered' ? 'text-green-400' : 'text-brandBlue'}`}>
                                        {order.status}
                                    </h4>
                                    
                                    {/* Tracking Steps Visual - Simplified */}
                                    <div className="flex items-center w-full max-w-md my-4">
                                        <div className={`w-3 h-3 rounded-full ${order.status ? 'bg-brandBlue' : 'bg-gray-600'}`}></div>
                                        <div className={`h-1 flex-1 ${['Shipped', 'Delivered'].includes(order.status) ? 'bg-brandBlue' : 'bg-gray-700'}`}></div>
                                        <div className={`w-3 h-3 rounded-full ${['Shipped', 'Delivered'].includes(order.status) ? 'bg-brandBlue' : 'bg-gray-600'}`}></div>
                                        <div className={`h-1 flex-1 ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                                        <div className={`w-3 h-3 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                                    </div>
                                    <div className="flex justify-between w-full max-w-md text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                                        <span>Confirmed</span>
                                        <span>Shipped</span>
                                        <span>Delivered</span>
                                    </div>

                                    <div className="space-y-3 mt-4">
                                        {order.cartDetails?.map((item, idx) => (
                                            <div 
                                                key={idx} 
                                                className="flex gap-4 items-center bg-white/5 p-2 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group/item"
                                                onClick={() => navigate(`/product/${item.productId || item._id || item.id}`)}
                                            >
                                                <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 group-hover/item:border-brandBlue/50 transition-colors">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-white font-medium group-hover/item:text-brandBlue transition-colors">{item.name}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Actions Column */}
                                <div className="w-full md:w-48 flex flex-col gap-2 justify-center">
                                    <button 
                                        onClick={() => setSelectedOrderForTracking(order)}
                                        className="w-full py-2 bg-brandBlue text-white text-sm font-bold rounded-lg hover:bg-brandBlue/90 transition shadow-lg shadow-brandBlue/20"
                                    >
                                        Track Package
                                    </button>
                                    {order.status === 'Delivered' && (
                                        <button className="w-full py-2 bg-white/5 text-gray-300 text-sm font-medium rounded-lg hover:bg-white/10 transition border border-white/10 flex items-center justify-center gap-2">
                                            <ArrowPathIcon className="w-4 h-4" /> Return Item
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => {
                                            setSelectedOrderForReview(order);
                                            // Handle multi-item orders: For now defaulting to first item, but prioritizing productId
                                            if (order.cartDetails?.[0]) {
                                                const item = order.cartDetails[0];
                                                // Priority: item.productId (from DB), item.id (from context/local), item._id (last resort if it happens to be product)
                                                // We must NOT use item._id if it's a subdocument ID. 
                                                // Assuming backend populates structured data.
                                                const pId = item.productId || item.id || item._id; 
                                                setReviewForm(prev => ({ ...prev, productId: pId }));
                                            }
                                        }}
                                        className="w-full py-2 bg-white/5 text-gray-300 text-sm font-medium rounded-lg hover:bg-white/10 transition border border-white/10"
                                    >
                                        Write a Product Review
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                    </div>

                    <div className="flex justify-center pt-6 border-t border-white/10">
                        <Button onClick={() => navigate('/shop')} size="lg" className="flex items-center gap-2">
                            <ShoppingBagIcon className="w-5 h-5" /> Continue Shopping
                        </Button>
                    </div>
                </div>
             )}

            {/* Tracking Modal */}
            {selectedOrderForTracking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrderForTracking(null)}>
                    <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 max-w-lg w-full relative shadow-2xl" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedOrderForTracking(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <TruckIcon className="w-6 h-6 text-brandBlue" /> Track Order #{selectedOrderForTracking.id.slice(-8)}
                        </h3>
                        
                        <div className="space-y-6 relative pl-4 border-l-2 border-dashed border-gray-700 ml-2">
                             {/* Confirmed - Always done if order exists */}
                             <div className="relative pl-8">
                                <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-[#1e1e1e]"></div>
                                <h4 className="text-white font-bold">Order Placed</h4>
                                <p className="text-xs text-gray-400">{selectedOrderForTracking.date}</p>
                                <p className="text-sm text-gray-300 mt-1">Your order has been received and confirmed.</p>
                             </div>

                             {/* Processing/Shipped Status Logic */}
                             <div className="relative pl-8">
                                <div className={`absolute -left-[21px] top-0 w-4 h-4 rounded-full border-2 border-[#1e1e1e] ${['Processing', 'Shipped', 'Delivered'].includes(selectedOrderForTracking.status) ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                                <h4 className={`${['Processing', 'Shipped', 'Delivered'].includes(selectedOrderForTracking.status) ? 'text-white' : 'text-gray-500'} font-bold`}>Processing</h4>
                                <p className="text-sm text-gray-400 mt-1">We are preparing your items for shipment.</p>
                             </div>

                             <div className="relative pl-8">
                                <div className={`absolute -left-[21px] top-0 w-4 h-4 rounded-full border-2 border-[#1e1e1e] ${['Shipped', 'Delivered'].includes(selectedOrderForTracking.status) ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                                <h4 className={`${['Shipped', 'Delivered'].includes(selectedOrderForTracking.status) ? 'text-white' : 'text-gray-500'} font-bold`}>Shipped</h4>
                                <p className="text-sm text-gray-400 mt-1">Your package is on the way.</p>
                             </div>

                             <div className="relative pl-8">
                                <div className={`absolute -left-[21px] top-0 w-4 h-4 rounded-full border-2 border-[#1e1e1e] ${selectedOrderForTracking.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                                <h4 className={`${selectedOrderForTracking.status === 'Delivered' ? 'text-white' : 'text-gray-500'} font-bold`}>Delivered</h4>
                                <p className="text-sm text-gray-400 mt-1">Package delivered successfully.</p>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {selectedOrderForReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrderForReview(null)}>
                    <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 max-w-md w-full relative shadow-2xl" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedOrderForReview(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                        <h3 className="text-xl font-bold text-white mb-6">Write a Review</h3>
                        
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star} 
                                            type="button"
                                            onClick={() => setReviewForm({...reviewForm, rating: star})}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            {star <= reviewForm.rating ? (
                                                <StarIconSolid className="w-8 h-8 text-yellow-400" />
                                            ) : (
                                                <StarIcon className="w-8 h-8 text-gray-600" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Comment</label>
                                <textarea 
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brandBlue/50 min-h-[100px]"
                                    placeholder="Share your experience..."
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                                    required
                                ></textarea>
                            </div>

                            <Button type="submit" className="w-full">Submit Review</Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const AddressTab = ({ user, handleAddAddress, handleRemoveAddress, isAddingAddress }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullName: "", street: "", city: "", state: "", zipCode: "", country: "India", phone: "", isDefault: false
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await handleAddAddress(newAddress);
        setLoading(false);
        setIsModalOpen(false);
        setNewAddress({ fullName: "", street: "", city: "", state: "", zipCode: "", country: "India", phone: "", isDefault: false });
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Saved Addresses</h2>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-brandBlue text-white text-sm font-bold rounded-lg hover:bg-brandBlue/90 transition shadow-lg shadow-brandBlue/20"
                >
                    + Add New Address
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user?.addresses?.length > 0 ? (
                    user.addresses.map((addr) => (
                        <div key={addr._id} className={`bg-white/5 border ${addr.isDefault ? 'border-brandBlue/50 shadow-lg shadow-brandBlue/5' : 'border-white/5'} rounded-xl p-6 relative group hover:bg-white/10 transition-colors`}>
                             {addr.isDefault && (
                                <div className="absolute top-4 right-4 bg-brandBlue text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Default</div>
                             )}
                             <div className="flex items-center gap-3 mb-4">
                                 <div className={`p-2 rounded-lg ${addr.isDefault ? 'bg-brandBlue/20 text-brandBlue' : 'bg-gray-700/50 text-gray-400'}`}>
                                     <MapPinIcon className="w-5 h-5" />
                                 </div>
                                 <h3 className="font-bold text-white text-lg">{addr.city || 'Home'}</h3>
                             </div>
                             <p className="text-gray-300 text-sm leading-relaxed mb-6 pl-1">
                                 {addr.fullName} <br />
                                 {addr.street} <br />
                                 {addr.city}, {addr.state} - {addr.zipCode} <br />
                                 Phone: {addr.phone}
                             </p>
                             <div className="flex gap-3 mt-auto pt-4 border-t border-white/10">
                                 <button className="text-xs text-brandBlue font-bold hover:underline uppercase tracking-wider">Edit</button>
                                 <button 
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to delete this address?")) {
                                            handleRemoveAddress(addr._id);
                                        }
                                    }}
                                    className="text-xs text-red-400 font-bold hover:underline uppercase tracking-wider ml-4"
                                 >
                                     Remove
                                 </button>
                             </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 bg-white/5 rounded-2xl border border-dashed border-gray-700">
                        <MapPinIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-gray-400">No addresses saved yet.</h3>
                    </div>
                )}
            </div>

            {/* Add Address Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0f172a] border border-gray-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative overflow-hidden"
                        >
                            <h3 className="text-xl font-bold text-white mb-6">Add New Address</h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <InputField label="Full Name" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} required />
                                </div>
                                <div className="col-span-2">
                                    <InputField label="Street Address" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} required />
                                </div>
                                <InputField label="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} required />
                                <InputField label="State" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} required />
                                <InputField label="Zip Code" value={newAddress.zipCode} onChange={e => setNewAddress({...newAddress, zipCode: e.target.value})} required />
                                <InputField label="Phone Number" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} required />
                                
                                <div className="col-span-2 flex items-center gap-2 mt-2">
                                    <input 
                                        type="checkbox" 
                                        checked={newAddress.isDefault} 
                                        onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})}
                                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-brandBlue focus:ring-brandBlue"
                                    />
                                    <span className="text-gray-300 text-sm">Set as default address</span>
                                </div>

                                <div className="col-span-2 mt-4 flex justify-end gap-3">
                                    <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={isAddingAddress || loading}>{loading ? "Saving..." : "Save Address"}</Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const WalletTab = ({ user, updateLocalUser, orders }) => {
    const [isCelebrating, setIsCelebrating] = useState(false);
    const [couponCode, setCouponCode] = useState(null);
    const { addToast } = useToast();

    // Combine coupons (redeemed) and orders (earned) into one history list
    const transactionHistory = [
        ...(user?.coupons ? user.coupons.map(c => ({
            type: 'redeemed',
            title: "Redeemed for Coupon",
            date: c.createdAt || new Date().toISOString(),
            amount: 500, // Assuming fixed cost for now
            id: c._id || c.code
        })) : []),
        ...(orders ? orders.map(o => ({
            type: 'earned',
            title: `Earned from Order #${o.id.slice(-8)}`,
            date: o.date || new Date().toISOString(),
            amount: 1000, // Assuming fixed earnings per order as per controller
            id: o.id
        })) : [])
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const handleRedeem = async () => {
        if (user.points < 500) {
            addToast("Insufficient Points! You need at least 500 points.", "error");
            return;
        }

        try {
            const res = await redeemPoints(user._id, { pointsToRedeem: 500, discountAmount: 50 });
            updateLocalUser(res.data);
            setCouponCode(res.data.coupons[res.data.coupons.length - 1].code);
            setIsCelebrating(true);
            setTimeout(() => setIsCelebrating(false), 5000); // Stop confetti after 5s
        } catch (err) {
            console.error(err);
            addToast(err.response?.data?.message || "Redemption failed", "error");
        }
    };

    return (
    <div className="space-y-6 animate-fade-in-up relative">
         {/* Confetti Overlay */}
         {isCelebrating && (
             <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
                 {[...Array(50)].map((_, i) => (
                     <div 
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-confetti"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `-10px`,
                            backgroundColor: ['#FFD700', '#FF69B4', '#00BFFF', '#32CD32'][Math.floor(Math.random() * 4)],
                            animationDuration: `${Math.random() * 3 + 2}s`,
                            animationDelay: `${Math.random() * 2}s`
                        }} 
                     />
                 ))}
                 <div className="bg-black/80 backdrop-blur-md p-8 rounded-2xl border border-brandBlue/50 text-center animate-bounce-in shadow-2xl relative z-10 pointer-events-auto">
                     <SparklesIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-spin-slow" />
                     <h2 className="text-3xl font-black text-white mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">CONGRATULATIONS!</h2>
                     <p className="text-gray-300 mb-6 font-medium">You've unlocked a new reward!</p>
                     <div className="bg-white/10 p-4 rounded-xl border border-dashed border-brandBlue/50 mb-6">
                         <p className="text-xs uppercase text-gray-500 font-bold mb-1">Your Coupon Code</p>
                         <p className="text-2xl font-mono font-bold text-brandBlue tracking-widest">{couponCode}</p>
                     </div>
                     <button onClick={() => setIsCelebrating(false)} className="bg-brandBlue text-white px-8 py-2 rounded-lg font-bold hover:bg-brandBlue/80 transition">Awesome!</button>
                 </div>
             </div>
         )}

         <style>{`
            @keyframes confetti {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
         `}</style>
         
         <div className="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-2xl p-8 relative overflow-hidden shadow-2xl group">
             <div className="absolute -right-10 -top-10 p-8 opacity-20 transform rotate-12 group-hover:rotate-45 transition-transform duration-700">
                 <GiftIcon className="w-64 h-64 text-white" />
             </div>
             <div className="relative z-10">
                 <p className="text-purple-200 font-bold uppercase tracking-widest text-sm mb-2">Available Balance</p>
                 <h2 className="text-6xl font-black text-white mb-4 tracking-tight drop-shadow-md">{user?.points || 0} <span className="text-2xl font-medium opacity-70">Points</span></h2>
                 <p className="text-white/80 max-w-md text-sm leading-relaxed">Use your points to redeem exclusive coupons and discounts on your next purchase. 500 Points = ₹50.</p>
                 <button 
                    onClick={handleRedeem}
                    disabled={user?.points < 500}
                    className={`mt-8 px-8 py-3 font-bold rounded-xl transition shadow-lg transform duration-300 ${user?.points >= 500 ? 'bg-white text-purple-900 hover:bg-gray-100 hover:shadow-xl hover:-translate-y-1 cursor-pointer' : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'}`}
                 >
                     {user?.points >= 500 ? 'Redeem 500 Points' : 'Need 500 Points to Redeem'}
                 </button>
             </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
             <div>
                 <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                     <ClockIcon className="w-5 h-5 text-gray-400" /> Transaction History
                 </h3>
                 <div className="bg-white/5 rounded-xl overflow-hidden border border-white/5 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {transactionHistory.length > 0 ? (
                        transactionHistory.map((item, i) => (
                             <div key={i} className="p-4 border-b border-white/5 last:border-0 flex justify-between items-center hover:bg-white/5 transition-colors cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'redeemed' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                        {item.type === 'redeemed' ? <ArrowRightOnRectangleIcon className="w-5 h-5 rotate-180" /> : <GiftIcon className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm">{item.title}</p>
                                        <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`font-mono font-bold ${item.type === 'redeemed' ? 'text-red-400' : 'text-green-400'}`}>
                                    {item.type === 'redeemed' ? '-' : '+'} {item.amount}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500 text-sm">No transactions yet.</div>
                    )}
                 </div>
             </div>
             
             <div>
                 <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                     <SparklesIcon className="w-5 h-5 text-yellow-400" /> Active Rewards
                 </h3>
                 <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                     {user?.coupons && user.coupons.filter(c => !c.isUsed && new Date(c.expiryDate) > new Date()).length > 0 ? (
                         user.coupons.filter(c => !c.isUsed && new Date(c.expiryDate) > new Date()).map((coupon, i) => (
                             <div key={i} className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 p-4 rounded-xl flex items-center justify-between group hover:border-yellow-500/50 transition-all">
                                 <div className="flex items-center gap-3">
                                     <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500">
                                         <DocumentTextIcon className="w-6 h-6" />
                                     </div>
                                     <div>
                                         <p className="font-bold text-white text-sm">FLAT ₹{coupon.discount} OFF</p>
                                         <p className="text-[10px] text-gray-400">Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
                                     </div>
                                 </div>
                                 <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(coupon.code);
                                        addToast("Code copied!", "success");
                                    }}
                                    className="text-xs font-bold bg-yellow-500 text-black px-3 py-1.5 rounded-lg hover:bg-yellow-400 transition"
                                >
                                     {coupon.code}
                                 </button>
                             </div>
                         ))
                     ) : (
                         <div className="bg-white/5 border border-dashed border-gray-700 p-8 rounded-xl text-center">
                             <p className="text-gray-400 text-sm">No active rewards. Redeem points to get coupons!</p>
                         </div>
                     )}
                 </div>
             </div>
         </div>
    </div>
    );
};

const ReviewsTab = ({ userId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let activeId = userId;
        const fetch = async () => {
            if(!activeId) {
                // If userId is missing, try to get from localStorage (fallback for demo)
                const storedUser = JSON.parse(localStorage.getItem('currentUser'));
                if (storedUser && storedUser._id) {
                    activeId = storedUser._id;
                } else {
                    setLoading(false);
                    return;
                }
            }
            
            try {
                const res = await getUserReviews(activeId);
                setReviews(res.data);
            } catch(e) { 
                console.error("Failed to fetch reviews:", e);
            } finally { 
                setLoading(false); 
            }
        };
        fetch();
    }, [userId]);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                 <StarIcon className="w-6 h-6 text-yellow-500" /> My Reviews
            </h2>

            {loading ? <div className="p-8"><Loader text="Loading..." /></div> : reviews.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-gray-700">
                    <StarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-gray-400">You haven't written any reviews yet.</h3>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <GlassCard key={review._id} className="p-6 transition-all hover:border-brandBlue/30 group">
                            <div className="flex gap-4 items-start">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10 flex-shrink-0 border border-white/10">
                                    <img src={review.product?.image || ""} alt={review.product?.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-white text-lg group-hover:text-brandBlue transition-colors">{review.product?.name || "Product Deleted"}</h3>
                                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <StarIconSolid key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} />
                                        ))}
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed italic">"{review.comment}"</p>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Main UserProfile Component ---

export default function UserProfile() {
  const { orders } = useOrders(); 
  const { user, logout, updateLocalUser } = useContext(AuthContext); 
  const { wishlistItems = [] } = useWishlist(); 
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  
  // Handler helpers...
  const handleAddAddress = async (newAddress) => {
    if (!user?._id) return;
    setIsAddingAddress(true);
    try {
        const res = await addUserAddress(user._id, newAddress);
        // Ensure we have fresh data
        const freshUser = await getUser(user._id);
        updateLocalUser(freshUser.data); 
        toast.success("Address added successfully!");
    } catch (error) {
        console.error("Failed to add address:", error);
        toast.error(error.response?.data?.message || "Failed to add address.");
    } finally {
        setIsAddingAddress(false);
    }
  };

  const handleRemoveAddress = async (addressId) => {
    if (!user?._id) return;
    try {
        await removeUserAddress(user._id, addressId);
        const freshUser = await getUser(user._id);
        updateLocalUser(freshUser.data);
        toast.success("Address removed successfully!");
    } catch (error) {
        console.error("Failed to remove address:", error);
        toast.error(error.response?.data?.message || "Failed to remove address.");
    }
  };

  const [products, setProducts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Get products for recommendation logic
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleTabChange = (tabId) => {
      if (activeTab === tabId) return;
      setIsLoading(true);
      setActiveTab(tabId);
      setTimeout(() => setIsLoading(false), 500);
  };

  const menuItems = [
      { id: 'dashboard', label: 'Overview', icon: UserIcon },
      { id: 'orders', label: 'My Orders', icon: ShoppingBagIcon },
      { id: 'addresses', label: 'Address Book', icon: MapPinIcon },
      { id: 'wallet', label: 'Wallet & Rewards', icon: GiftIcon },
      { id: 'wishlist', label: 'My Wishlist', icon: HeartIcon },
  ];

  return (
    <AppWrapper>
      <div className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen font-sans text-white">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 animate-fade-in-up">
            <div className="flex items-center gap-4">
                 <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brandBlue to-purple-600 p-[2px] shadow-lg shadow-brandBlue/20">
                    <div className="w-full h-full rounded-full bg-[#121212] flex items-center justify-center text-3xl font-bold text-white uppercase transform hover:scale-105 transition-transform duration-300">
                        {user?.username ? user.username.charAt(0) : "U"}
                    </div>
                 </div>
                 <div>
                     <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Welcome back,</p>
                     <h1 className="text-4xl font-black text-white tracking-tight">{user?.username || "Guest User"}</h1>
                     <p className="text-xs text-brandBlue font-bold mt-1 bg-brandBlue/10 inline-block px-2 py-0.5 rounded border border-brandBlue/20">ELITE MEMBER</p>
                 </div>
            </div>
            
             <button 
                onClick={() => {
                    logout();
                    toast.success("Successfully Signed Out");
                    navigate('/login');
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all font-bold text-sm shadow-lg shadow-red-500/5 hover:shadow-red-500/20"
             >
                 <ArrowRightOnRectangleIcon className="w-5 h-5" />
                 Sign Out
             </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-1/4 animate-fade-in-up delay-[100ms]">
                <GlassCard className="p-3 space-y-1 sticky top-28 border border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl">
                    <p className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Account Menu</p>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 group ${
                                activeTab === item.id 
                                ? 'bg-gradient-to-r from-brandBlue to-blue-600 text-white shadow-lg shadow-brandBlue/20 scale-100' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white hover:pl-4'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-white transition-colors'}`} />
                                <span className="font-bold text-sm">{item.label}</span>
                            </div>
                            {activeTab === item.id && <ChevronRightIcon className="w-4 h-4" />}
                        </button>
                    ))}
                     
                     <div className="h-px bg-white/10 my-4 mx-2"></div>
                     <p className="px-4 py-1 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Settings</p>
                     
                     <button 
                        onClick={() => handleTabChange('reviews')}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm group ${
                            activeTab === 'reviews' 
                            ? 'bg-gradient-to-r from-brandBlue to-blue-600 text-white shadow-lg shadow-brandBlue/20 scale-100' 
                            : 'text-gray-400 hover:bg-white/5 hover:text-white hover:pl-4'
                        }`}
                     >
                         <StarIcon className={`w-5 h-5 ${activeTab === 'reviews' ? 'text-white' : 'text-gray-500 group-hover:text-yellow-400'}`} /> 
                         <span className="font-bold">My Reviews</span>
                     </button>
                </GlassCard>
            </div>

            {/* Main Content Area */}
            <div className="w-full lg:w-3/4 min-h-[500px] animate-fade-in-up delay-[200ms]">
                <AnimatePresence mode="wait">
                    {isLoading || initialLoading ? (
                        <motion.div 
                            key="loader"
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="w-full bg-white/5 rounded-3xl border border-white/5 min-h-[400px] flex items-center justify-center backdrop-blur-md"
                        >
                            <Loader text="Gathering your profile data..." />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'dashboard' && <DashboardTab user={user} orders={orders} products={products} wishlistCount={wishlistItems.length} setActiveTab={handleTabChange} />}
                            {activeTab === 'orders' && <OrdersTab orders={orders} user={user} />}
                            {activeTab === 'addresses' && <AddressTab user={user} handleAddAddress={handleAddAddress} handleRemoveAddress={handleRemoveAddress} isAddingAddress={isAddingAddress} />}
                            {activeTab === 'wallet' && <WalletTab user={user} updateLocalUser={updateLocalUser} />}
                            {activeTab === 'reviews' && <ReviewsTab userId={user?._id} />}
                            {activeTab === 'wishlist' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                                        <h2 className="text-2xl font-bold flex items-center gap-2">
                                            <HeartIcon className="w-6 h-6 text-pink-500" /> My Wishlist
                                        </h2> 
                                        <span className="text-sm text-gray-400">{wishlistItems.length} Items saved</span>
                                    </div>
                                    
                                    {wishlistItems.length === 0 ? (
                                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-gray-700">
                                            <HeartIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                            <h3 className="text-gray-400 mb-6">Your wishlist is empty.</h3>
                                            <Button onClick={() => navigate('/shop')} size="lg" className="mx-auto">
                                                Explore Products
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {wishlistItems.map(product => (
                                                <motion.div 
                                                    key={product._id || product.id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <ProductCard product={product} />
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </AppWrapper>
  );
}
