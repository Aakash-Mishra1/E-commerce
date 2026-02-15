import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  Bars3Icon, 
  MagnifyingGlassIcon, 
  UserIcon, 
  ShoppingBagIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
    const { cartItems } = useCart();
    const { user } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <nav className="flex flex-col w-full z-50 sticky top-0 font-sans shadow-xl bg-[#0f172a] text-white backdrop-blur-md bg-opacity-95">
            {/* Main Navbar */}
            <div className="flex items-center justify-between h-20 px-4 md:px-8 max-w-7xl mx-auto w-full relative">
                
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-3 group mr-8">
                    <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/30 ring-1 ring-white/10">
                        <ShoppingBagIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="hidden sm:flex flex-col leading-none">
                        <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-gray-400">ShopVerse</span>
                        <span className="text-[10px] text-indigo-400 font-bold tracking-[0.2em] text-right uppercase mt-0.5">Premium</span>
                    </div>
                </Link>

                {/* Desktop Search Bar */}
                <form className="hidden md:flex flex-1 max-w-2xl relative group mx-4" onSubmit={handleSearch}>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-12 pr-28 py-3 bg-[#1e293b]/80 border border-gray-700/50 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-[#1e293b] focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 backdrop-blur-sm"
                        placeholder="Search for products, brands and more..."
                    />
                    <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40">
                        Search
                    </button>
                </form>

                {/* Right Actions */}
                <div className="flex items-center gap-4 md:gap-6">
                    {/* Admin Icon - Visible to admins or for login */}
                    {(!user || (user && user.isAdmin)) && (
                         <Link to={user ? "/admin/dashboard" : "/admin/login"} className="hidden md:flex flex-col items-center justify-center p-2 group hover:bg-white/5 rounded-xl border border-transparent hover:border-pink-500/20 transition-all">
                            <div className="relative p-2 bg-[#1e293b] rounded-lg group-hover:bg-pink-500/20 transition-colors border border-gray-700/50 group-hover:border-pink-500/50">
                                <ShieldCheckIcon className="w-5 h-5 text-gray-400 group-hover:text-pink-400" />
                                {user && user.isAdmin && <span className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-full animate-pulse border-2 border-[#1e293b]"></span>}
                            </div>
                         </Link>
                    )}

                    {/* Account */}
                    <Link to={user ? (user.isAdmin ? "/admin/dashboard" : "/profile") : "/login"} className="hidden md:flex items-center gap-3 hover:bg-white/5 p-2 rounded-xl transition-all group border border-transparent hover:border-white/5">
                        <div className="p-2 bg-[#1e293b] rounded-lg group-hover:bg-indigo-500/20 transition-colors border border-gray-700/50 group-hover:border-indigo-500/50">
                            <UserIcon className="w-5 h-5 text-gray-300 group-hover:text-indigo-300" />
                        </div>
                        <div className="flex flex-col text-xs">
                            <span className="text-gray-500 group-hover:text-gray-400 text-[10px] uppercase font-bold tracking-wider transition-colors">Welcome</span>
                            <span className="font-semibold truncate max-w-[100px] text-gray-200 group-hover:text-white transition-colors">{user ? user.username.split(' ')[0] : 'Sign In'}</span>
                        </div>
                    </Link>

                    {/* Cart */}
                    <Link to="/cart" className="relative group p-2">
                        <div className="relative p-2.5 bg-[#1e293b] rounded-xl group-hover:bg-indigo-500/20 transition-all border border-gray-700/50 group-hover:border-indigo-500/50 group-hover:shadow-lg group-hover:shadow-indigo-500/20 group-hover:-translate-y-0.5 duration-300">
                            <ShoppingCartIcon className="w-6 h-6 text-gray-300 group-hover:text-indigo-300 transition-colors" />
                        </div>
                         {cartItems.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full ring-4 ring-[#0f172a] shadow-lg shadow-pink-500/40 animate-bounce-short">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>

                     {/* Mobile Menu Toggle */}
                     <button className="md:hidden p-2 text-gray-300 hover:text-white bg-[#1e293b] rounded-lg border border-gray-700/50">
                        <Bars3Icon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Search - Visible under 768px */}
            <div className="md:hidden px-4 pb-4">
                <form className="relative" onSubmit={handleSearch}>
                    <input 
                         type="text" 
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="w-full bg-[#1e293b] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-gray-500"
                         placeholder="Search products..."
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <MagnifyingGlassIcon className="w-5 h-5" />
                    </div>
                </form>
            </div>

            {/* Secondary Nav / Categories */}
            <div className="bg-[#0f172a] border-t border-gray-800/60 ">
                <div className="max-w-7xl mx-auto px-4 h-12 flex items-center gap-8 text-sm font-medium text-gray-400 whitespace-nowrap overflow-x-auto scrollbar-hide">
                    <Link to="/shop" className="hover:text-white transition-colors flex items-center gap-2 text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40">
                        <Bars3Icon className="w-4 h-4" /> All Categories
                    </Link>
                    {["Bestsellers", "New Arrivals", "Electronics", "Computers", "Fashion", "Home & Kitchen", "Deals"].map((item) => (
                        <Link key={item} to={`/shop?category=${item}`} className="hover:text-white transition-colors relative group py-1.5">
                            {item}
                            <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"></span>
                        </Link>
                    ))}
                    {user && user.isAdmin && (
                        <Link to="/admin/dashboard" className="ml-auto flex items-center gap-2 text-xs font-bold text-pink-300 bg-pink-500/10 px-4 py-1.5 rounded-full border border-pink-500/20 hover:bg-pink-500/20 hover:text-pink-200 transition-all shadow-lg shadow-pink-900/20">
                            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                            Admin Portal
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
