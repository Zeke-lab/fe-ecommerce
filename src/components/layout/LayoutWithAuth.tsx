import { Sidebar } from '../Sidebar';
import { Outlet } from 'react-router';

const LayoutWithAuth = () => {
  return (
    <div className='flex min-h-screen'>
      <Sidebar />

      <div className='flex-1 flex flex-col'>
        <div className='p-8 flex flex-col gap-8 animate-in fade-in duration-500'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutWithAuth;
