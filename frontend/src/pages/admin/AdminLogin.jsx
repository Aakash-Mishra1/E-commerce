import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiShield, FiLock, FiMail } from "react-icons/fi";
import GlassCard from "../../components/common/GlassCard";

export default function AdminLogin() {
  const { login } = useContext(AuthContext);
  // Default to admin credentials for easier testing
  const [input, setInput] = useState({ email: "admin@techstore.com", password: "admin123" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
        const user = await login(input.email, input.password);
        if (user && user.isAdmin) {
            navigate('/admin/dashboard');
        } else {
            setError("Invalid Admin Credentials or Access Denied");
        }
    } catch {
        setError("Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark1 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyber-blue/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <GlassCard className="w-full max-w-md p-8 border-cyber-blue/20 shadow-[0_0_50px_rgba(0,240,255,0.1)]">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-cyber-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyber-blue/30">
                <FiShield className="w-8 h-8 text-cyber-blue" />
            </div>
            <h1 className="text-3xl font-bold font-poppins text-white">Admin Portal</h1>
            <p className="text-gray-400 mt-2">Secure Access Gateway</p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center font-medium shadow-[0_0_20px_rgba(255,50,50,0.2)]">
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label className="block text-gray-400 text-sm mb-2">Email Access</label>
                <div className="relative group">
                    <FiMail className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-cyber-blue transition" />
                    <input 
                        type="email"
                        value={input.email}
                        onChange={e => setInput({ ...input, email: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 text-white focus:outline-none focus:border-cyber-blue focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all duration-300"
                        placeholder="admin@techstore.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-gray-400 text-sm mb-2">Security Key</label>
                <div className="relative group">
                    <FiLock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-cyber-blue transition" />
                    <input 
                        type="password"
                        value={input.password}
                        onChange={e => setInput({ ...input, password: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 text-white focus:outline-none focus:border-cyber-blue focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all duration-300"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-cyber-blue to-blue-600 text-black font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300 transform hover:-translate-y-1">
                Authenticate
            </button>
        </form>

        <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-center text-xs text-gray-500 uppercase tracking-widest mb-2">Demo Credentials</p>
            <div className="flex justify-between text-sm text-gray-300">
                <span>Email: <span className="text-cyber-blue font-mono">admin@techstore.com</span></span>
                <span>Pass: <span className="text-cyber-blue font-mono">admin123</span></span>
            </div>
        </div>
      </GlassCard>
    </div>
  );
}
