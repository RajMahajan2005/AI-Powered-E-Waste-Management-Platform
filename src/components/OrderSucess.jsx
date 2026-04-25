import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle } from "lucide-react";

function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;
  const form = state?.form;

  useEffect(() => {
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
  }, []);

  if (!product || !form) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold">Thank you for your order!</h2>
        <button onClick={() => navigate("/home")} className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-center p-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
        className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border w-full max-w-2xl"
      >
        <CheckCircle className="text-green-500 h-16 w-16 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you, <strong>{form.fullName}</strong>. Your order is confirmed and will be shipped soon.
        </p>

        <div className="text-left bg-gray-50 p-6 rounded-xl border space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700">Order Summary</h3>
            <p className="text-gray-600">{product.name} - <strong>₹{product.sellPrice}</strong></p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Shipping To</h3>
            <p className="text-gray-600">{form.address}, {form.city} - {form.zip}</p>
            <p className="text-gray-600">Contact: {form.phone}</p>
          </div>
        </div>
        
        <button
          onClick={() => navigate("/home")}
          className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg transition"
        >
          Continue Shopping
        </button>
      </motion.div>
    </div>
  );
}

export default OrderSuccess;