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
export const socialLoginUser = (data) => API.post("/auth/social-login", data);

// Product API
export const getProducts = (category) => {
    return category 
        ? API.get(`/products?category=${category}`)
        : API.get("/products");
};
export const getProductById = (id) => API.get(`/products/find/${id}`);
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data); // Add update API
export const deleteProduct = (id) => API.delete(`/products/${id}`); // Add delete API

// Order API
export const createOrder = (data) => API.post("/orders", data);
export const getUserOrders = (id) => API.get(`/orders/find/${id}`);
export const getAllOrders = () => API.get("/orders");
export const updateOrder = (id, data) => API.put(`/orders/${id}`, data);

// User Profile API
export const getUserReviews = (id) => API.get(`/users/${id}/reviews`);
export const getUser = (id) => API.get(`/users/find/${id}`);
export const addUserAddress = (id, data) => API.post(`/users/${id}/address`, data);
export const removeUserAddress = (id, addressId) => API.delete(`/users/${id}/address/${addressId}`);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const createPaymentOrder = (amount) => API.post("/payment/orders", { amount });
export const verifyPayment = (data) => API.post("/payment/verify", data);
export const getAllUsers = () => API.get("/users");
export const createReview = (data) => API.post("/reviews", data);
export const getProductReviews = (id) => API.get(`/reviews/product/${id}`);
export const redeemPoints = (id, data) => API.post(`/users/${id}/redeem`, data);

export default API;