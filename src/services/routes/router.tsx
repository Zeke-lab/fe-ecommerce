import { createBrowserRouter, Navigate } from 'react-router';
import { AppConstantRoutes } from './path';
import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';
import Dashboard from '../../pages/admin/Dashboard';
import SecureRoute from '../../components/auth/SecureRoute';
import LayoutWithAuth from '../../components/layout/LayoutWithAuth';

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
    path: AppConstantRoutes.path.default,
    element: (
      <SecureRoute>
        <LayoutWithAuth />
      </SecureRoute>
    ),
    children: [
      {
        path: AppConstantRoutes.path.admin.dashboard,
        element: <Dashboard />,
      },
    ],
  },
]);
