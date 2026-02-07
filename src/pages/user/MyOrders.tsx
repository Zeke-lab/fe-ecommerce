import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { ShoppingCart, Package, Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/services/zustand/cartStore';
import { useGetMyOrders, createOrder } from '@/services/network/libs/orders';
import { Spinner } from '@/components/ui/spinner';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  PROCESSING: 'bg-blue-100 text-blue-800 border-blue-300',
  DELIVERED: 'bg-green-100 text-green-800 border-green-300',
  CANCELLED: 'bg-red-100 text-red-800 border-red-300',
} as const;

const MyOrders = () => {
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const { items, updateQuantity, removeItem, clearCart, getTotalAmount } = useCartStore();
  const { data: orders, isLoading, isError, refetch } = useGetMyOrders();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCreateOrder = () => {
    if (items.length === 0) {
      alert('Please add items to cart first');
      return;
    }
    setShowCheckoutDialog(true);
  };

  const handleConfirmOrder = () => {
    if (items.length === 0) return;
    setShowConfirmDialog(true);
  };

  const handleActualConfirmOrder = async () => {
    setShowConfirmDialog(false);
    setIsCreatingOrder(true);
    
    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      await createOrder({ items: orderItems });
      
      // Clear cart and close dialog
      clearCart();
      setShowCheckoutDialog(false);
      
      // Refetch orders to show the new order
      refetch();
      
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Create order error:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsCreatingOrder(false);
    }
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
    <div className='space-y-6 fade-in'>
      {/* Header with Create Order Button */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>My Orders</h1>
          <p className='text-muted-foreground mt-1'>
            {orders?.length || 0} orders total
          </p>
        </div>
        <Button onClick={handleCreateOrder} className='gap-2'>
          <ShoppingCart className='w-4 h-4' />
          Create New Order ({items.length} items)
        </Button>
      </div>

      {/* Orders List */}
      <div className='space-y-4'>
        {!orders || orders.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-16'>
              <Package className='w-16 h-16 text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>No orders yet</h3>
              <p className='text-muted-foreground mb-4'>
                Start shopping and create your first order!
              </p>
              <Button onClick={handleCreateOrder}>
                Create Order
              </Button>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg'>Order #{order.id}</CardTitle>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className='text-sm text-muted-foreground'>
                  {formatDate(order.orderDate)}
                </p>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-center justify-between text-sm'
                    >
                      <span>
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className='font-medium'>
                        ${Number(item.subtotal).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className='border-t pt-4'>
                <div className='flex items-center justify-between w-full'>
                  <span className='font-semibold'>Total Amount:</span>
                  <span className='text-xl font-bold'>
                    ${Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Review Your Order</DialogTitle>
            <DialogDescription>
              Review items in your cart and confirm your order
            </DialogDescription>
          </DialogHeader>

          {items.length === 0 ? (
            <div className='py-8 text-center text-muted-foreground'>
              Your cart is empty. Add items from Browse Products page.
            </div>
          ) : (
            <div className='space-y-4'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className='text-center'>Quantity</TableHead>
                    <TableHead className='text-right'>Subtotal</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell className='font-medium'>{item.name}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className='flex items-center justify-center gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className='w-3 h-3' />
                          </Button>
                          <span className='w-8 text-center'>{item.quantity}</span>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.maxStock}
                          >
                            <Plus className='w-3 h-3' />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className='text-right font-medium'>
                        ${(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className='w-4 h-4 text-destructive' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className='border-t pt-4'>
                <div className='flex items-center justify-between text-lg font-bold'>
                  <span>Total Amount:</span>
                  <span>${getTotalAmount().toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowCheckoutDialog(false)}
              disabled={isCreatingOrder}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmOrder}
              disabled={items.length === 0 || isCreatingOrder}
            >
              {isCreatingOrder ? (
                <>
                  <Spinner className='w-4 h-4 mr-2' />
                  Creating...
                </>
              ) : (
                'Confirm Order'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Purchase</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to place this order for ${getTotalAmount().toFixed(2)}? This action will save your order to the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCreatingOrder}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleActualConfirmOrder} disabled={isCreatingOrder}>
              {isCreatingOrder ? (
                <>
                  <Spinner className='w-4 h-4 mr-2' />
                  Processing...
                </>
              ) : (
                'Yes, Place Order'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyOrders;
