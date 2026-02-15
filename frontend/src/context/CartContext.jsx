import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      // Normalize ID: Mongo uses _id, some local data uses id.
      const productId = product._id || product.id;
      
      const existingItem = prev.find((item) => (item._id || item.id) === productId);
      
      if (existingItem) {
        return prev.map((item) =>
          (item._id || item.id) === productId
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      
      // Add new item with normalized props if needed, but keeping original structure is usually fine
      // just ensure we check both _id and id next time.
      // For safety, let's ensure the cart item has 'id' property consistent for UI keys.
      return [...prev, { ...product, id: productId, quantity: product.quantity || 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => (item._id || item.id) !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        (item._id || item.id) === productId ? { ...item, quantity: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
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