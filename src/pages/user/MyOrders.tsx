import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import OrderDetailsDialog from '@/components/orders/OrderDetailsDialog';
import { Button } from '@/components/ui/button';
import { useGetMyOrders, Order } from '@/services/network/libs/orders';
import { formatDate } from '@/lib/helpers';
import { Eye } from 'lucide-react';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const MyOrders = () => {
  const { data: orders, isLoading, isError, refetch } = useGetMyOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const selectedOrder: Order | undefined = useMemo(() => {
    return orders?.find((order) => order.id === selectedOrderId);
  }, [orders, selectedOrderId]);

  if (isLoading) {
    return (
      <div className='flex w-full items-center justify-center py-5 h-[calc(100vh-250px)]'>
        <Spinner className='w-10 h-10' />
      </div>
    );
  }

  if (isError) {
    return (
      <section className='space-y-4'>
        <div className='flex flex-col items-center gap-3 text-center'>
          <p className='text-muted-foreground'>We could not load your orders.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </section>
    );
  }

  return (
    <section className='space-y-4'>
      <OrderDetailsDialog
        order={selectedOrder}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);
          if (!open) {
            setSelectedOrderId(null);
          }
        }}
      />

      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>My Orders</h2>
        <p className='text-muted-foreground'>Total: {orders?.length ?? 0}</p>
      </div>

      <div className='border rounded-lg overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    {currencyFormatter.format(Number(order.totalAmount))}
                  </TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell className='text-right'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        setSelectedOrderId(order.id);
                        setDetailsOpen(true);
                      }}
                    >
                      <Eye className='w-4 h-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className='text-center py-10'>
                  You have no orders yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default MyOrders;
