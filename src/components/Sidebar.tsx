import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
} from 'lucide-react';
import { cleanupAfterLogout, selectAuth, useAuthStore } from '../services/zustand/authStore';
import Button from './Button';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { AppConstantRoutes } from '../services/routes/path';

interface SidebarProps {
  activeTab: 'products' | 'categories' | 'orders';
  setActiveTab: (tab: 'products' | 'categories' | 'orders') => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {


  const user = useAuthStore(selectAuth);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = () => {
    cleanupAfterLogout();
    queryClient.clear();
    navigate(AppConstantRoutes.path.auth.login);
  };

  return (
    <aside className='w-64 rounded-tr-3xl border-r border-gray-200 p-6 flex flex-col gap-8 md:flex'>
      <div className='flex items-center gap-2 px-2'>
        <div className='h-8 w-8 bg-foreground rounded-lg flex items-center justify-center'>
          <LayoutDashboard className='h-5 w-5 text-background' />
        </div>
        <span className='font-bold text-xl tracking-tight'>V-COMMERCE</span>
      </div>

      <div className='flex h-full flex-col items-start justify-between'>
        <nav className='flex flex-col gap-2'>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${activeTab === 'products' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
          >
            <Package className='h-4 w-4' />
            <span className='text-sm font-medium'>Products</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${activeTab === 'categories' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
          >
            <FolderTree className='h-4 w-4' />
            <span className='text-sm font-medium'>Categories</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${activeTab === 'orders' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
          >
            <ShoppingCart className='h-4 w-4' />
            <span className='text-sm font-medium'>Orders</span>
          </button>
        </nav>
        <div className='w-full'>
          {/* Logout and User Profile */}
          <div className='flex items-center gap-x-3'>
            <img src="https://placehold.co/400x400" className="h-10 w-10 rounded-full" alt="user profile" />
            <span className='text-gray-500'>{user.name}</span>
          </div>
          <Button danger className='w-full mt-5' onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
