import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { ArrowRight } from 'lucide-react';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      login({ username: username, role: role });
      toast.success(`Welcome back, ${username}!`);
      navigate(role === 'seller' ? '/seller-dashboard' : '/home');
    } else {
      toast.error("Please enter your username and password.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-112px)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Login to Your Account
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value)} className="input">
            <option value="user">I am a Buyer</option>
            <option value="seller">I am a Seller</option>
          </select>
          <motion.button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Login <ArrowRight size={20} />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;