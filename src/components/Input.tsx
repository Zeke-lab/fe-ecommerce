import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: string;
  // hint?: string;
}

type InputState = {
  inputType: React.HTMLInputTypeAttribute;
  showPassword: boolean;
};

const Input: React.FC<InputProps> = (props) => {
  const { className, error, type, name, value, disabled, ...rest } = props;

  const [inputState, setInputState] = useState<InputState>({
    inputType: type || 'text',
    showPassword: false,
  });

  const onEyeIconClick = () => {
    setInputState((prevState) => ({
      inputType: prevState.inputType === 'password' ? 'text' : 'password',
      showPassword: !prevState.showPassword,
    }));
  };

  const handlePasswordDisplayIcon = () => {
    return inputState.showPassword ? (
      <Eye
        onClick={onEyeIconClick}
        className='absolute right-4 cursor-pointer'
        size={18}
        strokeWidth={1}
        color={'black'}
      />
    ) : (
      <EyeOff
        onClick={onEyeIconClick}
        className='absolute right-4 cursor-pointer'
        size={18}
        strokeWidth={1}
        color={'black'}
      />
    );
  };

  return (
    <div className='w-full'>
      <div className='relative flex items-center'>
        <input
          {...rest}
          name={name}
          value={value}
          onChange={props.onChange}
          type={inputState.inputType}
          disabled={disabled}
          className={clsx(
            // 'min-h-12.5 w-full border-b pr-3 py-2 text-base transition-all duration-300 ring-0 placeholder:text-zinc-400 outline-none focus:border-black',
            // error ? 'border-red-500' : 'border-gray-500',
            // disabled && 'opacity-50 cursor-not-allowed bg-gray-300',
            // type === 'password' && 'pr-10',
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            className,
          )}
        />
        {type === 'password' && handlePasswordDisplayIcon()}
      </div>
      {error && (
        <span className='block pt-1 text-xs text-red-500'>{error}</span>
      )}
    </div>
  );
};

export default Input;
