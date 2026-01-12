import { Link, useNavigate } from 'react-router';
import { AppConstantRoutes } from '../../services/routes/path';
import Input from '../../components/Input';

import * as yup from 'yup';
import { useFormik } from 'formik';
import { useCustomEvents } from '../../services/formik/hooks';
import { registerUser } from '../../services/network/libs/auth';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();

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
      // if registeration is successful, navigate to login page
      console.log('Registration successful:', response);
      navigate(AppConstantRoutes.path.auth.login);

      /*
        Optional: Call Login endpoint here directly after registration, so that user doesn't have to login again manually.
      */
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
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            <div>
              <Label htmlFor='name' className=' mb-3'>
                Name
              </Label>

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
              <Label htmlFor='email' className=' mb-3'>
                Email
              </Label>
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
              <Label htmlFor='password' className=' mb-3'>
                Password
              </Label>
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
              <Label htmlFor='confirmPassword' className=' mb-3'>
                Confirm Password
              </Label>
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

            {/* <Button type='submit' className='w-full' primary>
              Register
            </Button> */}

            <Button type='submit' className='w-full'>
              Register
            </Button>
            <p className='text-sm text-center text-muted-foreground'>
              Already have an account?{' '}
              <Link
                to={AppConstantRoutes.path.auth.login}
                className='text-primary hover:underline'
              >
                Login here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
