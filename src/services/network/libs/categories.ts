import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../apiClient';
import { ApiConstantRoutes } from '../path';

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const useGetAllCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['get-all-categories'],
    queryFn: () => {
      return apiClient.get(ApiConstantRoutes.paths.categories.default);
    },
  });
};
