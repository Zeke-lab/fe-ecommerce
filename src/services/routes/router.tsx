import { createBrowserRouter, Navigate } from 'react-router';
import { AppConstantRoutes } from './path';
import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';

import SecureRoute from '../../components/auth/SecureRoute';
import LayoutWithAuth from '../../components/layout/LayoutWithAuth';
import Products from '@/pages/admin/Products';
import Orders from '@/pages/admin/Orders';
import Categories from '@/pages/admin/Categories';

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
      <SecureRoute>
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
]);
