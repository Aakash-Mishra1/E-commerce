import React, { useState } from "react";
import { useAppData } from "../../context/AppDataContext";
import AdminSidebar from "../../components/AdminSidebar";
import GlassCard from "../../components/common/GlassCard";
import { FiEye, FiCheckCircle, FiClock, FiTruck, FiXCircle, FiMenu } from "react-icons/fi";
import { updateOrder } from "../../api";

export default function ManageOrders() {
  const { orders, refetch } = useAppData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getStatusColor = (status) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "delivered": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "shipped": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "processing": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "pending": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "cancelled": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-white/10";
    }
  };

  const updateStatus = async (id, currentStatus) => {
    // Standard status flow matching UserProfile
    const statuses = ["Order Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
    
    // Find current index based on text (case-insensitive check)
    let currentIndex = statuses.findIndex(s => s.toLowerCase() === (currentStatus || "").toLowerCase());
    
    // If unknown status, start from beginning
    if (currentIndex === -1) currentIndex = 0;

    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    try {
        await updateOrder(id, { status: nextStatus });
        await refetch(); // Refresh global data immediately
    } catch (err) {
        console.error("Failed to update status:", err);
        alert("Failed to update order status");
    }
  };

  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="flex bg-cyber-dark1 min-h-screen text-white font-inter relative">
       <div className="md:hidden fixed top-4 left-4 z-40">
        <button onClick={() => setSidebarOpen(true)} className="p-2 bg-cyber-dark2 rounded-lg text-white shadow-lg border border-white/10">
            <FiMenu size={24} />
        </button>
      </div>

      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 relative transition-all duration-300 pt-16 md:pt-8 w-full max-w-full overflow-x-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-poppins text-cyber-blue">Manage Orders</h1>
            <p className="text-gray-400 mt-1">Track and update customer order status</p>
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Search orders..." className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-cyber-blue outline-none text-white" />
          </div>
        </div>

        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10 uppercase text-xs font-bold text-gray-400">
                <tr>
                  <th className="px-6 py-4 text-left">Order ID</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Total</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {orders.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                            No orders found.
                        </td>
                    </tr>
                ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 font-mono text-gray-300">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 font-medium text-white">{order.customer || "User"}</td>
                    <td className="px-6 py-4 text-gray-400">{order.date}</td>
                    <td className="px-6 py-4 font-semibold text-white">₹{order.amount ? order.amount.toLocaleString() : "0"}</td>
                    <td className="px-6 py-4">
                        <button 
                            onClick={() => updateStatus(order.id, order.status)}
                            className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 cursor-pointer hover:opacity-80 transition active:scale-95 ${getStatusColor(order.status)}`}
                            title="Click to cycle status"
                        >
                            {order.status === "Processing" && <FiClock />}
                            {order.status === "Shipped" && <FiTruck />}
                            {order.status === "Delivered" && <FiCheckCircle />}
                            {(order.status === "Cancelled" || order.status === "Order Confirmed") && <FiEye />} 
                            {order.status}
                        </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1 ml-auto text-sm text-cyber-blue hover:text-white transition"
                       >
                          <FiEye /> Details
                       </button>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Order Details Modal */}
        {selectedOrder && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
                 <GlassCard className="w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                     <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                         <div>
                             <h2 className="text-xl font-bold text-white">Order Details #{selectedOrder.id.slice(-6).toUpperCase()}</h2>
                             <p className="text-sm text-gray-400 mt-1">Placed on {selectedOrder.date}</p>
                         </div>
                         <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white">
                             <FiXCircle size={24} />
                         </button>
                     </div>
                     
                     <div className="space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white/5 p-4 rounded-lg">
                                 <h3 className="text-xs uppercase text-gray-500 font-bold mb-2">Customer Info</h3>
                                 <p className="text-white font-medium">{selectedOrder.customer}</p>
                             </div>
                             <div className="bg-white/5 p-4 rounded-lg">
                                 <h3 className="text-xs uppercase text-gray-500 font-bold mb-2">Shipping Address</h3>
                                 <p className="text-gray-300 text-sm whitespace-pre-line">
                                     {selectedOrder.address ? 
                                        ((typeof selectedOrder.address === 'string' ? selectedOrder.address : 
                                            `${selectedOrder.address.street || ''}\n${selectedOrder.address.city || ''}, ${selectedOrder.address.state || ''}`
                                        )) 
                                        : "N/A"}
                                 </p>
                             </div>
                         </div>

                         <div>
                             <h3 className="text-sm font-bold text-white mb-3">Ordered Items ({selectedOrder.products?.length || 0})</h3>
                             <div className="bg-white/5 rounded-lg border border-white/5 overflow-hidden">
                                 <table className="w-full text-sm text-left">
                                     <thead className="bg-white/5 text-gray-400">
                                         <tr>
                                             <th className="p-3">Product</th>
                                             <th className="p-3">Price</th>
                                             <th className="p-3">Qty</th>
                                             <th className="p-3 text-right">Total</th>
                                         </tr>
                                     </thead>
                                     <tbody className="divide-y divide-white/5">
                                         {selectedOrder.products?.map((item, idx) => (
                                             <tr key={idx}>
                                                 <td className="p-3">
                                                     <div className="flex items-center gap-3">
                                                         {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded-md object-cover bg-white/10" />}
                                                         <span className="text-gray-300 font-medium">{item.productId?.name || item.name || "Unknown Product"}</span>
                                                     </div>
                                                 </td>
                                                 <td className="p-3 text-gray-400">₹{item.price}</td>
                                                 <td className="p-3 text-gray-400">x{item.quantity}</td>
                                                 <td className="p-3 text-right font-bold text-white">₹{(item.price * item.quantity).toLocaleString()}</td>
                                             </tr>
                                         ))}
                                     </tbody>
                                 </table>
                             </div>
                         </div>
                         
                         <div className="flex justify-end pt-4 border-t border-white/10">
                             <div className="text-right">
                                 <p className="text-gray-400 text-sm">Total Amount</p>
                                 <p className="text-2xl font-bold text-cyber-blue">₹{selectedOrder.amount?.toLocaleString()}</p>
                             </div>
                         </div>
                     </div>
                 </GlassCard>
             </div>
        )}
      </main>
    </div>
  );
}
