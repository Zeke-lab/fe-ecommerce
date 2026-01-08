import { useCountStore } from '../../services/zustand/countStore';

const Dashboard = () => {
  const counterStore = useCountStore();

  return (
    <div className='bg-red-500'>
      <div className='bg-card border border-border rounded-xl overflow-hidden'>
        <div>
          <h1>Counter: {counterStore.count}</h1>
          <button
            onClick={counterStore.increment}
            className='mt-4 px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity'
          >
            Increment Counter
          </button>
          <button onClick={counterStore.decrement}>Decrement Counter</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
