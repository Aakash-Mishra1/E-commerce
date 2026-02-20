import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthenticationContext";
import { useToast } from "../context/ToastContext";
import AppWrapper from "../components/layout/AppWrapper";
import { useNavigate } from "react-router-dom";
import SocialLogin from "../components/common/SocialLogin";
import Loader from "../components/common/Loader";

export default function Register() {
  const [input, setInput] = useState({ username: "", email: "", password: "" });
  const { register, isFetching, error } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async () => {
      setLoading(true);
      // Artificial delay for better UX (showing loader)
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      const success = await register(input.username, input.email, input.password);
      setLoading(false);

      if (success) {
          addToast("Registration Successful! Please login.", "success");
          navigate('/login');
      } else {
          addToast("Registration Failed. Try again.", "error");
      }
  };

  if (loading) {
      return (
          <AppWrapper>
            <div className="flex items-center justify-center min-h-[80vh]">
                <Loader text="Creating your account..." />
            </div>
          </AppWrapper>
      );
  }

  return (
    <AppWrapper>
      <div className="p-10 pt-20 flex justify-center min-h-[80vh] items-center">
        <div className="w-full max-w-md p-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl">
            <h1 className="text-3xl font-bold text-center text-cyber-blue font-poppins mb-6">Register</h1>
            
            <div className="space-y-4">
                <input 
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyber-blue transition" 
                    placeholder="Username" 
                    onChange={e => setInput({ ...input, username: e.target.value })} 
                />
                <input 
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyber-blue transition" 
                    placeholder="Email" 
                    onChange={e => setInput({ ...input, email: e.target.value })} 
                />
                <input 
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyber-blue transition" 
                    placeholder="Password" 
                    type="password" 
                    onChange={e => setInput({ ...input, password: e.target.value })} 
                />
                
                <button onClick={handleRegister} disabled={loading} className="w-full bg-cyber-blue text-white p-3 rounded-lg font-bold hover:bg-cyber-blueLight transition shadow-lg shadow-cyber-blue/20" >
                    {loading ? "..." : "Register"}
                </button>
                {/* {error && <span className="text-red-500 text-sm">Something went wrong...</span>} */}
            </div>
            
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black/50 text-gray-400">Or continue with</span>
                </div>
            </div>

            <SocialLogin />

            <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                    Already have an account? <button onClick={() => navigate('/login')} className="text-cyber-blue hover:text-cyber-blueLight underline ml-1 font-medium">Login</button>
                </p>
            </div>
        </div>
      </div>
    </AppWrapper>
  );
}