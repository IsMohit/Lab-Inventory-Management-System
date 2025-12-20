import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !name) {
      setError("All fields are required");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (name.length < 2) {
      setError("Name must be at least 2 characters");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await register(email, password, name);

      if (result.success) {
        setSuccess("✅ Registration successful! Redirecting to dashboard...");
        setTimeout(() => {
          // Redirect to dashboard or inventory
          navigate("/");
        }, 1500);
      } else {
        setError(result.error || "❌ Registration failed");
      }
    } catch (err) {
      setError(err.message || "❌ An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-indigo-900 to-gray-900">
      <form
        onSubmit={handleRegister}
        className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-sm text-white border border-white/10"
      >
        <h2 className="text-3xl font-bold mb-2 text-center text-white">📝 Create Account</h2>
        <p className="text-center text-gray-300 text-sm mb-6">Join LIMS - Lab Inventory Management System</p>

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
          type="text"
          placeholder="Full Name"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password (min 6 characters)"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 mb-6 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
        />

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="text-center text-gray-300 mt-4 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
