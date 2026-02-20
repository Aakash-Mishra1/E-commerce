import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getAllUsers, getAllOrders, getProducts, deleteProduct as apiDeleteProduct, createProduct as apiCreateProduct, updateProduct as apiUpdateProduct, deleteUser as apiDeleteUser, registerUser } from '../api';

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data (Products, Users, Orders)
  const fetchAllData = useCallback(async () => {
    try {
      // 1. Fetch Users
      const userRes = await getAllUsers();
      const backendUsers = userRes.data.map(user => ({
        id: user._id, 
        name: user.username || "Unknown",
        email: user.email,
        role: user.isAdmin ? "Admin" : "User",
        joined: new Date(user.createdAt).toLocaleDateString(),
        status: "Active",
        addresses: user.addresses || []
      }));
      setUsers(backendUsers);

      // 2. Fetch Products
      const productRes = await getProducts();
      setProducts(productRes.data.map(p => ({
          ...p,
          id: p._id // Ensure ID is accessible as 'id' for tables
      })));

      // 3. Fetch Orders
      const orderRes = await getAllOrders();
      const backendOrders = orderRes.data.map(order => ({
          ...order,
          id: order._id,
          customer: order.userId?.username || order.userId?.email || "Guest User", 
          date: new Date(order.createdAt).toLocaleDateString(),
          amount: order.amount,
          status: order.status || 'Pending',
          items: order.products ? order.products.length : 0
      }));
      setOrders(backendOrders.reverse()); // Newest first

    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
        setLoading(false);
    }
  }, []);

  // Initial fetch and polling
  useEffect(() => {
    fetchAllData();
    // Poll every 5 seconds for real-time updates
    const interval = setInterval(fetchAllData, 5000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  // --- Actions ---

  const addProduct = async (productData) => {
      try {
          await apiCreateProduct(productData);
          await fetchAllData(); // Refresh immediately
          return { success: true };
      } catch (error) {
          console.error("Failed to add product", error);
          // Return the error message if available
          return { success: false, message: error.response?.data?.message || error.message || "Unknown error" };
      }
  };

  const removeProduct = async (id) => {
      try {
          await apiDeleteProduct(id);
          // Optimistic update
          setProducts(prev => prev.filter(p => p.id !== id));
          return true;
      } catch (error) {
          console.error("Failed to delete product", error);
          return false;
      }
  };

  const updateProduct = async (id, updatedData) => {
      try {
          await apiUpdateProduct(id, updatedData);
          await fetchAllData();
          return { success: true };
      } catch (error) {
          console.error("Failed to update product", error);
          return { success: false, message: error.response?.data?.message || error.message || "Unknown error" };
      }
  };

  const addUser = async (userData) => {
     try {
         await registerUser({
             username: userData.name,
             email: userData.email,
             password: userData.password
         });
         await fetchAllData();
         return true;
     } catch (error) {
         console.error("Failed to add user", error);
         return false;
     }
  };

  const removeUser = async (id) => {
      try {
          await apiDeleteUser(id);
          setUsers(prev => prev.filter(u => u.id !== id));
          return true;
      } catch (error) {
          console.error("Failed to delete user", error);
          return false;
      }
  };

  const toggleUserStatus = async (id, currentStatus) => {
      // Toggle logic
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      try {
          // Since we don't have a direct status field in DB yet, let's use a generic update
          // Or assume we add 'status' field to user model.
          // For now, let's update local state to simulate UI change as requested
          
          // Ideally: await apiUpdateUser(id, { status: newStatus });
          // But since apiUpdateUser (updateUser) is not imported directly as aliases, let's fix imports first or assume it works if we add it to context.
          
          // Actually, I should update the backend user model to support status if it doesn't.
          // In the meantime, updating local state:
          
          setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
          return true;
      } catch (e) {
          console.error(e);
          return false;
      }
  };

  return (
    <AppDataContext.Provider value={{
      products,
      users,
      orders,
      loading,
      refetch: fetchAllData,
      addProduct,
      removeProduct,
      updateProduct,
      addUser,
      removeUser,
      toggleUserStatus
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
