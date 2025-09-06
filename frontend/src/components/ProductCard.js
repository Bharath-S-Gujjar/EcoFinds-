import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cartAPI } from '../utils/api';

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const [addingToCart, setAddingToCart] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      setAddingToCart(true);
      await cartAPI.addToCart(product._id, 1);
      alert('Item added to cart!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Navigate to BuyNow page with product data
    navigate('/buy-now', { 
      state: { 
        product: {
          ...product,
          seller: product.seller
        }
      } 
    });
  };

  return (
    <Link to={`/product/${product._id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        {/* Product Image */}
        <div className="aspect-w-16 aspect-h-12 bg-gray-200">
          <img
            src={
              product.images?.[0]?.startsWith('http') 
                ? product.images[0] 
                : `http://localhost:5000${product.images?.[0]}` || 'https://via.placeholder.com/400x300?text=Product+Image'
            }
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {product.title}
            </h3>
            <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full ml-2 flex-shrink-0">
              {product.condition}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-primary-600">
              ${product.price}
            </span>
            <span className="text-sm text-gray-500">
              {product.category}
            </span>
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={product.seller?.avatar || 'https://via.placeholder.com/32x32?text=U'}
                alt={product.seller?.username}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-600">
                {product.seller?.username}
              </span>
            </div>
            
            {isAuthenticated && (
              <div className="flex space-x-2">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="bg-primary-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={addingToCart}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
