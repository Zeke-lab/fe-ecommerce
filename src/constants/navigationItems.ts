import { AppConstantRoutes } from '@/services/routes/path';
import { Box, Layers2, Van } from 'lucide-react';

export const navigationItems = [
  {
    title: 'Products',
    href: AppConstantRoutes.path.admin.products,
    icon: Box,
  },
  {
    title: 'Categories',
    href: AppConstantRoutes.path.admin.categories,
    icon: Layers2,
  },
  {
    title: 'Orders',
    href: AppConstantRoutes.path.admin.orders,
    icon: Van,
  },
];
