import { useState } from 'react';

import { Sidebar } from '../Sidebar';
import { Outlet } from 'react-router';

const LayoutWithAuth = () => {
  const [activeTab, setActiveTab] = useState<
    'products' | 'categories' | 'orders'
  >('products');
  return (
    <div className='flex min-h-screen'>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className='flex-1 flex flex-col'>
       

        <div className='p-8 flex flex-col gap-8 animate-in fade-in duration-500'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutWithAuth;
