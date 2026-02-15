import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AppWrapper from "../components/layout/AppWrapper";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [input, setInput] = useState({ username: "", email: "", password: "" });
  const { register, isFetching, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async () => {
      const success = await register(input.username, input.email, input.password);
      if (success) {
          alert("Registration Successful");
          navigate('/login');
      }
  };

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
                
                <button onClick={handleRegister} disabled={isFetching} className="w-full bg-cyber-blue text-white p-3 rounded-lg font-bold hover:bg-cyber-blueLight transition shadow-lg shadow-cyber-blue/20" >
                    {isFetching ? "Registering..." : "Register"}
                </button>
                {error && <span className="text-red-500 text-sm">Something went wrong...</span>}
            </div>
        </div>
      </div>
    </AppWrapper>
  );
}