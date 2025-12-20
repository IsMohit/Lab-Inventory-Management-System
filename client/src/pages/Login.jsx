import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        setSuccess("✅ Login successful! Redirecting...");
        setTimeout(() => {
          // Navigate based on role
          if (result.role === "admin") {
            navigate("/");
          } else {
            navigate("/inventory");
          }
        }, 1500);
      } else {
        setError(result.error || "❌ Invalid credentials");
      }
    } catch (err) {
      setError(err.message || "❌ An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-indigo-900 to-gray-900">
      <form
        onSubmit={handleLogin}
        className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-sm text-white border border-white/10"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">🔐 LIMS Login</h2>

        {success && (
          <p className="text-green-400 bg-green-100/10 border border-green-400 px-4 py-2 rounded mb-4 text-sm">
            {success}
          </p>
        )}

        {error && (
          <p className="text-red-400 bg-red-100/10 border border-red-400 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-gray-300 mt-4 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition"
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
