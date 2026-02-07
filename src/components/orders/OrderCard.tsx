import type { OrderDetail } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/format';

interface OrderCardProps {
  order: OrderDetail;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              Order #{order.id}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge status={order.status} />
        </div>

        {/* Items */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Items</h4>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-gray-900 font-medium">
                    {item.productName}
                  </span>
                  <span className="text-gray-500 ml-2">
                    x{item.quantity}
                  </span>
                </div>
                <span className="text-gray-700 font-medium ml-4">
                  {formatCurrency(item.unitPrice * item.quantity, order.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-gray-900">
              Total
            </span>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(order.totalAmount, order.currency)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
