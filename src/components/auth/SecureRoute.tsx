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
import type { Role } from '@/types/role';
import { Roles } from '@/types/role';

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

  // If authenticated successfully, render children
  if (isSuccess && data) {
    const userRole = data.role as Role;

    if (allowedRoles && allowedRoles.length > 0) {
      const hasRequiredRole = allowedRoles.includes(userRole);

      if (!hasRequiredRole) {
        const redirectPath =
          userRole === Roles.ADMIN
            ? AppConstantRoutes.path.admin.dashboard
            : AppConstantRoutes.path.user.dashboard;

        return <Navigate to={redirectPath} replace />;
      }
    }

    return children;
  }

  // Fallback: redirect to login if no data
  return <Navigate to={AppConstantRoutes.path.auth.login} replace />;
};

export default SecureRoute;
