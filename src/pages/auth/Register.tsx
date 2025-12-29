import { Link } from 'react-router';
import { AppConstantRoutes } from '../../services/routes/path';
import Input from '../../components/Input';
import Button from '../../components/Button';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useCustomEvents } from '../../services/formik/hooks';
import { registerUser } from '../../services/network/libs/auth';

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const initialValues: RegisterFormValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema: yup.ObjectSchema<RegisterFormValues> = yup
    .object()
    .shape({
      name: yup.string().required('Name is required!'),
      email: yup
        .string()
        .email('Invalid email address!')
        .required('Email is required!'),
      password: yup
        .string()
        .required('Password is required!')
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password must be at most 20 characters')
        .matches(
          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        ),
      confirmPassword: yup
        .string()
        .required('Confirm password is required!')
        .test('passwords-match', 'Passwords must match', function (value) {
          return this.parent.password === value;
        }),
    });

  const onSubmit = async (values: RegisterFormValues) => {
    const response = await registerUser(values).catch((err) => {
      console.log('Registration error:', err);
    });

    if (response) {
      console.log('Registration successful:', response);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const { onInputChange } = useCustomEvents(formik);

  return (
    <div className='fade-in flex min-h-screen items-center justify-center  px-4 py-12'>
      <div className='w-full max-w-md'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold tracking-tight text-foreground'>
            Register Here
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            Register to create your account
          </p>
        </div>

        <div className='rounded-lg bg-white border border-zinc-300 p-8 shadow-sm'>
          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-card-foreground mb-2'
              >
                Name
              </label>
              <Input
                id='name'
                name='name'
                value={formik.values.name}
                error={formik.errors.name}
                onChange={onInputChange}
                placeholder='Enter your name'
              />
            </div>
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
                value={formik.values.email}
                error={formik.errors.email}
                onChange={onInputChange}
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
                onChange={onInputChange}
                error={formik.errors.password}
                value={formik.values.password}
                placeholder='Enter your password'
              />
            </div>
            <div>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium text-card-foreground mb-2'
              >
                Confirm Password
              </label>
              <Input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                error={formik.errors.confirmPassword}
                value={formik.values.confirmPassword}
                onChange={onInputChange}
                placeholder='Confirm your password'
              />
            </div>

            <Button type='submit' className='w-full' primary>
              Register
            </Button>
          </form>

          <div className='mt-6 text-center text-sm text-muted-foreground'>
            {'Already have an account? '}
            <Link
              to={AppConstantRoutes.path.auth.login}
              className='font-medium text-primary hover:text-primary/90 transition-colors'
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
