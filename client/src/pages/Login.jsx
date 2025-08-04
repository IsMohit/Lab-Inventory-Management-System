import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });

      // Save token and user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Navigate based on role
      if (res.data.user.role === "admin") {
        // navigate("/");
      } else {
        navigate("/inventory");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-indigo-900 to-gray-900">
      <form
        onSubmit={handleLogin}
        className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-sm text-white border border-white/10"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">🔐 LIMS Login</h2>

        {error && (
          <p className="text-red-400 bg-red-100/10 border border-red-400 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-white transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
