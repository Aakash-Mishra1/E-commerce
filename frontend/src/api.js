import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.token = `Bearer ${localStorage.getItem("token")}`;
  }
  return req;
});

// Auth API
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const googleAuth = (data) => API.post("/auth/google", data);

// Product API
export const getProducts = (category) => {
    return category 
        ? API.get(`/products?category=${category}`)
        : API.get("/products");
};
export const getProductById = (id) => API.get(`/products/find/${id}`);
export const createProduct = (data) => API.post("/products", data);

// Order API
export const createOrder = (data) => API.post("/orders", data);
export const createPaymentOrder = (amount) => API.post("/payment/orders", { amount });
export const verifyPayment = (data) => API.post("/payment/verify", data);
export const getUserOrders = (userId) => API.get(`/orders/find/${userId}`);
export const getAllOrders = () => API.get("/orders");
export const updateOrder = (id, data) => API.put(`/orders/${id}`, data);
export const getAllUsers = () => API.get("/users");

export default API;