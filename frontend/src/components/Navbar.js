import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingCartIcon,
  ShoppingBagIcon,
  UserIcon,
  PlusIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-gray-800">EcoFinds</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-primary-500 transition-colors"
            >
              Browse
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/add-product"
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-500 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Sell</span>
                </Link>
                <Link
                  to="/my-listings"
                  className="text-gray-600 hover:text-primary-500 transition-colors"
                >
                  My Listings
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-500 transition-colors"
                >
                  <ShoppingCartIcon className="w-4 h-4" />
                  <span>Cart</span>
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-500 transition-colors"
                >
                  <ShoppingBagIcon className="w-4 h-4" />
                  <span>Orders</span>
                </Link>
                <Link
                  to="/purchases"
                  className="text-gray-600 hover:text-primary-500 transition-colors"
                >
                  Purchases
                </Link>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-1 text-gray-600 hover:text-primary-500 transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>{user?.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-500 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-primary-500 transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-primary-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/add-product"
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Sell</span>
                  </Link>
                  <Link
                    to="/my-listings"
                    className="text-gray-600 hover:text-primary-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Listings
                  </Link>
                  <Link
                    to="/cart"
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCartIcon className="w-4 h-4" />
                    <span>Cart</span>
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingBagIcon className="w-4 h-4" />
                    <span>Orders</span>
                  </Link>
                  <Link
                    to="/purchases"
                    className="text-gray-600 hover:text-primary-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Purchases
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>{user?.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-600 hover:text-red-500 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-primary-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
