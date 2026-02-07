import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../apiClient';
import { ApiConstantRoutes } from '../path';

type OrderStatus = 'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
}

export interface Order {
  id: number;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  items: OrderItem[];
}

export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderData {
  items: CreateOrderItem[];
}

// User orders hooks
export const useGetMyOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['get-my-orders'],
    queryFn: () => {
      return apiClient.get(ApiConstantRoutes.paths.orders.default);
    },
  });
};

export const useGetMyOrderById = (orderId: number, enabled: boolean = true) => {
  return useQuery<Order>({
    queryKey: ['get-my-order-by-id', orderId],
    queryFn: () => {
      return apiClient.get(`${ApiConstantRoutes.paths.orders.default}/${orderId}`);
    },
    enabled: enabled && orderId > 0,
  });
};

// Admin orders hooks
export const useGetAllOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['get-all-orders'],
    queryFn: () => {
      return apiClient.get(ApiConstantRoutes.paths.orders.admin);
    },
  });
};

// Mutations
export const createOrder = async (data: CreateOrderData): Promise<Order> => {
  return apiClient.post(ApiConstantRoutes.paths.orders.default, data);
};

export const deleteOrder = async (orderId: number) => {
  return apiClient.delete(`${ApiConstantRoutes.paths.orders.default}/${orderId}`);
};

export const updateOrderStatus = async (orderId: number, status: OrderStatus): Promise<Order> => {
  return apiClient.patch(`${ApiConstantRoutes.paths.orders.default}/${orderId}`, { status });
};
