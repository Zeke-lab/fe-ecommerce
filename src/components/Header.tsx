import { Search, User, LogOut } from 'lucide-react';
import { cleanupAfterLogout } from '../services/zustand/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { AppConstantRoutes } from '../services/routes/path';

export function Header() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = () => {
    cleanupAfterLogout();
    queryClient.clear();
    navigate(AppConstantRoutes.path.auth.login);
  };

  return (
    <header className='h-16 border-b border-gray-200 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-10'>
      {/* <div className='relative w-96'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <input
          type='text'
          placeholder='Search anything...'
          className='w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring'
        />
      </div> */}
      <div className='flex items-center gap-4'>
        <button
          onClick={handleLogout}
          className='p-2 text-muted-foreground hover:text-foreground transition-colors'
        >
          <LogOut className='h-5 w-5' />
        </button>

        <div className='h-8 w-8 rounded-full bg-muted flex items-center justify-center'>
          <User className='h-5 w-5 text-muted-foreground' />
        </div>
      </div>
    </header>
  );
}
