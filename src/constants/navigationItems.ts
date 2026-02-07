import { AppConstantRoutes } from '@/services/routes/path';
import { Box, Layers2, Van, ShoppingBag, Search, User } from 'lucide-react';
import type { Role } from '@/types/role';
import type { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
}

export const navigationItems: NavigationItem[] = [
  {
    title: 'Products',
    href: AppConstantRoutes.path.admin.products,
    icon: Box,
    roles: ['ADMIN'],
  },
  {
    title: 'Categories',
    href: AppConstantRoutes.path.admin.categories,
    icon: Layers2,
    roles: ['ADMIN'],
  },
  {
    title: 'Orders',
    href: AppConstantRoutes.path.admin.orders,
    icon: Van,
    roles: ['ADMIN'],
  },
  {
    title: 'My Orders',
    href: AppConstantRoutes.path.user.orders,
    icon: ShoppingBag,
    roles: ['USER'],
  },
  {
    title: 'Browse Products',
    href: AppConstantRoutes.path.user.browseProducts,
    icon: Search,
    roles: ['USER'],
  },
  {
    title: 'Profile',
    href: AppConstantRoutes.path.user.profile,
    icon: User,
    roles: ['USER'],
  },
];

export const getNavigationItemsByRole = (role: Role): NavigationItem[] =>
  navigationItems.filter((item) => item.roles.includes(role));
