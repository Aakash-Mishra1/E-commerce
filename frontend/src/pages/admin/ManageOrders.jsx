import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import GlassCard from "../../components/common/GlassCard";
import { FiEye, FiCheckCircle, FiClock, FiTruck, FiXCircle } from "react-icons/fi";
import { getAllOrders, updateOrder } from "../../api";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
        try {
            const res = await getAllOrders();
            // Transform backend data to match UI structure
            if (res.data && Array.isArray(res.data)) {
                const formattedOrders = res.data.map(order => ({
                    id: order._id,
                    customer: order.userId, // Displaying ID for now as backend doesn't populate name
                    date: new Date(order.createdAt).toLocaleDateString(),
                    amount: order.amount,
                    status: order.status, 
                    items: order.products.length
                }));
                // Sort by latest
                setOrders(formattedOrders.reverse());
            }
        } catch (err) {
            console.error("Error fetching orders - using mock data:", err);
            // Mock data fallback
            setOrders([
                { id: "MOCK-101", customer: "Demo Admin", date: new Date().toLocaleDateString(), amount: 15000, status: "Processing", items: 2 },
                { id: "MOCK-102", customer: "Jane Doe", date: new Date().toLocaleDateString(), amount: 4500, status: "Order Confirmed", items: 1 },
                { id: "MOCK-103", customer: "John Smith", date: new Date().toLocaleDateString(), amount: 2500, status: "Delivered", items: 5 }
            ]);
        }
    };

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000); // Poll for real-time updates

    return () => clearInterval(intervalId);
  }, []);

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "delivered": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "shipped": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "processing": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "pending": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "cancelled": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-white/10";
    }
  };

  const updateStatus = async (id) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    // Use Capitalized statuses to match UserProfile expectations
    const statuses = ["Order Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

    // Find current index based on text (case-insensitive check for safety)
    const currentStatusTerm = order.status; 
    let currentIndex = statuses.findIndex(s => s.toLowerCase() === currentStatusTerm.toLowerCase());
    
    // If unknown status, start from beginning
    if (currentIndex === -1) currentIndex = 0;

    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    try {
        await updateOrder(id, { status: nextStatus });
        // Optimistic update
        setOrders(orders.map(o => 
            o.id === id ? { ...o, status: nextStatus } : o
        ));
    } catch (err) {
        console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="flex bg-cyber-dark1 min-h-screen text-white font-inter">
      <div className="fixed inset-y-0 left-0 z-50">
        <AdminSidebar />
      </div>
      
      <main className="flex-1 ml-64 p-8 relative">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-poppins text-cyber-blue">Manage Orders</h1>
            <p className="text-gray-400 mt-1">Track and update customer order status</p>
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Search orders..." className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-cyber-blue outline-none" />
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
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 font-mono text-gray-300">{order.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-400">{order.date}</td>
                    <td className="px-6 py-4 font-semibold text-white">₹{order.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                        <button 
                            onClick={() => updateStatus(order.id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 cursor-pointer hover:opacity-80 ${getStatusColor(order.status)}`}
                        >
                            {order.status === "Processing" && <FiClock />}
                            {order.status === "Shipped" && <FiTruck />}
                            {order.status === "Delivered" && <FiCheckCircle />}
                            {order.status === "Cancelled" && <FiXCircle />}
                            {order.status}
                        </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="flex items-center gap-1 ml-auto text-sm text-cyber-blue hover:text-white transition">
                          <FiEye /> Details
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}