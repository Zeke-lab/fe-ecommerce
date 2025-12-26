import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  loading?: boolean;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  primary?: boolean;
  secondary?: boolean;
  danger?: boolean;
  outline?: boolean;
}

const Spinner = () => {
  return <LoaderCircle className='w-7 h-7 animate-spin text-white' />;
};

const Button: React.FC<ButtonProps> = (props) => {
  const {
    className,
    loading = false,
    children,
    primary,
    secondary,
    danger,
    outline,
    disabled,
    ...rest
  } = props;

  return (
    <button
      {...rest}
      className={clsx(
        'rounded-lg flex items-center justify-center cursor-pointer py-2 text-base text-[#ffffff]/70 transition-all duration-300 ease-in-out hover:opacity-80 active:opacity-100 disabled:cursor-not-allowed',
        primary && 'bg-black text-white disabled:bg-black/50 ',
        secondary && 'bg-gray-200 text-black disabled:bg-gray-200/50',
        danger && 'bg-red-600 text-white disabled:bg-red-600/50',
        outline &&
          'bg-transparent border-2 border-black text-black disabled:border-black/50 disabled:text-black/50',
        className,
      )}
      disabled={disabled || loading}
    >
      {loading ? <Spinner /> : (children ?? 'Button')}
    </button>
  );
};

export default Button;
