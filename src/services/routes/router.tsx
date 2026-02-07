import { createBrowserRouter, Navigate } from 'react-router';
import { AppConstantRoutes } from './path';
import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';

import SecureRoute from '../../components/auth/SecureRoute';
import LayoutWithAuth from '../../components/layout/LayoutWithAuth';
import Products from '@/pages/admin/Products';
import Orders from '@/pages/admin/Orders';
import Categories from '@/pages/admin/Categories';
import MyOrders from '@/pages/user/MyOrders';
import BrowseProducts from '@/pages/user/BrowseProducts';
import Profile from '@/pages/user/Profile';

const handleDefaultRoute = () => {
  return <Navigate to={AppConstantRoutes.path.auth.login} />;
};

export const router = createBrowserRouter([
  {
    path: '*',
    element: handleDefaultRoute(),
  },
  {
    path: AppConstantRoutes.path.auth.login,
    element: <Login />,
  },
  {
    path: AppConstantRoutes.path.auth.register,
    element: <Register />,
  },
  // ** All the routes are all proctected by SecureRoute component **
  {
    path: AppConstantRoutes.path.admin.dashboard,
    element: (
      <SecureRoute allowedRoles={['ADMIN']}>
        <LayoutWithAuth />
      </SecureRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Navigate to={AppConstantRoutes.path.admin.products} replace />
        ),
      },
      {
        path: AppConstantRoutes.path.admin.products,
        element: <Products />,
      },
      {
        path: AppConstantRoutes.path.admin.orders,
        element: <Orders />,
      },
      {
        path: AppConstantRoutes.path.admin.categories,
        element: <Categories />,
      },
    ],
  },
  {
    path: AppConstantRoutes.path.user.dashboard,
    element: (
      <SecureRoute allowedRoles={['USER']}>
        <LayoutWithAuth />
      </SecureRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Navigate to={AppConstantRoutes.path.user.orders} replace />
        ),
      },
      {
        path: AppConstantRoutes.path.user.orders,
        element: <MyOrders />,
      },
      {
        path: AppConstantRoutes.path.user.browseProducts,
        element: <BrowseProducts />,
      },
      {
        path: AppConstantRoutes.path.user.profile,
        element: <Profile />,
      },
    ],
  },
]);
