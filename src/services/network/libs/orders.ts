import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../apiClient';
import { ApiConstantRoutes } from '../path';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  product?: {
    id: number;
    name: string;
  } | null;
}

export interface Order {
  id: number;
  status: OrderStatus;
  orderDate: string;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  } | null;
  items: OrderItem[];
}

export interface OrderItemPayload {
  productId: number;
  quantity: number;
}

export interface CreateOrderPayload {
  items: OrderItemPayload[];
}

export interface UpdateOrderPayload {
  status?: OrderStatus;
  items?: OrderItemPayload[];
}

export const useGetMyOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['get-my-orders'],
    queryFn: () => apiClient.get(ApiConstantRoutes.paths.orders.default),
  });
};

export const useGetAdminOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['get-admin-orders'],
    queryFn: () => apiClient.get(ApiConstantRoutes.paths.adminOrders.default),
  });
};

export const useGetOrderById = (
  orderId: number,
  isAdmin: boolean,
  enabled = true,
) => {
  const path = isAdmin
    ? ApiConstantRoutes.paths.adminOrders.detail(orderId)
    : ApiConstantRoutes.paths.orders.detail(orderId);

  return useQuery<Order>({
    queryKey: ['get-order-by-id', orderId, isAdmin],
    queryFn: () => apiClient.get(path),
    enabled: enabled && orderId > 0,
  });
};

export const createOrder = async (payload: CreateOrderPayload) => {
  return apiClient.post(ApiConstantRoutes.paths.orders.default, payload);
};

export const updateOrder = async (
  orderId: number,
  payload: UpdateOrderPayload,
) => {
  return apiClient.put(
    ApiConstantRoutes.paths.orders.detail(orderId),
    payload,
  );
};

export const deleteOrder = async (orderId: number) => {
  return apiClient.delete(ApiConstantRoutes.paths.orders.detail(orderId));
};

export const adminUpdateOrder = async (
  orderId: number,
  payload: UpdateOrderPayload,
) => {
  return apiClient.patch(
    ApiConstantRoutes.paths.adminOrders.detail(orderId),
    payload,
  );
};

export const adminDeleteOrder = async (orderId: number) => {
  return apiClient.delete(
    ApiConstantRoutes.paths.adminOrders.detail(orderId),
  );
};
