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

type Props = {
  children: React.ReactNode;
};

const SecureRoute = (props: Props) => {
  const { children } = props;

  const { data, isError, isSuccess } = useIsUserAuthenticated();

  useEffect(() => {
    if (isSuccess) {
      console.log('success: ', data);
      initAfterLogin(data);
    }
  }, [isSuccess, data]);

  if (isError) {
    cleanupAfterLogout();
    return <Navigate to={AppConstantRoutes.path.auth.login} replace />;
  }

  if (isSuccess) {
    console.log('data in secure route: ', data);
    if (data) {
      return children;
    }
  } else {
    return <Navigate to={'/'} replace />;
  }

  return null;
};

export default SecureRoute;
