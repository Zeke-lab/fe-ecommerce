import { AppConstantRoutes } from '@/services/routes/path';
import type { Role } from '@/types/role';
import { Roles } from '@/types/role';
import type { LucideIcon } from 'lucide-react';
import { Box, Layers2, ShoppingBag, Store, UserRound, Van } from 'lucide-react';

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
    roles: [Roles.ADMIN],
  },
  {
    title: 'Categories',
    href: AppConstantRoutes.path.admin.categories,
    icon: Layers2,
    roles: [Roles.ADMIN],
  },
  {
    title: 'Orders',
    href: AppConstantRoutes.path.admin.orders,
    icon: Van,
    roles: [Roles.ADMIN],
  },
  {
    title: 'My Orders',
    href: AppConstantRoutes.path.user.orders,
    icon: ShoppingBag,
    roles: [Roles.USER],
  },
  {
    title: 'Browse Products',
    href: AppConstantRoutes.path.user.browseProducts,
    icon: Store,
    roles: [Roles.USER],
  },
  {
    title: 'Profile',
    href: AppConstantRoutes.path.user.profile,
    icon: UserRound,
    roles: [Roles.USER],
  },
];

export const getNavigationItemsByRole = (role: Role) =>
  navigationItems.filter((item) => item.roles.includes(role));
