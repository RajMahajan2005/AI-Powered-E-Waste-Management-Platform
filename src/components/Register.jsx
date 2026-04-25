import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import toast from 'react-hot-toast';

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({}); // 👈 State to hold validation errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // 👈 Real-time validation logic
  useEffect(() => {
    const newErrors = {};
    if (formData.username && formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long.";
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0 || !formData.username || !formData.password) {
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setIsSubmitting(true);
    const user = { username: formData.username, password: formData.password };
    
    toast.promise(axios.post("http://localhost:8081/saveUser", user), {
      loading: 'Creating your account...',
      success: () => {
        setIsSubmitting(false);
        setTimeout(() => navigate("/login"), 1000);
        return 'Registration successful! Please log in.';
      },
      error: () => {
        setIsSubmitting(false);
        return 'Registration failed. Username may already exist.';
      },
    });
  };
  
  // 👈 Check if form is valid to enable/disable button
  const isFormValid = Object.keys(errors).length === 0 && formData.username && formData.password && formData.confirmPassword;

  return (
    <div className="min-h-[calc(100vh-112px)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create an Account</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              name="username"
              type="text"
              placeholder="Choose a Username"
              className="input"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {/* 👈 Display specific error message */}
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Create a Password"
              className="input"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          <motion.button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            whileHover={{ scale: isFormValid ? 1.02 : 1 }}
            whileTap={{ scale: isFormValid ? 0.98 : 1 }}
          >
            {isSubmitting ? 'Creating Account...' : 'Register'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Register;