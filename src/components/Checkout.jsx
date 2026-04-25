import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

// 👈 1. The function now accepts an object with both productId and the form data
const buyProduct = async ({ productId, form }) => {
  // 👈 2. The form data is now sent in the body of the POST request
  const { data } = await axios.post(`http://localhost:8081/api/products/${productId}/buy`, form);
  return data;
};

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { product } = location.state || {};

  const [form, setForm] = useState({
    fullName: user?.username || "",
    email: "", // 👈 Enhancement: Added email field
    address: "",
    city: "",
    zip: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const newErrors = {};
    if (form.zip && !/^\d{6}$/.test(form.zip)) {
      newErrors.zip = "ZIP code must be 6 digits.";
    }
    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }
    // 👈 Enhancement: Simple email validation
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
        newErrors.email = "Please enter a valid email address.";
    }
    setErrors(newErrors);
  }, [form]);

  const buyMutation = useMutation({
    mutationFn: buyProduct,
    onSuccess: () => {
      toast.success("Purchase successful!");
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (product?.sellerUsername) queryClient.invalidateQueries({ queryKey: ['myProducts', product.sellerUsername] });
      navigate("/order-success", { state: { product, form } });
    },
    onError: () => toast.error("Failed to purchase. Product may be out of stock."),
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return toast.error("Please fix the errors in your shipping details.");
    if (form.fullName && form.address && form.phone && form.city && form.zip && form.email) {
      // 👈 3. Pass both the product ID and the form data to the mutation
      buyMutation.mutate({ productId: product.id, form });
    } else {
      toast.error("Please fill all shipping details.");
    }
  };
  
  const isFormValid = Object.keys(errors).length === 0 && form.fullName && form.address && form.phone && form.city && form.zip && form.email;

  if (!product) return <p className="text-center mt-10">No product selected! Please go back to the home page.</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl border">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h2>
        <p className="text-gray-500 mb-6">Complete your purchase by providing your details.</p>
        <div className="mb-6 p-4 border rounded-xl bg-gray-50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <p className="text-gray-500">{product.category}</p>
          </div>
          <p className="text-gray-800 font-bold text-2xl">₹{product.sellPrice}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Shipping Information</h3>
          <div>
            <input name="fullName" placeholder="Full Name" value={form.fullName} className="input" onChange={handleChange} required />
          </div>
          {/* 👈 Enhancement: Added Email Input Field */}
          <div>
            <input name="email" placeholder="Email Address" type="email" className="input" onChange={handleChange} required />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <input name="address" placeholder="Full Address" className="input" onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input name="city" placeholder="City" className="input" onChange={handleChange} required />
            </div>
            <div>
              <input name="zip" placeholder="ZIP Code" className="input" onChange={handleChange} required />
              {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
            </div>
          </div>
          <div>
            <input name="phone" placeholder="10-digit Phone Number" type="tel" className="input" onChange={handleChange} required />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          
          <button 
            type="submit" 
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!isFormValid || buyMutation.isLoading}
          >
            {buyMutation.isLoading ? 'Processing...' : `Place Order for ₹${product.sellPrice}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;