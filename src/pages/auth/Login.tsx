import { Link, useNavigate } from 'react-router';
import { AppConstantRoutes } from '../../services/routes/path';
import Input from '../../components/Input';
import Button from '../../components/Button';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useCustomEvents } from '../../services/formik/hooks';
import { loginUser } from '../../services/network/libs/auth';
import { initAfterLogin } from '../../services/zustand/authStore';

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
      navigate(AppConstantRoutes.path.admin.dashboard);
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
      <div className='w-full max-w-md'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold tracking-tight text-foreground'>
            Welcome back
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            Sign in to your account to continue
          </p>
        </div>

        <div className='rounded-lg bg-white border border-zinc-300 p-8 shadow-sm'>
          <form className='space-y-6' onSubmit={formik.handleSubmit}>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-card-foreground mb-2'
              >
                Email
              </label>
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
              <label
                htmlFor='password'
                className='block text-sm font-medium text-card-foreground mb-2'
              >
                Password
              </label>
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

            <Button type='submit' className='w-full' primary>
              Sign In
            </Button>
          </form>

          <div className='mt-6 text-center text-sm text-muted-foreground'>
            {"Don't have an account? "}
            <Link
              to={AppConstantRoutes.path.auth.register}
              className='font-medium text-primary hover:text-primary/90 transition-colors'
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
