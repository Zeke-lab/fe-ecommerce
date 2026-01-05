import { createBrowserRouter, Navigate } from 'react-router';
import { AppConstantRoutes } from './path';
import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';
import Dashboard from '../../pages/admin/dashboard';

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
  {
    path: AppConstantRoutes.path.admin.dashboard,
    element: <Dashboard />,
  },
]);
