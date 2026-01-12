import { Link, useNavigate } from 'react-router';
import { AppConstantRoutes } from '../../services/routes/path';
import Input from '../../components/Input';
// import Button from '../../components/Button';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useCustomEvents } from '../../services/formik/hooks';
import { loginUser } from '../../services/network/libs/auth';
import { initAfterLogin } from '../../services/zustand/authStore';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  const validationSchema: yup.ObjectSchema<LoginFormValues> = yup
    .object()
    .shape({
      email: yup
        .string()
        .email('Invalid email address!')
        .required('Email is required!'),
      password: yup.string().required('Password is required!'),
    });

  const onSubmit = async (values: LoginFormValues) => {
    const response = await loginUser(values).catch((err) =>
      console.log('Login error:', err),
    );

    if (response) {
      initAfterLogin(response);
      navigate(AppConstantRoutes.path.admin.products);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const { onInputChange } = useCustomEvents<LoginFormValues>(formik);

  return (
    <div className='fade-in flex min-h-screen items-center justify-center  px-4 py-12'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className='space-y-6' onSubmit={formik.handleSubmit}>
            <div>
              <Label htmlFor='email' className='mb-3'>
                {' '}
                Email
              </Label>
              <Input
                id='email'
                name='email'
                onChange={onInputChange}
                value={formik.values.email}
                error={formik.errors.email}
                placeholder='Enter your email'
              />
            </div>

            <div>
              <Label htmlFor='password' className='mb-3'>
                {' '}
                Password
              </Label>

              <Input
                id='password'
                name='password'
                type='password'
                value={formik.values.password}
                onChange={onInputChange}
                error={formik.errors.password}
                placeholder='Enter your password'
              />
            </div>
            {/* 
            <Button type='submit' className='w-full' primary>
              Sign In
            </Button> */}
            <Button type='submit' className='w-full'>
              Sign in
            </Button>
            <p className='text-sm text-center text-muted-foreground'>
              Don't have an account?{' '}
              <Link
                to={AppConstantRoutes.path.auth.register}
                className='text-primary hover:underline'
              >
                Register here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
