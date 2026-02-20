import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthenticationContext";
import { updateUser } from "../api";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from user profile when logged in
  useEffect(() => {
    if (user && user.wishlist) {
      // Backend returns populated objects, which match our item structure
      setWishlistItems(user.wishlist);
    } else if (!user) {
      // Clear or load from local storage if guest
      const saved = localStorage.getItem("wishlist");
      setWishlistItems(saved ? JSON.parse(saved) : []);
    }
  }, [user]);

  // Sync to Backend and Local Storage
  const syncWishlist = async (newItems) => {
    setWishlistItems(newItems);
    localStorage.setItem("wishlist", JSON.stringify(newItems));

    if (user && user._id) {
       try {
           // We only send IDs to backend to avoid circular/large payload issues
           // But actually, update API expects what schema defines.
           // Mongoose refs usually take IDs.
           const wishlistIds = newItems.map(item => item._id || item.id);
           await updateUser(user._id, { wishlist: wishlistIds });
       } catch (err) {
           console.error("Failed to sync wishlist", err);
       }
    }
  };

  const addToWishlist = (product) => {
    const productId = product._id || product.id;
    if (wishlistItems.find((item) => (item._id || item.id) === productId)) return;
    
    const newItems = [...wishlistItems, { ...product, id: productId }];
    syncWishlist(newItems);
  };

  const removeFromWishlist = (productId) => {
    const newItems = wishlistItems.filter((item) => (item._id || item.id) !== productId);
    syncWishlist(newItems);
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => (item._id || item.id) === productId);
  };


  const toggleWishlist = (product) => {
    const productId = product._id || product.id;
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
