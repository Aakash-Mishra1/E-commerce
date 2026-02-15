

import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ShoppingBagIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-b border-gray-200 dark:border-white/10 p-4 flex justify-between items-center z-50 sticky top-0 transition-colors duration-300">
      <Link to="/" className="text-2xl font-poppins font-semibold text-brandBlue">
        SmartShop
      </Link>

      <div className="flex items-center space-x-6 text-gray-700 dark:text-gray-300">
        <Link to="/products" className="hover:text-brandBlue transition">Products</Link>
        <Link to="/cart" className="hover:text-brandBlue transition">
          <ShoppingBagIcon className="w-6 h-6 inline-block" />
        </Link>
        
        {user ? (
          <div className="flex items-center gap-4">
             <Link to="/UserProfile" className="flex items-center gap-2 hover:text-brandBlue transition">
                <div className="w-8 h-8 rounded-full bg-brandBlue/20 flex items-center justify-center text-brandBlue font-bold">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline font-medium">{user.username}</span>
             </Link>
          </div>
        ) : (
          <Link to="/login" className="hover:text-brandBlue transition font-medium">Login</Link>
        )}
      </div>
    </nav>
  );
}