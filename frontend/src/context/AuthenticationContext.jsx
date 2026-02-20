import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser, socialLoginUser, updateUser as apiUpdateUser, getUser } from "../api";
import { auth, googleProvider, githubProvider } from "../firebase"; 
import { signInWithPopup } from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        
        // Force logout if using old demo IDs to clear bad state
        if (parsedUser._id === "demo1" || parsedUser._id === "demo2") {
             console.warn("Clearing legacy demo user state");
             localStorage.removeItem('currentUser');
             localStorage.removeItem('token');
             setUser(null);
             return;
        }

        // Set initial state from localStorage to avoid flickering
        setUser(parsedUser);
        
        // Quietly verify user existence with backend
        getUser(parsedUser._id)
            .then(res => {
                // If user found, update with fresh data
                setUser(res.data);
                localStorage.setItem('currentUser', JSON.stringify(res.data));
            })
            .catch(err => {
                console.error("User validation failed:", err);
                // If user not found (deleted) or token invalid, logout
                if (err.response && (err.response.status === 404 || err.response.status === 401)) {
                    console.warn("User invalid, logging out.");
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('token');
                    setUser(null);
                }
            });

      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (email, password) => {
    setIsFetching(true);
    try {
      const res = await loginUser({ email, password });
      setUser(res.data.user);
      localStorage.setItem('currentUser', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      setIsFetching(false);
      setError(false);
      return { success: true, data: res.data }; 
    } catch (err) {
      setError(true);
      setIsFetching(false);
      const message = err.response?.data?.message || "Login failed. Please check your connection or credentials.";
      return { success: false, message };
    }
  };

  const validSocialLogin = async (email, name, uid, provider) => {
    setIsFetching(true);
    try {
      const res = await socialLoginUser({
        email, 
        name, 
        uid, 
        provider
      });
      
      setUser(res.data.user);
      localStorage.setItem('currentUser', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);

      setIsFetching(false);
      setError(false);
      return true;

    } catch (error) {
      console.error("Social Login Error:", error);
      setError(true);
      setIsFetching(false);
      return false;
    }
  };

  const register = async (username, email, password) => {
      setIsFetching(true);
      try {
          const res = await registerUser({ username, email, password });
          // Optional: Auto-login after register, or just return true to redirect to login
          setIsFetching(false);
          return true;
      } catch (err) {
          setError(true);
          setIsFetching(false);
          return false;
      }
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  const updateUser = async (updatedUserData) => {
    if (!user) return;
    try {
        // If it's a demo user, just update local state
        if (user._id === "demo1" || user._id === "demo2") {
             const newUser = { ...user, ...updatedUserData };
             setUser(newUser);
             localStorage.setItem('currentUser', JSON.stringify(newUser));
             return true;
        }

        // Real backend update
        const res = await apiUpdateUser(user._id, updatedUserData);
        const newUser = res.data;
        
        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return true;
    } catch (err) {
        console.error("Failed to update user profile", err);
        // Fallback optimistic update if offline? 
        // No, let's keep consistent with backend state
        return false;
    }
  };

  const updateLocalUser = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, isFetching, error, login, validSocialLogin, register, logout, updateUser, updateLocalUser }}>
      {children}
    </AuthContext.Provider>
  );
};

