import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CheckCircle, UploadCloud } from 'lucide-react';
import { useDropzone } from 'react-dropzone'; // 👈 1. Import for drag-and-drop
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const addProduct = async (productData) => {
  const { data } = await axios.post("http://localhost:8081/api/products", productData);
  return data;
};

// 👈 2. Predefined categories for the dropdown
const categories = ["Mobiles", "Laptops", "Tablets", "Cameras", "Accessories", "Televisions", "Other"];

const AddProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const DESCRIPTION_MAX_LENGTH = 500;

  const [product, setProduct] = useState({
    name: '',
    category: '', // Will be set from dropdown
    buyPrice: '',
    sellPrice: '',
    sellerUsername: '',
    description: '',
  });
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProduct(p => ({ ...p, sellerUsername: user.username }));
    }
  }, [user]);
  
  // Real-time validation (no changes needed here)
  useEffect(() => {
    const newErrors = {};
    const buyPrice = parseFloat(product.buyPrice);
    const sellPrice = parseFloat(product.sellPrice);

    if (buyPrice < 0) newErrors.buyPrice = "Price cannot be negative.";
    if (sellPrice < 0) newErrors.sellPrice = "Price cannot be negative.";
    if (buyPrice && sellPrice && sellPrice <= buyPrice) {
      newErrors.sellPrice = "Sell price must be greater than buy price.";
    }
    if (product.description.length > DESCRIPTION_MAX_LENGTH) {
      newErrors.description = `Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters.`;
    }
    setErrors(newErrors);
  }, [product]);

  const mutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      toast.success('Product added successfully!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (user) queryClient.invalidateQueries({ queryKey: ['myProducts', user.username] });
      navigate("/seller-dashboard");
    },
    onError: (error) => toast.error('Backend error or incorrect format.'),
  });

  const handleChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });
  
  // 👈 3. Logic for the new drag-and-drop uploader
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setImageDataUrl(reader.result);
      reader.onerror = () => toast.error("Failed to read image file.");
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif'] },
    multiple: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return toast.error("Please fix the errors before submitting.");
    if (!imageDataUrl) return toast.error('Please select a product image.');
    
    const productData = { ...product, buyPrice: parseFloat(product.buyPrice), sellPrice: parseFloat(product.sellPrice), imageUrl: imageDataUrl };
    mutation.mutate(productData);
  };
  
  const isFormValid = Object.keys(errors).length === 0 && product.name && product.category && product.buyPrice && product.sellPrice && product.description && imageDataUrl;

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">List a New Item</h2>
          <p className="text-gray-500">Fill in the details below to put your item up for sale.</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
          <p className="text-sm text-center text-gray-600 bg-green-50 p-3 rounded-lg">You are listing this item as: <strong>{user?.username || '...'}</strong></p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input name="name" value={product.name} onChange={handleChange} className="input mt-1" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              {/* 👈 4. Replaced text input with a dropdown */}
              <select name="category" value={product.category} onChange={handleChange} className="input mt-1" required>
                <option value="" disabled>Select a category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <span className={`text-sm ${product.description.length > DESCRIPTION_MAX_LENGTH ? 'text-red-500' : 'text-gray-400'}`}>
                {product.description.length}/{DESCRIPTION_MAX_LENGTH}
              </span>
            </div>
            <textarea name="description" value={product.description} onChange={handleChange} className="input mt-1 w-full" rows="4" placeholder="e.g., Model, Condition, Specs, any defects" required></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Buy Price (₹)</label>
              <input name="buyPrice" value={product.buyPrice} onChange={handleChange} type="number" step="0.01" className="input mt-1" required />
              {errors.buyPrice && <p className="text-red-500 text-xs mt-1">{errors.buyPrice}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Sell Price (₹)</label>
              <input name="sellPrice" value={product.sellPrice} onChange={handleChange} type="number" step="0.01" className="input mt-1" required />
              {errors.sellPrice && <p className="text-red-500 text-xs mt-1">{errors.sellPrice}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            {/* 👈 5. The new drag-and-drop component */}
            <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'}`}>
              <input {...getInputProps()} />
              {imageDataUrl ? (
                <img src={imageDataUrl} alt="Preview" className="h-32 w-auto mx-auto rounded-lg object-contain" />
              ) : (
                <div className="text-gray-500">
                  <UploadCloud className="mx-auto h-12 w-12" />
                  <p className="mt-2">Drag & drop an image here, or click to select a file</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-2">
            <motion.button type="submit" disabled={!isFormValid || mutation.isLoading} className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-hover transition disabled:bg-gray-400 disabled:cursor-not-allowed">
              {mutation.isLoading ? 'Listing Item...' : 'Add Product'}
              {mutation.isLoading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"/> : <CheckCircle />}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProduct;