import React, { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import GlassCard from "../../components/common/GlassCard";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function ManageProducts() {
  // Mock data for initial state
  const [products, setProducts] = useState([
    { id: 1, name: "Neon Gaming Headset", price: 12999, stock: 45, category: "Audio", image: "https://pngimg.com/d/headphones_PNG101984.png" },
    { id: 2, name: "Mechanical Keyboard RGB", price: 8499, stock: 12, category: "Peripherals", image: "https://pngimg.com/d/keyboard_PNG101865.png" },
    { id: 3, name: "Wireless Gaming Mouse", price: 4999, stock: 0, category: "Peripherals", image: "https://pngimg.com/d/computer_mouse_PNG7675.png" },
    { id: 4, name: "Ultra-Wide Monitor", price: 35999, stock: 8, category: "Displays", image: "https://pngimg.com/d/monitor_PNG101460.png" },
    { id: 5, name: "Streaming Microphone", price: 7999, stock: 15, category: "Audio", image: "https://pngimg.com/d/microphone_PNG101476.png" },
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
      // API call to delete would go here
    }
  };

  return (
    <div className="flex bg-cyber-dark1 min-h-screen text-white font-inter">
      <div className="fixed inset-y-0 left-0 z-50">
        <AdminSidebar />
      </div>
      
      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-poppins text-cyber-blue">Manage Products</h1>
            <p className="text-gray-400 mt-1">View, edit, or delete store products</p>
          </div>
          <Link to="/admin/add-product">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyber-blue to-blue-600 rounded-lg hover:opacity-90 transition shadow-lg shadow-blue-500/20 font-medium text-white">
                <FiPlus className="text-xl" /> Add New Product
            </button>
          </Link>
        </div>

        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10 uppercase text-xs font-bold text-gray-400">
                <tr>
                  <th className="px-6 py-4 text-left">Product</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-lg p-2 border border-white/10">
                            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                        </div>
                        <span className="font-medium text-gray-200">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">₹{product.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/10">
                            {product.category}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock > 10 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                         {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition">
                            <FiEdit2 />
                        </button>
                        <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition"
                        >
                            <FiTrash2 />
                        </button>
                      </div>
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