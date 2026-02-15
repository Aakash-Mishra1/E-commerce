import React, { useState } from "react";
// import { API } from "../../api"; // Keeping API for future use
import AdminSidebar from "../../components/AdminSidebar";
import GlassCard from "../../components/common/GlassCard";
import { FiUploadCloud, FiSave } from "react-icons/fi";

export default function AddProduct() {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: ""
  });

  const saveProduct = () => {
    // Mock save
    alert("Product Added Successfully!");
    setProduct({ title: "", description: "", price: "", category: "", stock: "", image: "" });
  };

  const handleChange = (e) => {
      setProduct({ ...product, [e.target.name]: e.target.value });
  }

  return (
    <div className="flex bg-cyber-dark1 min-h-screen text-white font-inter">
      <div className="fixed inset-y-0 left-0 z-50">
        <AdminSidebar />
      </div>
      
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-poppins text-cyber-blue">Add New Product</h1>
            <p className="text-gray-400 mt-1">Create a new item for the inventory</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <GlassCard className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Product Name</label>
                        <input name="title" value={product.title} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-blue outline-none transition" placeholder="e.g. Neon Gaming Headset" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                        <textarea name="description" value={product.description} onChange={handleChange} rows="4" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-blue outline-none transition" placeholder="Product details..." />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Price (₹)</label>
                            <input name="price" type="number" value={product.price} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-blue outline-none transition" placeholder="0.00" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Stock Quantity</label>
                            <input name="stock" type="number" value={product.stock} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-blue outline-none transition" placeholder="0" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                        <select name="category" value={product.category} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-blue outline-none transition">
                            <option value="">Select Category</option>
                            <option value="Audio">Audio</option>
                            <option value="Peripherals">Peripherals</option>
                            <option value="Displays">Displays</option>
                        </select>
                    </div>
                </GlassCard>
            </div>

            <div className="space-y-6">
                <GlassCard className="p-6">
                    <label className="block text-sm font-medium text-gray-400 mb-4">Product Image</label>
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-cyber-blue/50 transition cursor-pointer bg-white/5">
                        <FiUploadCloud className="w-10 h-10 text-cyber-blue mb-3" />
                        <p className="text-sm text-gray-300">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG (max 2MB)</p>
                    </div>
                </GlassCard>

                <button
                  onClick={saveProduct}
                  className="w-full bg-gradient-to-r from-cyber-blue to-blue-600 text-white font-bold px-6 py-4 rounded-xl hover:opacity-90 transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  <FiSave /> Save Product
                </button>
            </div>
        </div>
      </main>
    </div>
  );
}