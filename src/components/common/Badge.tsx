import type { OrderStatus } from '../../types';

interface BadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  CREATED: { label: 'Created', color: 'bg-yellow-100 text-yellow-800' },
  PAID: { label: 'Paid', color: 'bg-green-100 text-green-800' },
  SHIPPED: { label: 'Shipped', color: 'bg-blue-100 text-blue-800' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

export const Badge = ({ status }: BadgeProps) => {
  const config = statusConfig[status];

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};
