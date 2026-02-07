/*
    This is a middleware route that checkes user is logged in or not
    If user is not logged in, redirect to login page
    ** Any routes that are wrapped with this component will be protected with authentication **
*/

import { useEffect } from 'react';
import { useIsUserAuthenticated } from '../../services/network/libs/auth';
import {
  cleanupAfterLogout,
  initAfterLogin,
} from '../../services/zustand/authStore';
import { Navigate } from 'react-router';
import { AppConstantRoutes } from '../../services/routes/path';
import type { Role } from '../../types/role';

type Props = {
  children: React.ReactNode;
  allowedRoles?: Role[];
};

const SecureRoute = (props: Props) => {
  const { children, allowedRoles } = props;

  const { data, isError, isSuccess, isLoading } = useIsUserAuthenticated();

  useEffect(() => {
    if (isSuccess && data) {
      console.log('success: ', data);
      initAfterLogin(data);
    }
  }, [isSuccess, data]);

  // Show loading state while checking authentication
  if (isLoading) {
    return null;
  }

  // If authentication check failed, redirect to login
  if (isError) {
    cleanupAfterLogout();
    return <Navigate to={AppConstantRoutes.path.auth.login} replace />;
  }

  // If authenticated successfully, check role authorization
  if (isSuccess && data) {
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = data.role as Role;
      const hasRequiredRole = allowedRoles.includes(userRole);

      if (!hasRequiredRole) {
        if (userRole === 'ADMIN') {
          return <Navigate to={AppConstantRoutes.path.admin.dashboard} replace />;
        } else {
          return <Navigate to={AppConstantRoutes.path.user.dashboard} replace />;
        }
      }
    }
    return children;
  }

  // Fallback: redirect to login if no data
  return <Navigate to={AppConstantRoutes.path.auth.login} replace />;
};

export default SecureRoute;
