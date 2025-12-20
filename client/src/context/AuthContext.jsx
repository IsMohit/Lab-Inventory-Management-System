import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if JWT token exists from previous session
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      setAuthUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Send email and password to backend
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      // Store JWT and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setAuthUser(user);

      return { success: true, role: user.role };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuthUser(null);
      
      return { success: true };
    } catch (err) {
      console.error("Logout error:", err);
      return { success: false, error: err.message };
    }
  };

  const register = async (email, password, name) => {
    try {
      // Send registration data to backend
      const res = await api.post("/auth/register", { email, password, name });
      const { token, user } = res.data;

      // Store JWT and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setAuthUser(user);

      return { success: true, role: user.role };
    } catch (err) {
      console.error("Registration error:", err);
      
      // Handle specific errors
      let errorMessage = err.response?.data?.message || err.message;
      if (err.response?.status === 400) {
        errorMessage = err.response.data.message || "Invalid registration data";
      }
      
      return { success: false, error: errorMessage };
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user: authUser, 
        login,
        register,
        logout,
        loading
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
