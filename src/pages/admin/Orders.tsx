import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import OrderDetailsDialog from '@/components/orders/OrderDetailsDialog';
import {
  adminDeleteOrder,
  adminUpdateOrder,
  Order,
  OrderStatus,
  useGetAdminOrders,
} from '@/services/network/libs/orders';
import { formatDate } from '@/lib/helpers';
import { Eye, Trash2 } from 'lucide-react';

const statusOptions: { label: string; value: OrderStatus }[] = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const Orders = () => {
  const { data: orders, isLoading, isError, refetch } = useGetAdminOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);

  const selectedOrder: Order | undefined = useMemo(() => {
    return orders?.find((order) => order.id === selectedOrderId);
  }, [orders, selectedOrderId]);

  const handleViewDetails = (orderId: number) => {
    setSelectedOrderId(orderId);
    setDetailsOpen(true);
  };

  const handleStatusChange = async (orderId: number, nextStatus: OrderStatus) => {
    await adminUpdateOrder(orderId, { status: nextStatus }).catch((error) =>
      console.log('Update order status error:', error),
    );
    refetch();
  };

  const handleDeleteClick = (orderId: number) => {
    setDeleteOrderId(orderId);
    setDeleteModalOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!deleteOrderId) return;
    await adminDeleteOrder(deleteOrderId).catch((error) =>
      console.log('Delete order error:', error),
    );
    setDeleteModalOpen(false);
    setDeleteOrderId(null);
    refetch();
  };

  const handleDeleteModalToggle = (open: boolean) => {
    setDeleteModalOpen(open);
    if (!open) {
      setDeleteOrderId(null);
    }
  };

  if (isLoading) {
    return (
      <div className='flex w-full items-center justify-center py-5 h-[calc(100vh-250px)]'>
        <Spinner className='w-10 h-10' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='h-screen w-full flex items-center justify-center'>
        <div className='flex items-center flex-col gap-y-5'>
          <h2 className='text-2xl font-semibold'>Failed to load orders</h2>
          <p className='text-center text-muted-foreground'>
            There was an error while fetching orders. Please try again later.
          </p>
          <Button onClick={() => refetch()} className='w-fit mx-auto'>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 fade-in'>
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

      <AlertDialog open={deleteModalOpen} onOpenChange={handleDeleteModalToggle}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone and will remove the order entirely.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-red-500 hover:bg-red-500/90'
              onClick={onConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Orders</h1>
        <p className='text-muted-foreground'>Total: {orders?.length ?? 0}</p>
      </div>

      <div className='border rounded-lg overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className='font-medium'>#{order.id}</TableCell>
                  <TableCell>
                    <div className='flex flex-col'>
                      <span className='font-medium'>
                        {order.user?.name ?? 'N/A'}
                      </span>
                      {order.user?.email && (
                        <span className='text-xs text-muted-foreground'>
                          {order.user.email}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell>
                    {currencyFormatter.format(Number(order.totalAmount))}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value: OrderStatus) =>
                        handleStatusChange(order.id, value)
                      }
                    >
                      <SelectTrigger className='w-36'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{formatDate(order.updatedAt)}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleViewDetails(order.id)}
                        title='View details'
                      >
                        <Eye className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDeleteClick(order.id)}
                        title='Delete order'
                      >
                        <Trash2 className='w-4 h-4 text-destructive' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className='text-center py-10'>
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Orders;
