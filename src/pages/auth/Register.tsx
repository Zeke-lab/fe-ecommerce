import { Link } from 'react-router';
import { AppConstantRoutes } from '../../services/routes/path';
import Input from '../../components/Input';
import Button from '../../components/Button';

const Register = () => {
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
          <form className='space-y-6'>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-card-foreground mb-2'
              >
                Name
              </label>
              <Input id='name' name='name' placeholder='Enter your name' />
            </div>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-card-foreground mb-2'
              >
                Email
              </label>
              <Input id='email' name='email' placeholder='Enter your email' />
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
