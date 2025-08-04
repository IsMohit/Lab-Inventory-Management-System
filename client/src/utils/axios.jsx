// utils/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Make sure this matches your backend
  headers: {
    "Content-Type": "application/json"
  }
});

// Automatically attach token to each request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error) // Handle request setup errors
);

export default api;
