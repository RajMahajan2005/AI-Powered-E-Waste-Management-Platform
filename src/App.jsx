import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import AddProduct from "./components/AddProduct";
import Checkout from "./components/Checkout";
import OrderSuccess from "./components/OrderSucess";
import SellerDashboard from "./components/SellerDashboard";
import ProductDetailPage from "./pages/ProductDetailPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} /> {/* 👈 2. Add this new route */}
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;