import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LoaderCircle, ShieldCheck, User, Tag, ShoppingCart, ArrowLeft } from 'lucide-react';

// 👈 Function to fetch a single product by its ID
const fetchProductById = async (productId) => {
  const { data } = await axios.get(`http://localhost:8081/api/products/${productId}`);
  return data;
};

function ProductDetailPage() {
  const { productId } = useParams(); // 👈 Get the product ID from the URL
  const navigate = useNavigate();

  // 👈 Use React Query to fetch data for this specific product
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', productId], // A unique key for this product
    queryFn: () => fetchProductById(productId),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold text-red-500">Product Not Found</h2>
        <button onClick={() => navigate('/home')} className="mt-4 text-primary hover:underline">Go back to Home</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary font-semibold mb-6 hover:text-primary">
            <ArrowLeft size={20} /> Back to Products
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Image */}
          <div className="lg:w-1/2">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:w-1/2">
            <p className="text-sm font-semibold text-primary mb-1">{product.category}</p>
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            
            <div className="mt-4 text-4xl font-extrabold text-gray-900">
              ₹{product.sellPrice}
            </div>

            <div className="mt-6 bg-gray-50 rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-700 mb-3">Key Details</h3>
              <div className="space-y-2 text-sm text-secondary">
                <div className="flex items-center gap-2"><User size={16} /><span>Sold by: <strong>{product.sellerUsername}</strong></span></div>
                <div className="flex items-center gap-2"><Tag size={16} /><span>Condition: <strong>Used/Refurbished</strong></span></div>
                {product.isVerified && <div className="flex items-center gap-2 text-primary"><ShieldCheck size={16} /><strong>Admin Verified Product</strong></div>}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-secondary whitespace-pre-wrap leading-relaxed">{product.description}</p>
            </div>

            <div className="mt-8">
                <button onClick={() => navigate('/checkout', { state: { product } })} className="w-full flex items-center justify-center gap-3 bg-primary text-white font-bold py-4 px-6 rounded-lg hover:bg-primary-hover transition duration-300 shadow-md">
                  <ShoppingCart size={20} /> Buy Now
                </button>
            </div>
          </div>
        </div>

        {/* Placeholder for Reviews Section like Amazon */}
        <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
            <p className="text-secondary mt-4">(Review section coming soon)</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;