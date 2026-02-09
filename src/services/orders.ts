import api from './api';
import type { OrderDetail } from '../types';

export const ordersService = {
  // Get all orders for authenticated user
  getUserOrders: async (): Promise<OrderDetail[]> => {
    const response = await api.get<OrderDetail[]>('/api/orders');
    return response.data;
  },

  // Get order by order number (public endpoint)
  getOrderByNumber: async (orderNumber: string): Promise<OrderDetail> => {
    const response = await api.get<OrderDetail>(`/api/orders/by-number/${orderNumber}`);
    return response.data;
  },
};
