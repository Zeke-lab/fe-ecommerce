import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Order } from '@/services/network/libs/orders';
import { formatDate } from '@/lib/helpers';

interface OrderDetailsDialogProps {
  order?: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const OrderDetailsDialog = ({ order, open, onOpenChange }: OrderDetailsDialogProps) => {
  if (!order) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Order #{order.id}</DialogTitle>
          <DialogDescription>
            Placed on {formatDate(order.orderDate)} | Status: {order.status}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <p className='text-muted-foreground'>Customer</p>
              <p className='font-medium'>
                {order.user?.name ?? 'N/A'}
              </p>
              {order.user?.email && (
                <p className='text-muted-foreground'>{order.user.email}</p>
              )}
            </div>
            <div>
              <p className='text-muted-foreground'>Total Amount</p>
              <p className='font-medium'>
                {currencyFormatter.format(Number(order.totalAmount))}
              </p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product?.name ?? `ID: ${item.product?.id ?? 'N/A'}`}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    {currencyFormatter.format(Number(item.unitPrice))}
                  </TableCell>
                  <TableCell>
                    {currencyFormatter.format(Number(item.subtotal))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
