import { useState, useContext } from "react";
// import { API } from "../api";
import { AuthContext } from "../context/AuthContext";
import AppWrapper from "../components/layout/AppWrapper";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const { login, googleLogin, isFetching, error } = useContext(AuthContext);
  // Default to demo credentials for easier testing
  const [input, setInput] = useState({ email: "rahul@example.com", password: "user123" });
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
   
    const success = await login(input.email, input.password);
    if (success) {
      navigate('/profile'); // Redirect to Customer Profile/Dashboard
    } else {
      setLoginError("Invalid email or password");
    }
  };

  const handleGoogleLogin = async () => {
    setLoginError("");
    const success = await googleLogin();
    if (success) {
      navigate('/profile');
    } else {
      setLoginError("Google Login Failed");
    }
  };

  const socialLogin = (provider) => {
    alert(`Login with ${provider} coming soon!`);
  };

  return (
    <AppWrapper>
      <div className="p-10 pt-20 flex justify-center min-h-[80vh] items-center">
        <div className="w-full max-w-md p-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl h-fit shadow-2xl">
            <h1 className="text-3xl font-bold text-center text-cyber-blue font-poppins mb-6">Customer Login</h1>
            
            {loginError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm text-center">
                {loginError}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
                <input 
                    type="email"
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyber-blue transition" 
                    placeholder="Email" 
                    value={input.email}
                    onChange={(e) => setInput({ ...input, email: e.target.value })} 
                />
                <input 
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyber-blue transition" 
                    placeholder="Password" 
                    type="password" 
                    value={input.password}
                    onChange={(e) => setInput({ ...input, password: e.target.value })} 
                />
                <button disabled={isFetching} type="submit" className="w-full bg-cyber-blue text-white p-3 rounded-lg font-bold hover:bg-cyber-blueLight transition shadow-lg shadow-cyber-blue/20">
                    {isFetching ? "Logging in..." : "Login"}
                </button>
                {error && <span className="text-red-500 text-sm block text-center mt-2">Invalid email or password</span>}
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black/50 text-gray-400">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <button 
                    onClick={handleGoogleLogin}
                    type="button"
                    className="flex items-center justify-center gap-2 bg-white text-black p-3 rounded-lg font-bold hover:bg-gray-100 transition"
                >
                    <FcGoogle size={20} />
                    Login with Google
                </button>
            </div>
            
            <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-center text-xs text-gray-500 uppercase tracking-widest mb-2">Demo Customer</p>
                <div className="flex justify-between text-sm text-gray-300">
                    <span>Email: <span className="text-cyber-blue font-mono">rahul@example.com</span></span>
                    <span>Pass: <span className="text-cyber-blue font-mono">user123</span></span>
                </div>
            </div>
        </div>
      </div>
    </AppWrapper>
  );
}