import React, { useContext } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../../firebase";
import axios from "axios";
import { AuthContext } from "../../context/AuthenticationContext";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const SocialLogin = () => {
  const { dispatch } = useContext(AuthContext); 
  // Note: Depending on how AuthContext is implemented, we might need a different way to update state.
  // I checked AuthContext and it uses useState for user.
  // I'll need to update AuthContext to expose a setter or a login function that takes user data.
  // For now, I'll assume I can pass the data back to context or just handle it here and reload/redirect.
  
  // Actually, let's look at AuthContext again. It has a login function. 
  // I should probably add a method to AuthContext to handle the state update after social login.
  // But wait, the user's snippet for SocialLogin.jsx does the backend call itself.
  
  // Let's modify this component to work with the existing AuthContext structure.
  // The existing AuthContext passes { user, login, googleLogin, ... }.
  // I will inject the setUser functionality into the Context so I can use it here.
  
  const navigate = useNavigate();
  const { validSocialLogin } = useContext(AuthContext); // I will add this function to context

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("Google user info:", user);
      
      if (validSocialLogin) {
          await validSocialLogin(user.email, user.displayName, user.uid, "google");
          navigate('/profile'); // or wherever
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;

      console.log("GitHub user info:", user);

      if (validSocialLogin) {
          await validSocialLogin(user.email || user.displayName + "@github.com", user.displayName, user.uid, "github");
           navigate('/profile');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 bg-white text-black p-3 rounded-lg font-bold hover:bg-gray-100 transition w-full">
        <FcGoogle size={20} />
        Login with Google
      </button>
      <button onClick={handleGithubLogin} className="flex items-center justify-center gap-2 bg-[#24292e] text-white p-3 rounded-lg font-bold hover:bg-[#2b3137] transition w-full">
        <FaGithub size={20} />
        Login with GitHub
      </button>
    </div>
  );
};

export default SocialLogin;
