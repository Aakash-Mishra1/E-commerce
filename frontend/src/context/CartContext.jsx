import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthenticationContext";
import { updateUser } from "../api";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  // Load cart from user profile when logged in
  useEffect(() => {
    if (user && user.cart) {
      // Backend returns populated objects: [{ productId: {...product}, quantity: 1 }, ...]
      // Transform to frontend format: [{ ...product, quantity: 1 }, ...]
      const formattedCart = user.cart.map(item => {
         // Handle case where product might be null (deleted product)
         if (!item.productId) return null;
         return {
             ...item.productId,
             quantity: item.quantity,
             // Ensure ID consistency
             id: item.productId._id || item.productId.id 
         };
      }).filter(Boolean); // Remove nulls
      
      setCartItems(formattedCart);
    } else if (!user) {
      // Guest/Offline fallback
      const savedCart = localStorage.getItem("cart");
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
    }
  }, [user]);

  // Initial load from storage to prevent flicker before auth loads
  useEffect(() => {
     if(!user) {
        const savedCart = localStorage.getItem("cart");
        if(savedCart) setCartItems(JSON.parse(savedCart));
     }
  }, []);

  const syncCart = async (newItems) => {
    setCartItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));

    if (user && user._id) {
       try {
           // Transform to backend schema: [{ productId: id, quantity: qty }]
           const backendCart = newItems.map(item => ({
               productId: item._id || item.id,
               quantity: item.quantity
           }));
           await updateUser(user._id, { cart: backendCart });
       } catch (err) {
           console.error("Failed to sync cart", err);
       }
    }
  };

  const addToCart = (product) => {
    const productId = product._id || product.id;
    const existingItem = cartItems.find((item) => (item._id || item.id) === productId);
    
    let newItems;
    if (existingItem) {
        newItems = cartItems.map((item) =>
          (item._id || item.id) === productId
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
    } else {
        newItems = [...cartItems, { ...product, id: productId, quantity: product.quantity || 1 }];
    }
    syncCart(newItems);
  };

  const removeFromCart = (productId) => {
    const newItems = cartItems.filter((item) => (item._id || item.id) !== productId);
    syncCart(newItems);
  };

  const updateQuantity = (productId, quantity) => {
    const newItems = cartItems.map((item) =>
        (item._id || item.id) === productId ? { ...item, quantity: quantity } : item
    );
    syncCart(newItems);
  };

  const clearCart = () => {
    syncCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
