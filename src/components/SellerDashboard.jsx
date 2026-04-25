import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Trash2, Box, IndianRupee } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchMyProducts = async (username) => {
  if (!username) return [];
  const { data } = await axios.get(`http://localhost:8081/api/products/seller/${username}`);
  return data;
};

function SellerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: myProducts = [], isLoading } = useQuery({
    queryKey: ['myProducts', user?.username],
    queryFn: () => fetchMyProducts(user?.username),
    enabled: !!user?.username,
  });

  const deleteMutation = useMutation({
    mutationFn: (productId) => axios.delete(`http://localhost:8081/api/products/${productId}?sellerUsername=${user.username}`),
    onSuccess: () => {
      toast.success("Product deleted!");
      queryClient.invalidateQueries({ queryKey: ['myProducts', user.username] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => toast.error(err.response?.data || "Failed to delete product."),
  });

  // 👈 Added confirmation before deleting
  const handleDelete = (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      deleteMutation.mutate(productId);
    }
  };

  const totalValue = myProducts.reduce((sum, p) => sum + (p.sellPrice || 0), 0);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your products and view your sales activity.</p>
        </div>
        <button onClick={() => navigate('/add-product')} className="flex items-center gap-2 bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-green-700 transition w-full sm:w-auto">
          <PlusCircle size={20} /> Add New Product
        </button>
      </div>

      {/* 👈 Redesigned Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-start gap-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-lg"><Box size={24}/></div>
          <div>
            <h3 className="font-semibold text-gray-500">Total Products Listed</h3>
            <p className="text-3xl font-bold text-gray-800">{myProducts.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-start gap-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-lg"><IndianRupee size={24}/></div>
          <div>
            <h3 className="font-semibold text-gray-500">Total Listing Value</h3>
            <p className="text-3xl font-bold text-gray-800">₹{totalValue.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
      
      {/* 👈 Redesigned Product Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-bold text-xl mb-4 text-gray-800">Your Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-semibold text-sm text-gray-600">Product</th>
                <th className="p-4 font-semibold text-sm text-gray-600 hidden sm:table-cell">Category</th>
                <th className="p-4 font-semibold text-sm text-gray-600">Price</th>
                <th className="p-4 font-semibold text-sm text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="4" className="p-4 text-center text-gray-500">Loading your products...</td></tr>
              ) : myProducts.length > 0 ? myProducts.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                    <img src={p.imageUrl} alt={p.name} className="h-10 w-10 object-cover rounded-md" />
                    <span>{p.name}</span>
                  </td>
                  <td className="p-4 text-gray-600 hidden sm:table-cell">{p.category}</td>
                  <td className="p-4 text-gray-600">₹{p.sellPrice.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(p.id, p.name)} className="text-red-500 hover:text-red-700 transition" title="Delete Product" disabled={deleteMutation.isLoading}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="p-10 text-center text-gray-500">You haven't listed any products yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;