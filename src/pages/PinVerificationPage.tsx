import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { authService } from '../services/auth';
import { ordersService } from '../services/orders';

export const PinVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderNumber = (location.state as { orderNumber?: string })?.orderNumber;

  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to login if no order number
  if (!orderNumber) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pin.trim()) {
      setError('Please enter the PIN');
      return;
    }

    if (pin.length !== 6) {
      setError('PIN must be 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First, get the order to find out the email
      const order = await ordersService.getOrderByNumber(orderNumber);

      // Verify PIN with the email from the order
      const response = await authService.verifyPin(order.userEmail, pin);

      if (response.success) {
        // Navigate to order details page
        navigate(`/order/${orderNumber}`);
      } else {
        setError('Invalid PIN. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendPin = async () => {
    setLoading(true);
    setError('');

    try {
      await authService.requestPinByOrderNumber(orderNumber);
      setError('');
      // Show success message (you could add a success state here)
      alert('PIN resent successfully! Please check your email.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend PIN');
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
            Verify your order
          </p>
        </div>

        {/* PIN Verification Card */}
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Enter PIN
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent a 6-digit PIN to the email address associated with order{' '}
            <strong className="text-blue-600">{orderNumber}</strong>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                6-Digit PIN
              </label>
              <input
                id="pin"
                type="text"
                placeholder="000000"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
                maxLength={6}
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Check your email for the PIN code
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
              disabled={loading || pin.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify PIN'}
            </Button>

            <button
              type="button"
              onClick={handleResendPin}
              disabled={loading}
              className="w-full text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
            >
              Didn't receive the PIN? Resend
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to order number
            </button>
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
