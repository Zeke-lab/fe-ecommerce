import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'products' | 'categories' | 'orders';
  setActiveTab: (tab: 'products' | 'categories' | 'orders') => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className='w-64 border-r border-border bg-card p-6 flex flex-col gap-8 hidden md:flex'>
      <div className='flex items-center gap-2 px-2'>
        <div className='h-8 w-8 bg-foreground rounded-lg flex items-center justify-center'>
          <LayoutDashboard className='h-5 w-5 text-background' />
        </div>
        <span className='font-bold text-xl tracking-tight'>V-COMMERCE</span>
      </div>

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
    </aside>
  );
}
