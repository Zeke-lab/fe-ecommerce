import { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { Plus } from 'lucide-react';
import { useCountStore } from '../../services/zustand/countStore';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<
    'products' | 'categories' | 'orders'
  >('products');

  const counterStore = useCountStore();

  return (
    <div className='flex min-h-screen'>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className='flex-1 flex flex-col'>
        <Header />

        <div className='p-8 flex flex-col gap-8 animate-in fade-in duration-500'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold capitalize'>{activeTab}</h1>
              <p className='text-muted-foreground text-sm'>
                Manage your store's {activeTab} effortlessly.
              </p>
            </div>
            <button className='flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity'>
              <Plus className='h-4 w-4' />
              Add {activeTab.slice(0, -1)}
            </button>
          </div>

          <div className='bg-card border border-border rounded-xl overflow-hidden'>
            {activeTab === 'products' && (
              <div>
                <h1>Counter: {counterStore.count}</h1>
                <button
                  onClick={counterStore.increment}
                  className='mt-4 px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity'
                >
                  Increment Counter
                </button>
                <button onClick={counterStore.decrement}>
                  Decrement Counter
                </button>
              </div>
            )}
            {activeTab === 'categories' && (
              <h1>Categories Table Placeholder</h1>
            )}
            {activeTab === 'orders' && <h1>Orders Table Placeholder</h1>}

            {/* {activeTab === "products" && <ProductTable products={products} />} */}

            {/* {activeTab === "categories" && (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        <th className="px-6 py-4">Category Name</th>
                                        <th className="px-6 py-4">Products Count</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {categories.map((c) => (
                                        <tr key={c.id} className="text-sm hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 font-medium">{c.name}</td>
                                            <td className="px-6 py-4">{c.count} items</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeTab === "orders" && <OrderTable orders={orders} onUpdateStatus={updateOrderStatus} />} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
