import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, User, Tag, ShoppingCart } from 'lucide-react';

// 👈 The modal now accepts an onCheckout function
function ProductDetailModal({ product, onClose, onCheckout }) {
  if (!product) return null;

  const handleCheckoutClick = () => {
    onCheckout(product);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-4xl relative flex flex-col md:flex-row overflow-hidden"
          style={{ maxHeight: '90vh' }}
        >
          {/* 👈 Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 z-10 bg-white/50 rounded-full p-1">
            <X size={24} />
          </button>

          {/* 👈 Left Column: Product Image */}
          <div className="w-full md:w-1/2 h-64 md:h-auto">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* 👈 Right Column: Product Info */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
            <div className="flex-grow">
              <p className="text-sm font-semibold text-green-600 mb-1">{product.category}</p>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h2>
              
              {/* 👈 Key Details Section */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 border">
                <h3 className="font-semibold text-gray-700 mb-3">Key Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-500" />
                    <span>Sold by: <strong>{product.sellerUsername}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-gray-500" />
                    <span>Condition: <strong>Used/Refurbished</strong></span>
                  </div>
                  {product.isVerified && (
                    <div className="flex items-center gap-2 text-green-700">
                      <ShieldCheck size={16} />
                      <strong>Admin Verified Product</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* 👈 Description Section */}
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 mb-6 whitespace-pre-wrap">{product.description}</p>
            </div>
            
            {/* 👈 Footer with Price and Checkout Button */}
            <div className="mt-auto pt-6 border-t flex items-center justify-between gap-4">
              <span className="text-4xl font-extrabold text-green-600">₹{product.sellPrice}</span>
              <motion.button 
                onClick={handleCheckoutClick}
                className="flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart size={20} />
                Proceed to Checkout
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ProductDetailModal;