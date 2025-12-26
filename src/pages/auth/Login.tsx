import { Link } from 'react-router';
import { AppConstantRoutes } from '../../services/routes/path';
import Input from '../../components/Input';
import Button from '../../components/Button';

const Login = () => {
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
          <form className='space-y-6'>
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
