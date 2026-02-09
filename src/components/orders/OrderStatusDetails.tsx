import { ORDER_STATUS_INFO, type OrderStatus } from '../../constants/orderStatuses';

interface OrderStatusDetailsProps {
  status: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
  deliveryAddress?: string;
}

export function OrderStatusDetails({
  status,
  trackingNumber,
  carrier,
  estimatedDelivery,
  deliveredDate,
  deliveryAddress,
}: OrderStatusDetailsProps) {
  const statusInfo = ORDER_STATUS_INFO[status];

  if (!statusInfo) {
    return null;
  }

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    red: 'bg-red-50 border-red-200 text-red-900',
  };

  return (
    <div className={`rounded-lg border-2 p-6 ${colorClasses[statusInfo.color]}`}>
      {/* Title */}
      <h2 className="text-2xl font-bold mb-3">{statusInfo.title}</h2>

      {/* Description */}
      <p className="text-lg mb-4">{statusInfo.description}</p>

      {/* Tracking Information (for SHIPPED status) */}
      {statusInfo.showTracking && trackingNumber && (
        <div className="bg-white rounded-lg p-4 mb-4 border border-blue-200">
          <div className="grid gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">Tracking Number:</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-mono">{trackingNumber}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(trackingNumber)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
            {carrier && (
              <div>
                <p className="text-sm font-semibold text-gray-700">Carrier:</p>
                <p>{carrier}</p>
              </div>
            )}
            {estimatedDelivery && (
              <div>
                <p className="text-sm font-semibold text-gray-700">Estimated Delivery:</p>
                <p>{estimatedDelivery}</p>
              </div>
            )}
          </div>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Track Package
          </button>
        </div>
      )}

      {/* Delivery Information (for DELIVERED status) */}
      {status === 'DELIVERED' && deliveredDate && (
        <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
          <div className="grid gap-2">
            <div>
              <p className="text-sm font-semibold text-gray-700">Delivered On:</p>
              <p>{deliveredDate}</p>
            </div>
            {deliveryAddress && (
              <div>
                <p className="text-sm font-semibold text-gray-700">Delivered To:</p>
                <p>{deliveryAddress}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* What's Next */}
      {statusInfo.whatNext && (
        <div className="mb-4">
          <p className="font-semibold mb-1">What's Next:</p>
          <p>{statusInfo.whatNext}</p>
        </div>
      )}

      {/* Estimated Time */}
      {statusInfo.estimatedTime && (
        <div className="text-sm opacity-80">
          <p className="font-semibold">Estimated Time:</p>
          <p>{statusInfo.estimatedTime}</p>
        </div>
      )}

      {/* Feedback for Delivered Orders */}
      {statusInfo.showFeedback && (
        <div className="mt-4 pt-4 border-t border-green-300">
          <p className="font-semibold mb-3">How Was Your Experience?</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="text-3xl hover:scale-110 transition-transform"
              >
                ⭐
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Support Link */}
      <div className="mt-4 pt-4 border-t border-current border-opacity-20">
        <p className="text-sm">
          Need help? <a href="/contact" className="underline font-semibold">Contact our support team</a>
        </p>
      </div>
    </div>
  );
}
