import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Recycle, LogOut, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('You have been logged out.');
    navigate('/');
  };
  
  const activeLinkStyle = { color: '#16a34a', fontWeight: '600' };

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to={user ? "/home" : "/"} className="flex items-center gap-2">
            <Recycle className="text-primary" size={28} />
            <span className="text-xl font-bold text-primary">GreenCycle</span>
          </NavLink>
          <div className="flex items-center gap-6">
            {user ? (
              <>
                {user.role === 'seller' && (
                  <NavLink to="/seller-dashboard" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-secondary font-medium hover:text-primary transition hidden sm:flex items-center gap-2">
                    <LayoutDashboard size={18} /> Seller Dashboard
                  </NavLink>
                )}
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-700 hidden sm:block">{user.username}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition">
                  <LogOut size={18} />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="font-semibold text-secondary hover:text-primary transition">
                  Login
                </NavLink>
                <NavLink to="/register" className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-hover transition">
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;