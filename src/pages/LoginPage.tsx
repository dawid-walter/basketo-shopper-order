import { useNavigate } from 'react-router-dom';
import { PinLoginForm } from '../components/auth/PinLoginForm';
import { Card } from '../components/common/Card';

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/orders');
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
            View your orders
          </p>
        </div>

        {/* Login Card */}
        <Card>
          <PinLoginForm onSuccess={handleLoginSuccess} />
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
