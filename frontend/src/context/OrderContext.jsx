import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { createOrder, getUserOrders } from "../api";

const OrderContext = createContext();

export const useOrders = () => {
  return useContext(OrderContext);
};

export const OrderProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  // Initialize from localStorage if available (for demo/offline persistence)
  const [orders, setOrders] = useState(() => {
      const saved = localStorage.getItem('localOrders');
      return saved ? JSON.parse(saved) : [];
  });
  
  // Sync local orders to storage whenever they change
  useEffect(() => {
      if (orders.length > 0) {
          localStorage.setItem('localOrders', JSON.stringify(orders));
      }
  }, [orders]);

  // Fetch orders from backend when user logs in with real-time polling
  useEffect(() => {
    let intervalId;

    const fetchOrders = async () => {
      if (user && user._id) {
        try {
          const res = await getUserOrders(user._id);
          // Transform backend data
          const backendOrders = res.data.map(order => ({
            ...order,
            id: order._id,
            date: new Date(order.createdAt).toLocaleDateString(),
            total: `₹${order.amount.toLocaleString()}`,
            cartDetails: order.products,
            status: order.status.charAt(0).toUpperCase() + order.status.slice(1)
          }));
          
          // Merge with local orders (preserving offline demo orders)
          setOrders(prev => {
              const localOnly = prev.filter(o => o.id.toString().startsWith('DEMO') || o.id.toString().startsWith('OFFLINE'));
              // Avoid duplicates if backend returns same orders (unlikely given ID formats)
              return [...localOnly, ...backendOrders].sort((a,b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
          });
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        }
      } 
    };

    fetchOrders(); // Initial fetch

    if (user && user._id) {
        // Poll every 5 seconds for real-time updates
        intervalId = setInterval(fetchOrders, 5000);
    }

    return () => {
        if (intervalId) clearInterval(intervalId);
    };
  }, [user]);

  const addOrder = async (orderData) => {
    setLoading(true);
    // Only use fallback if we are CERTAIN we are offline/using fake token
    const isOfflineDemo = user?.accessToken === "demo-token" || user?.accessToken === "demo-admin-token";

    try {
        
        if (user && user._id && !isOfflineDemo) {
            const apiData = {
                userId: user._id, 
                products: orderData.cartDetails.map(item => ({
                    productId: item._id || item.id, // Handles both API and local products
                    quantity: item.quantity || 1,
                    name: item.name,
                    price: item.price,
                    image: item.image
                })),
                amount: typeof orderData.total === 'number' ? orderData.total : parseFloat(String(orderData.total).replace(/[^0-9.]/g, '')),
                address: orderData.address || { street: "123 Tech St", city: "Cyber City", country: "India" }, // Default if missing
                status: orderData.paymentInfo ? 'paid' : 'pending',
                paymentInfo: orderData.paymentInfo || null,
            };
            
            // Validate amount before sending
            if (isNaN(apiData.amount)) apiData.amount = 0;

            const res = await createOrder(apiData);
            
            // Format order immediately to match UI structure so it displays correct without refresh
            const newOrderFormatted = {
                ...res.data,
                id: res.data._id,
                date: new Date(res.data.createdAt).toLocaleDateString(),
                total: `₹${res.data.amount.toLocaleString()}`,
                cartDetails: res.data.products,
                status: res.data.status.charAt(0).toUpperCase() + res.data.status.slice(1)
            };
            
            setOrders((prev) => [newOrderFormatted, ...prev]);
            return true;
        } else {
            // Offline/Guest/Demo Fallback (local only)
            const newOrder = {
              ...orderData,
              id: isOfflineDemo ? `DEMO-ORDER-${Date.now()}` : `GUEST-${Date.now()}`,
              userId: user?._id || 'guest',
              status: orderData.paymentInfo ? 'Order Confirmed' : 'Processing',
              createdAt: new Date().toISOString()
            };
            setOrders((prev) => [newOrder, ...prev]);
            return true;
        }
    } catch (err) {
        // Handle Token Expiry
        if (err.response?.status === 401 || err.response?.status === 403) {
            console.warn("Token expired or invalid: saving locally as fallback");
            const fallbackOrder = {
                 ...orderData,
                 id: isOfflineDemo ? `DEMO-ORDER-${Date.now()}` : `OFFLINE-${Date.now()}`,
                 userId: user?._id || 'guest',
                 status: 'Order Confirmed',
                 createdAt: new Date().toISOString()
            };
            setOrders((prev) => [fallbackOrder, ...prev]);
            return true; 
        }

        console.error("Order creation failed:", err.response?.data || err.message);
        return false;
    } finally {
        setLoading(false);
    }
  };

  const getOrderById = (orderId) => {
    return orders.find(Order => (Order._id === orderId || Order.id === orderId));
  };

  // Mock cancel for now, real implementation would update status on backend
  const cancelOrder = (orderId, reason) => {
    setOrders(prev => prev.map(order => 
      (order._id === orderId || order.id === orderId)
        ? { ...order, status: 'Cancelled', cancellationReason: reason } 
        : order
    ));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrderById, cancelOrder, loading }}>
      {children}
    </OrderContext.Provider>
  );
};
