import React, { useState, useEffect } from 'react';
import { purchasesAPI } from '../utils/api';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [activeTab, setActiveTab] = useState('purchases');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [purchasesResponse, salesResponse] = await Promise.all([
        purchasesAPI.getPurchaseHistory(),
        purchasesAPI.getSalesHistory()
      ]);
      setPurchases(purchasesResponse.data.purchases);
      setSales(salesResponse.data.sales);
    } catch (error) {
      setError('Failed to fetch purchase history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Purchase History</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('purchases')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'purchases'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Purchases ({purchases.length})
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sales'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Sales ({sales.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'purchases' ? (
        <div className="space-y-4">
          {purchases.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🛍️</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No purchases yet</h3>
              <p className="text-gray-600">Your purchase history will appear here</p>
            </div>
          ) : (
            purchases.map((purchase) => (
              <div key={purchase._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Order #{purchase._id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(purchase.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ${purchase.totalAmount.toFixed(2)}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(purchase.status)}`}>
                      {purchase.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={purchase.seller?.avatar || 'https://via.placeholder.com/32x32?text=U'}
                      alt={purchase.seller?.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-gray-600">
                      Sold by {purchase.seller?.username}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {purchase.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <img
                          src={item.product.images?.[0] || 'https://via.placeholder.com/40x40?text=Image'}
                          alt={item.product.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.product.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity} × ${item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sales.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💰</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No sales yet</h3>
              <p className="text-gray-600">Your sales history will appear here</p>
            </div>
          ) : (
            sales.map((sale) => (
              <div key={sale._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Sale #{sale._id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(sale.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ${sale.totalAmount.toFixed(2)}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sale.status)}`}>
                      {sale.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={sale.buyer?.avatar || 'https://via.placeholder.com/32x32?text=U'}
                      alt={sale.buyer?.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-gray-600">
                      Sold to {sale.buyer?.username}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {sale.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <img
                          src={item.product.images?.[0] || 'https://via.placeholder.com/40x40?text=Image'}
                          alt={item.product.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.product.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity} × ${item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Purchases;
