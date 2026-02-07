import { LogOut } from 'lucide-react';
import {
  cleanupAfterLogout,
  selectAuth,
  useAuthStore,
} from '../services/zustand/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useNavigate } from 'react-router';
import { AppConstantRoutes } from '../services/routes/path';
import { getNavigationItemsByRole } from '@/constants/navigationItems';
import clsx from 'clsx';
import { Button } from './ui/button';
import type { Role } from '@/types/role';

export function Sidebar() {
  const { pathname } = useLocation();

  const user = useAuthStore(selectAuth);

  const navigationItems = user?.role
    ? getNavigationItemsByRole(user.role as Role)
    : [];

  const dashboardTitle =
    user?.role === 'ADMIN' ? 'Admin Dashboard' : 'My Dashboard';

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = () => {
    cleanupAfterLogout();
    queryClient.clear();
    navigate(AppConstantRoutes.path.auth.login);
  };

  return (
    <aside className='w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col h-screen'>
      {/* Header */}
      <div className='p-6 border-b border-sidebar-border'>
        <h1 className='text-xl font-bold'>{dashboardTitle}</h1>
      </div>

      {/* Navigation */}
      <nav className='flex-1 p-4 space-y-2'>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent',
              )}
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className='p-4 border-t border-sidebar-border space-y-3'>
        <div className='px-4 py-2 bg-sidebar-accent rounded-lg'>
          <p className='text-sm font-medium'>{user?.name}</p>
          <p className='text-xs text-sidebar-foreground opacity-75'>
            {user?.email}
          </p>
        </div>
        <Button
          onClick={handleLogout}
          variant='destructive'
          className='w-full flex items-center gap-2'
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </aside>
  );
}
