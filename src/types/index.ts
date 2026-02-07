// Order types
export interface Order {
  id: string;
  userEmail: string;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
  itemsSummary: string;
}

export interface OrderDetail {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export type OrderStatus = 'CREATED' | 'PAID' | 'SHIPPED' | 'CANCELLED';

// Auth types
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// User types
export interface AuthUser {
  email: string;
  role: 'ROLE_ADMIN';
}

// API Error type
export interface ApiError {
  message: string;
  status: number;
}

// Dashboard stats
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: {
    created: number;
    paid: number;
    shipped: number;
    cancelled: number;
  };
}
