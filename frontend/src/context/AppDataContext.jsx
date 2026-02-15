import React, { createContext, useState, useContext, useEffect } from 'react';
import { products as initialProducts } from '../data/products';

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }) => {
  // Sync with localStorage to persist "real-time" changes
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('app_products');
    return saved ? JSON.parse(saved) : initialProducts || [];
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('app_users');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Rahul Khanna", email: "rahul@example.com", role: "customer", joined: "Jan 12, 2024", status: "Active" },
      { id: 2, name: "Admin Code", email: "admin@techstore.com", role: "admin", joined: "Dec 01, 2023", status: "Active" },
    ];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('app_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('app_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('app_orders', JSON.stringify(orders));
  }, [orders]);

  // Actions
  const addProduct = (product) => {
    setProducts(prev => [...prev, { ...product, id: prev.length + 1 }]);
  };

  const removeProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addUser = (user) => {
    setUsers(prev => [...prev, { ...user, id: prev.length + 1 }]);
  };

  const removeUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addOrder = (order) => {
    setOrders(prev => [order, ...prev]);
  };

  return (
    <AppDataContext.Provider value={{
      products,
      users,
      orders,
      addProduct,
      removeProduct,
      addUser,
      removeUser,
      addOrder,
      setProducts // Expose setter if needed for complex updates
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
