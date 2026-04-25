import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
// import ProductDetailModal from "./ProductDetailModal"; // 👈 1. REMOVE modal import
import SearchBar from "./SearchBar";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch";
import Chatbot from "./Chatbot";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { SearchX } from 'lucide-react';

const fetchProducts = async () => {
  const { data } = await axios.get("http://localhost:8081/api/products");
  return data;
};

function Home() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  // const [selectedProduct, setSelectedProduct] = useState(null); // 👈 2. REMOVE modal state
  const debouncedSearch = useDebouncedSearch(search);
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, isError } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });

  const deleteMutation = useMutation({
    mutationFn: ({ productId, sellerUsername }) => axios.delete(`http://localhost:8081/api/products/${productId}?sellerUsername=${sellerUsername}`),
    onSuccess: () => {
      toast.success("Product deleted!");
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => toast.error(err.response?.data || "Failed to delete product."),
  });

  const handleDelete = (productId, sellerUsername) => deleteMutation.mutate({ productId, sellerUsername });
  const handleBuy = (product) => navigate("/checkout", { state: { product } });
  
  // const handleCheckoutFromModal = (product) => { ... }; // 👈 3. REMOVE modal handler function

  useEffect(() => {
    const searchTerm = debouncedSearch.toLowerCase();
    const result = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      (product.description && product.description.toLowerCase().includes(searchTerm))
    );
    setFiltered(result);
  }, [debouncedSearch, products]);

  const handleChatbotFilter = (category) => {
    const result = products.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
    setFiltered(result);
    toast.success(result.length > 0 ? `Showing "${category}" products.` : `No products found for "${category}".`);
  };
  
  const handleChatbotSearch = (searchTerm) => setSearch(searchTerm);
  
  const skeletons = Array.from({ length: 8 }).map((_, i) => (
    <div key={i} className="bg-white p-4 rounded-xl shadow-md animate-pulse">
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-4" />
      <div className="h-10 bg-gray-200 rounded-full" />
    </div>
  ));
  
  if (isError) return <div className="p-6 text-center text-red-500 font-bold">❌ Error fetching products. Please try again later.</div>;

  return (
    <>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center p-8 mb-8 bg-white rounded-2xl shadow-sm">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-green-700">
              Give Electronics a Second Life
            </h1>
            <p className="text-gray-600 text-lg">Browse, buy, or recycle used electronics responsibly.</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <SearchBar search={search} onChange={(e) => setSearch(e.target.value)} />
            {user?.role === 'seller' && (
              <button onClick={() => navigate('/add-product')} className="bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-green-700 transition w-full md:w-auto">
                + Add New Product
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? skeletons : filtered.length > 0 
              ? filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onDelete={handleDelete}
                    onBuy={handleBuy}
                    // onCardClick={setSelectedProduct} // 👈 4. REMOVE this prop
                  />
                )) 
              : <div className="col-span-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl shadow-sm">
                  <SearchX className="text-gray-400 mb-4" size={48} />
                  <h3 className="text-xl font-semibold text-gray-700">No Products Found</h3>
                  <p className="text-gray-500">Try adjusting your search or check back later!</p>
                </div>
            }
          </div>
        </div>
        <Chatbot handleFilter={handleChatbotFilter} handleSearch={handleChatbotSearch} />
      </div>

      {/* <ProductDetailModal ... /> */} {/* 👈 5. REMOVE the modal component */}
    </>
  );
}

export default Home;