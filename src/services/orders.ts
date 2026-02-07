import api from './api';
import type { OrderDetail } from '../types';

export const ordersService = {
  // Get all orders for authenticated user
  getUserOrders: async (): Promise<OrderDetail[]> => {
    const response = await api.get<OrderDetail[]>('/api/orders');
    return response.data;
  },
};
