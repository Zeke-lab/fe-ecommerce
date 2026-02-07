import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, Package } from 'lucide-react';
import { useGetAllOrders } from '@/services/network/libs/orders';
import { Spinner } from '@/components/ui/spinner';

type OrderStatus = 'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';

const ITEMS_PER_PAGE = 10;

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  PROCESSING: 'bg-blue-100 text-blue-800 border-blue-300',
  DELIVERED: 'bg-green-100 text-green-800 border-green-300',
  CANCELLED: 'bg-red-100 text-red-800 border-red-300',
};

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const { data: orders, isLoading, isError } = useGetAllOrders();

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => {
      const matchesSearch =
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm);

      const matchesStatus =
        statusFilter === 'ALL' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleViewDetails = (orderId: number) => {
    // TODO: Implement order details dialog
    console.log('View order details:', orderId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTotalItems = (items: Array<{ quantity: number }>) => {
    return items.reduce((sum: number, item) => sum + item.quantity, 0);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-[50vh]'>
        <Spinner className='w-8 h-8' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex items-center justify-center h-[50vh]'>
        <p className='text-destructive'>Error loading orders. Please try again.</p>
      </div>
    );
  }

  return (
    <div className='space-y-4 fade-in'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Orders Management</h1>
        <div className='flex items-center gap-2'>
          <Package className='w-5 h-5 text-muted-foreground' />
          <span className='text-sm text-muted-foreground'>
            {filteredOrders.length} orders
          </span>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <Input
          placeholder='Search by customer name, email, or order ID...'
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className='max-w-md'
        />

        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filter by status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ALL'>All Status</SelectItem>
            <SelectItem value='PENDING'>Pending</SelectItem>
            <SelectItem value='PROCESSING'>Processing</SelectItem>
            <SelectItem value='DELIVERED'>Delivered</SelectItem>
            <SelectItem value='CANCELLED'>Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='border rounded-lg overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='text-center text-muted-foreground'>
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className='font-medium'>#{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className='font-medium'>{order.user.name}</p>
                      <p className='text-sm text-muted-foreground'>
                        {order.user.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>
                    {getTotalItems(order.items)} item
                    {getTotalItems(order.items) !== 1 ? 's' : ''}
                  </TableCell>
                  <TableCell className='font-semibold'>
                    ${Number(order.totalAmount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleViewDetails(order.id)}
                      title='View Details'
                    >
                      <Eye className='w-4 h-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>
          Showing {paginatedOrders.length > 0 ? startIndex + 1 : 0} to{' '}
          {Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)} of{' '}
          {filteredOrders.length} orders
        </p>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className='text-sm font-medium'>
            Page {currentPage} of {totalPages || 1}
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
