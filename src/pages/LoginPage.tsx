import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { authService } from '../services/auth';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderNumber.trim()) {
      setError('Please enter your order number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Request PIN to be sent to email associated with order
      await authService.requestPinByOrderNumber(orderNumber);

      // Navigate to PIN verification page
      navigate('/verify-pin', { state: { orderNumber } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Order not found. Please check your order number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Basketo
          </h1>
          <p className="text-gray-600">
            Track your order
          </p>
        </div>

        {/* Login Card */}
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Enter Order Number
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Order Number
              </label>
              <input
                id="orderNumber"
                type="text"
                placeholder="ORDER-123456"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                You can find your order number in the confirmation email
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Sending PIN...' : 'Send me a PIN'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>How it works:</strong> Enter your order number, and we'll send a 6-digit PIN to the email address associated with your order.
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            Need help?{' '}
            <a href="mailto:support@basketo.com" className="text-blue-600 hover:text-blue-700">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
