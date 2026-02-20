import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthenticationContext";
import { useToast } from "../context/ToastContext";

export default function AdminSidebar({ isOpen, onClose }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast.success("Successfully Signed Out");
    navigate("/");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-cyber-dark2 text-white min-h-screen p-5 border-r border-white/10 flex flex-col justify-between transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-2xl md:shadow-none`}>
      <div>
        <h1 className="text-2xl mb-8 font-poppins font-bold text-cyber-blue">Admin Panel</h1>
        <div className="flex flex-col gap-4 font-inter">
        <Link to="/admin/dashboard" className="p-2 hover:bg-white/5 rounded transition">Dashboard</Link>
        <Link to="/admin/add-product" className="p-2 hover:bg-white/5 rounded transition">Add Product</Link>
        <Link to="/admin/manage-products" className="p-2 hover:bg-white/5 rounded transition">Manage Products</Link>
        <Link to="/admin/manage-orders" className="p-2 hover:bg-white/5 rounded transition">Manage Orders</Link>
        <Link to="/admin/manage-users" className="p-2 hover:bg-white/5 rounded transition">Users</Link>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4 mt-4">
        {user?.email === "admin@techstore.com" && (
            <div className="mb-4 text-sm text-cyber-blue bg-cyber-blue/10 p-2 rounded border border-cyber-blue/30">
                Admin Demo Account Active
            </div>
        )}
        <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-cyber-purple flex items-center justify-center font-bold">
                {user?.username?.[0] || "A"}
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.username}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
        </div>
        <button 
            onClick={handleLogout}
            className="w-full text-left p-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded transition flex items-center gap-2"
        >
            <span>Logout</span>
        </button>
      </div>
    </div>
    </>
  );
}