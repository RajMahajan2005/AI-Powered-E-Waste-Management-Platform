import React from "react";
import { Search } from 'lucide-react';

function SearchBar({ search, onChange }) {
  return (
    <div className="relative w-full md:w-1/2">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        value={search}
        onChange={onChange}
        placeholder="Search for mobiles, laptops, or models..."
        className="w-full px-12 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
      />
    </div>
  );
}

export default SearchBar;