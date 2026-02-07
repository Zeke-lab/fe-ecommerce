import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/services/zustand/cartStore';
import { createOrder } from '@/services/network/libs/orders';
import { Spinner } from '@/components/ui/spinner';

interface CartDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartDialog({ isOpen, onOpenChange }: CartDialogProps) {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { items, updateQuantity, removeItem, clearCart, getTotalAmount } = useCartStore();

  const handleCheckout = () => {
    if (items.length === 0) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmCheckout = async () => {
    setShowConfirmDialog(false);
    setIsCreatingOrder(true);
    
    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      console.log('Cart items:', items);
      console.log('Sending order with items:', orderItems);
      await createOrder({ items: orderItems });
      
      clearCart();
      onOpenChange(false);
      
      alert('Order placed successfully! Check "My Orders" to view your order.');
    } catch (error) {
      console.error('Create order error:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <ShoppingBag className='w-5 h-5' />
            Shopping Cart
          </DialogTitle>
          <DialogDescription>
            {items.length === 0
              ? 'Your cart is empty'
              : `You have ${items.length} item${items.length !== 1 ? 's' : ''} in your cart`}
          </DialogDescription>
        </DialogHeader>

        {items.length === 0 ? (
          <div className='py-12 text-center'>
            <ShoppingBag className='w-16 h-16 mx-auto text-muted-foreground mb-4' />
            <p className='text-muted-foreground mb-4'>
              Your cart is empty. Start shopping!
            </p>
            <Button onClick={() => onOpenChange(false)}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='max-h-[400px] overflow-y-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className='text-right'>Price</TableHead>
                    <TableHead className='text-center'>Quantity</TableHead>
                    <TableHead className='text-right'>Subtotal</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell className='font-medium'>{item.name}</TableCell>
                      <TableCell className='text-right'>
                        ${item.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-center gap-1'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className='h-7 w-7 p-0'
                          >
                            <Minus className='w-3 h-3' />
                          </Button>
                          <span className='w-10 text-center text-sm'>
                            {item.quantity}
                          </span>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.maxStock}
                            className='h-7 w-7 p-0'
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
                          className='h-8 w-8 p-0'
                        >
                          <Trash2 className='w-4 h-4 text-destructive' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className='border-t pt-4'>
              <div className='flex items-center justify-between mb-4'>
                <span className='text-lg font-semibold'>Total Amount:</span>
                <span className='text-2xl font-bold'>
                  ${getTotalAmount().toFixed(2)}
                </span>
              </div>

              <DialogFooter className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  onClick={() => onOpenChange(false)}
                  disabled={isCreatingOrder}
                  className='flex-1'
                >
                  Continue Shopping
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={isCreatingOrder}
                  className='flex-1'
                >
                  {isCreatingOrder ? (
                    <>
                      <Spinner className='w-4 h-4 mr-2' />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className='w-4 h-4 mr-2' />
                      Checkout
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          </div>
        )}
      </DialogContent>

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
            <AlertDialogAction onClick={handleConfirmCheckout} disabled={isCreatingOrder}>
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
    </Dialog>
  );
}
