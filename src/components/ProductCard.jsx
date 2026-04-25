import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Trash2, ShieldCheck, User } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 👈 1. Import useNavigate

// 👈 2. Remove the onCardClick prop
function ProductCard({ product, onDelete, onBuy }) {
  const navigate = useNavigate(); // 👈 3. Initialize navigate
  const { user } = useAuth();
  
  const handleBuy = (e) => {
    e.stopPropagation();
    onBuy(product);
  };
  
  const isOwner = user?.role === 'seller' && user.username === product.sellerUsername;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col cursor-pointer"
      whileHover={{ y: -5 }}
      layout
      onClick={() => navigate(`/product/${product.id}`)} // 👈 4. Change onClick to navigate to the new page
    >
      <div className="w-full h-48 overflow-hidden relative">
        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {isOwner && (
          <button onClick={(e) => { e.stopPropagation(); onDelete(product.id, user.username); }} className="absolute top-3 right-3 bg-red-100 text-red-600 rounded-full p-2 hover:bg-red-500 hover:text-white transition-colors" title="Delete Product">
            <Trash2 size={18} />
          </button>
        )}
        {product.isVerified && (
          <div className="absolute top-3 left-3 bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <ShieldCheck size={14} /> Verified
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <p className="text-sm text-secondary">{product.category}</p>
        <h3 className="text-lg font-semibold text-gray-900 mt-1 truncate">{product.name}</h3>
        
        <div className="flex items-center gap-1.5 text-xs text-secondary mt-2">
          <User size={12} />
          <span>{product.sellerUsername}</span>
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 mt-4">
          <span className="text-2xl font-bold text-gray-900">₹{product.sellPrice}</span>
          <motion.button onClick={handleBuy} className="bg-primary text-white font-semibold px-5 py-2.5 rounded-lg" whileHover={{ scale: 1.05, backgroundColor: "var(--primary-hover)" }} whileTap={{ scale: 0.95 }}>
            Buy
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;