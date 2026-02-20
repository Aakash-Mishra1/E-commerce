import React, { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import GlassCard from "../../components/common/GlassCard";
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCheck, FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAppData } from "../../context/AppDataContext"; // Use the context
import { useToast } from "../../context/ToastContext";
import Loader from "../../components/common/Loader";

export default function ManageProducts() {
  const { products, removeProduct, updateProduct, loading } = useAppData(); // updated context
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState(null); // For modal
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const success = await removeProduct(id);
      if (success) {
          toast.success("Product Deleted Successfully");
      } else {
          toast.error("Failed to delete product");
      }
    }
  };
  
  const handleEditClick = (product) => {
      setEditingProduct({ ...product }); // Create a copy to edit
  };

  const handleSaveEdit = async () => {
      if (!editingProduct) return;
      
      const result = await updateProduct(editingProduct.id, editingProduct);
      if (result.success) {
          toast.success("Product Updated Successfully!");
          setEditingProduct(null); // Close modal
      } else {
          toast.error("Failed to update product: " + result.message);
      }
  };

  if (loading) return (
      <div className="min-h-screen bg-cyber-dark1 flex items-center justify-center text-white">
          <Loader text="Loading products..." />
      </div>
  );

  return (
    <div className="flex bg-cyber-dark1 min-h-screen text-white font-inter relative">
       <div className="md:hidden fixed top-4 left-4 z-40">
        <button onClick={() => setSidebarOpen(true)} className="p-2 bg-cyber-dark2 rounded-lg text-white shadow-lg border border-white/10">
            <FiMenu size={24} />
        </button>
      </div>

      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 relative overflow-hidden transition-all duration-300 pt-16 md:pt-8 w-full max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
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
                        <button 
                            onClick={() => handleEditClick(product)}
                            className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition"
                        >
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
            {products.length === 0 && (
                <div className="p-10 text-center text-gray-500 bg-white/5 m-4 rounded-xl border border-dashed border-gray-700">
                    No products found. Add one to get started!
                </div>
            )}          </div>
        </GlassCard>

        {/* Edit Product Modal */}
        {editingProduct && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <GlassCard className="w-full max-w-lg p-6 relative">
                    <button 
                        onClick={() => setEditingProduct(null)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                    
                    <h2 className="text-2xl font-bold text-white mb-6">Edit Product</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Product Name</label>
                            <input 
                                type="text" 
                                value={editingProduct.name}
                                onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-cyber-blue transition"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Price (₹)</label>
                                <input 
                                    type="number" 
                                    value={editingProduct.price}
                                    onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-cyber-blue transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Stock</label>
                                <input 
                                    type="number" 
                                    value={editingProduct.stock}
                                    onChange={(e) => setEditingProduct({...editingProduct, stock: Number(e.target.value)})}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-cyber-blue transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Category</label>
                            <select 
                                value={editingProduct.category}
                                onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-cyber-blue transition"
                            >
                                <option value="Audio">Audio</option>
                                <option value="Mobiles">Mobiles</option>
                                <option value="Laptops">Laptops</option>
                                <option value="Gaming">Gaming</option>
                                <option value="Wearables (Watches)">Wearables (Watches)</option>
                                <option value="Monitors">Monitors</option>
                                <option value="Photography">Photography</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Home & Kitchen">Home & Kitchen</option>
                                <option value="Sports">Sports</option>
                                <option value="Computers">Computers</option>
                                <option value="Electronics">Electronics</option>
                            </select>
                        </div>
                        
                        <div className="pt-4 flex justify-end gap-3">
                            <button 
                                onClick={() => setEditingProduct(null)}
                                className="px-4 py-2 border border-white/10 rounded-lg text-gray-300 hover:bg-white/5 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveEdit}
                                className="px-4 py-2 bg-gradient-to-r from-cyber-blue to-blue-600 rounded-lg text-white font-medium hover:opacity-90 transition shadow-lg shadow-blue-500/20 flex items-center gap-2"
                            >
                                <FiCheck /> Save Changes
                            </button>
                        </div>
                    </div>
                </GlassCard>
            </div>
        )}
      </main>
    </div>
  );
}