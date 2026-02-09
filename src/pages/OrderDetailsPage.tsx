import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ordersService } from '../services/orders';
import { OrderStatusDetails } from '../components/orders/OrderStatusDetails';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../utils/format';
import type { OrderStatus, OrderDetail } from '../types';

export const OrderDetailsPage = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const { userEmail, logout } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) {
        setError('No order number provided');
        setLoading(false);
        return;
      }

      try {
        const fetchedOrder = await ordersService.getOrderByNumber(orderNumber);
        setOrder(fetchedOrder);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-blue-600">Basketo</h1>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={() => navigate('/orders')} variant="primary">
              Back to Orders
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Order not found
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-blue-600">Basketo</h1>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Order Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The order you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/orders')} variant="primary">
              Back to Orders
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Timeline data based on order status
  const getTimelineSteps = (status: OrderStatus) => {
    const steps = [
      { label: 'Order Placed', completed: true },
      { label: 'Payment Confirmed', completed: status !== 'CREATED' },
      { label: 'Shipped', completed: status === 'SHIPPED' },
      { label: 'Delivered', completed: false },
    ];

    if (status === 'CANCELLED') {
      return [
        { label: 'Order Placed', completed: true },
        { label: 'Cancelled', completed: true },
      ];
    }

    return steps;
  };

  const timelineSteps = getTimelineSteps(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">Basketo</h1>
              {userEmail && (
                <p className="text-sm text-gray-600 mt-1">{userEmail}</p>
              )}
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/orders"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Orders
          </Link>
        </div>

        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Order {order.orderNumber}
              </h2>
              <p className="text-gray-600 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge status={order.status} />
          </div>
        </div>

        {/* Order Status Details */}
        <div className="mb-6">
          <OrderStatusDetails
            status={order.status}
            trackingNumber={order.status === 'SHIPPED' ? 'TRK-' + order.orderNumber.replace('ORDER-', '') : undefined}
            deliveredDate={order.status === 'DELIVERED' ? '2026-02-12' : undefined}
          />
        </div>
        {/* Order Timeline */}
        <Card className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Order Timeline
          </h3>
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"
              style={{ height: 'calc(100% - 2rem)' }}
            />

            <div className="space-y-8">
              {timelineSteps.map((step, index) => (
                <div key={index} className="relative flex items-start">
                  {/* Circle indicator */}
                  <div className="relative z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step.completed ? (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="ml-4 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        step.completed ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Order Items
              </h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0"
                  >
                    {/* Product image placeholder */}
                    <div className="shrink-0 w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                      📦
                    </div>

                    {/* Product details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-medium text-gray-900">
                        {item.productName}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {formatCurrency(item.unitPrice, order.currency)} each
                      </p>
                    </div>

                    {/* Item total */}
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(
                          item.unitPrice * item.quantity,
                          order.currency
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">
                      {formatCurrency(order.totalAmount * 0.9, order.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      {formatCurrency(order.totalAmount * 0.1, order.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      {formatCurrency(order.totalAmount, order.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Customer & Shipping Info */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Customer Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-sm text-gray-900 mt-1">{order.userEmail}</p>
                </div>
              </div>
            </Card>

            {/* Shipping Information */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Address
              </h3>
              {order.shippingAddress ? (
                <div className="space-y-1 text-sm text-gray-700">
                  <p className="font-medium">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.addressLine}</p>
                  <p>
                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-2">
                    <span className="text-gray-500">Phone:</span> {order.shippingAddress.phone}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No shipping address provided</p>
              )}
            </Card>

            {/* Payment Method */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Method
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-gray-900 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div className="text-sm text-gray-700">
                  <p>Ending in 4242</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.status !== 'CREATED' ? 'Paid' : 'Pending'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Need Help? */}
            <Card className="bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Have questions about your order? We're here to help!
              </p>
              <Link to="/contact">
                <Button variant="primary" size="sm" className="w-full">
                  Contact Support
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Basketo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
