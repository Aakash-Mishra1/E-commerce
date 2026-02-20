import React, { useState, useRef, useEffect } from "react";
// import { createProduct } from "../../api"; // Removed direct API call
import { useAppData } from "../../context/AppDataContext"; // Use context
import { useToast } from "../../context/ToastContext"; // Import Toast
import AdminSidebar from "../../components/AdminSidebar";
import GlassCard from "../../components/common/GlassCard";
import { FiUploadCloud, FiSave, FiChevronDown, FiCheck } from "react-icons/fi";

const CATEGORIES = [
    "Audio", "Mobiles", "Laptops", "Gaming", 
    "Wearables (Watches)", "Monitors", "Photography", 
    "Furniture", "Home & Kitchen", "Sports", 
    "Computers", "Electronics"
];

export default function AddProduct() {
  const { addProduct } = useAppData(); // Use wrapper from context which refreshes list
  const { toast } = useToast(); // Use toast
  const [product, setProduct] = useState({
    name: "",  
    description: "",
    price: "",
    category: "",
    stock: "", 
    image: ""
  });
  const [loading, setLoading] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categoryRef]);

  const saveProduct = async () => {
    // Basic validation
    if (!product.name || !product.price || !product.category || !product.image) {
        toast.error("Please fill in all required fields (Name, Price, Category, and Image)");
        return;
    }

    setLoading(true);
    
    // Clean up data before sending
    const productData = {
        ...product,
        price: Number(product.price),
        stock: product.stock ? Number(product.stock) : 0,
    };

    try {
        const result = await addProduct(productData);
        if (result.success) {
            toast.success("Product Added Successfully!");
            // Reset form
            setProduct({ name: "", description: "", price: "", category: "", stock: "", image: "" });
        } else {
            toast.error(`Failed to add product: ${result.message}`);
        }
    } catch (err) {
        console.error(err);
        toast.error("An unexpected error occurred.");
    } finally {
        setLoading(false);
    }
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-20">
            <div className="lg:col-span-2 space-y-6 relative z-30">
                <GlassCard className="p-8 space-y-6 overflow-visible">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Product Name</label>
                        <input name="name" value={product.name} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-blue outline-none transition" placeholder="e.g. Neon Gaming Headset" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                        <textarea name="description" value={product.description} onChange={handleChange} rows="4" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-blue outline-none transition" placeholder="Product details..." />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Price (₹)</label>
                            <input name="price" type="number" value={product.price} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-blue outline-none transition" placeholder="0.00" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Stock Quantity</label>
                            <input name="stock" type="number" value={product.stock} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-blue outline-none transition" placeholder="0" />
                        </div>
                    </div>

                    <div className="relative" ref={categoryRef}>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                        <div 
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className={`w-full bg-[#0f172a] border ${isCategoryOpen ? 'border-brandBlue' : 'border-white/10'} rounded-lg p-3 text-white cursor-pointer flex justify-between items-center transition-all hover:bg-white/5`}
                        >
                            <span className={product.category ? "text-white" : "text-gray-500"}>
                                {product.category || "Select Category"}
                            </span>
                            <FiChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isCategoryOpen ? "rotate-180" : ""}`} />
                        </div>

                        {/* Custom Dropdown Menu */}
                        {isCategoryOpen && (
                            <div className="absolute z-50 w-full mt-2 bg-[#1e293b] border border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar animate-fade-in-up">
                                {CATEGORIES.map((cat) => (
                                    <div 
                                        key={cat}
                                        onClick={() => {
                                            setProduct({...product, category: cat});
                                            setIsCategoryOpen(false);
                                        }}
                                        className="px-4 py-3 hover:bg-brandBlue/20 hover:text-brandBlue cursor-pointer transition-colors border-b border-white/5 last:border-0 flex justify-between items-center group"
                                    >
                                        <span className="text-gray-300 group-hover:text-white font-medium">{cat}</span>
                                        {product.category === cat && <FiCheck className="text-brandBlue" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </GlassCard>
            </div>

            <div className="space-y-6">
                <GlassCard className="p-6">
                    <label className="block text-sm font-medium text-gray-400 mb-4">Product Image</label>
                    
                    {/* File Upload / Preview Area */}
                    <div 
                        onClick={() => document.getElementById('file-upload').click()}
                        className={`border-2 border-dashed ${product.image ? 'border-brandBlue' : 'border-white/20'} rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-cyber-blue/50 transition cursor-pointer bg-white/5 relative overflow-hidden group min-h-[300px]`}
                    >
                        {product.image ? (
                            <>
                                <img 
                                    src={product.image} 
                                    alt="Preview" 
                                    className="absolute inset-0 w-full h-full object-contain p-2"
                                />
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FiUploadCloud className="w-8 h-8 text-white mb-2" />
                                    <p className="text-white font-medium text-sm">Click to change image</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <FiUploadCloud className="w-12 h-12 text-cyber-blue mb-4" />
                                <p className="text-sm text-gray-300 font-medium">Click to upload product image</p>
                                <p className="text-xs text-gray-500 mt-2">Supports: JPG, PNG, WEBP (Max 10MB)</p>
                            </>
                        )}
                        
                        <input 
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    if (file.size > 10000000) { // 10MB limit
                                        toast.error("File is too large. Max 10MB.");
                                        return;
                                    }
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setProduct({ ...product, image: reader.result }); // Set base64 string
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    </div>
                </GlassCard>

                <button
                  onClick={saveProduct}
                  disabled={loading}
                  className={`w-full bg-gradient-to-r from-cyber-blue to-blue-600 text-white font-bold px-6 py-4 rounded-xl hover:opacity-90 transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave /> Save Product
                    </>
                  )}
                </button>
            </div>
        </div>
      </main>
    </div>
  );
}