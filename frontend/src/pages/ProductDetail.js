import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI, cartAPI } from '../utils/api';

const ProductDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProduct(id);
      setProduct(response.data);
    } catch (error) {
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
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

  const handleBuyNow = async () => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">❌</div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">Product not found</h3>
        <p className="text-gray-600 mb-4">The product you're looking for doesn't exist</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Back to Browse
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-w-16 aspect-h-12 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/600x400?text=Product+Image'}
              alt={product.title}
              className="w-full h-96 object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.title} ${index + 2}`}
                  className="w-full h-20 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl font-bold text-primary-600">${product.price}</span>
              <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                {product.condition}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {product.category}
              </span>
            </div>
            <p className="text-gray-600 text-lg">{product.description}</p>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Sold by</h3>
            <div className="flex items-center space-x-3">
              <img
                src={product.seller?.avatar || 'https://via.placeholder.com/48x48?text=U'}
                alt={product.seller?.username}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{product.seller?.username}</p>
                <p className="text-sm text-gray-600">
                  Member since {new Date(product.seller?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Product Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Category:</span>
                <span className="ml-2 font-medium">{product.category}</span>
              </div>
              <div>
                <span className="text-gray-600">Condition:</span>
                <span className="ml-2 font-medium">{product.condition}</span>
              </div>
              {product.location && (
                <div>
                  <span className="text-gray-600">Location:</span>
                  <span className="ml-2 font-medium">{product.location}</span>
                </div>
              )}
              <div>
                <span className="text-gray-600">Views:</span>
                <span className="ml-2 font-medium">{product.views}</span>
              </div>
            </div>
            {product.tags && product.tags.length > 0 && (
              <div>
                <span className="text-gray-600">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {product.isAvailable ? (
              <>
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full bg-primary-500 text-white py-3 px-6 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={addingToCart}
                  className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart ? 'Processing...' : 'Buy Now'}
                </button>
              </>
            ) : (
              <div className="w-full bg-gray-300 text-gray-600 py-3 px-6 rounded-lg text-center">
                This item has been sold
              </div>
            )}
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
