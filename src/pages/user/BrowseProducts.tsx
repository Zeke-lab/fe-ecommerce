import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Package, Search } from 'lucide-react';
import { useCartStore } from '@/services/zustand/cartStore';
import { useGetAllProducts } from '@/services/network/libs/products';
import { Spinner } from '@/components/ui/spinner';
import CartDialog from '@/components/cart/CartDialog';

const BrowseProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCartDialog, setShowCartDialog] = useState(false);
  const { addItem, getTotalItems } = useCartStore();
  const { data: products, isLoading, isError } = useGetAllProducts();

  // Get unique categories
  const categories = useMemo(() => {
    if (!products) return ['All'];
    const uniqueCategories = Array.from(
      new Set(products.filter(p => p.category).map((p) => p.category!.name))
    );
    return ['All', ...uniqueCategories];
  }, [products]);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category?.name === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const handleAddToCart = (product: typeof filteredProducts[0]) => {
    if (!product || (product.qty ?? 0) <= 0) return;
    
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      maxStock: product.qty ?? 0,
    });
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
        <p className='text-destructive'>Error loading products. Please try again.</p>
      </div>
    );
  }

  return (
    <div className='space-y-6 fade-in'>
      <CartDialog isOpen={showCartDialog} onOpenChange={setShowCartDialog} />
      
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Browse Products</h1>
          <p className='text-muted-foreground mt-1'>
            {filteredProducts.length} products available
          </p>
        </div>
        <Button 
          variant='outline' 
          className='gap-2'
          onClick={() => setShowCartDialog(true)}
        >
          <ShoppingCart className='w-5 h-5' />
          <span className='font-medium'>
            Cart ({getTotalItems()})
          </span>
        </Button>
      </div>

      {/* Search */}
      <div className='relative max-w-md'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
        <Input
          placeholder='Search products...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='pl-10'
        />
      </div>

      {/* Category Tabs */}
      <div className='flex gap-2 overflow-x-auto pb-2'>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className='whitespace-nowrap'
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-16 text-center'>
          <Package className='w-16 h-16 text-muted-foreground mb-4' />
          <h3 className='text-lg font-semibold mb-2'>No products found</h3>
          <p className='text-muted-foreground'>
            Try adjusting your search or category filter
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {filteredProducts.map((product) => (
            <Card key={product.id} className='flex flex-col'>
              <CardHeader>
                {/* Product Image Placeholder */}
                <div className='aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center'>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className='object-cover w-full h-full rounded-lg'
                    />
                  ) : (
                    <Package className='w-16 h-16 text-muted-foreground' />
                  )}
                </div>
                <CardTitle className='text-lg'>{product.name}</CardTitle>
              </CardHeader>
              <CardContent className='flex-1'>
                <p className='text-sm text-muted-foreground line-clamp-2 mb-4'>
                  {product.description || 'No description available'}
                </p>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-2xl font-bold'>
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      {product.category?.name || 'Uncategorized'}
                    </span>
                  </div>
                  <div className='text-xs'>
                    {(product.qty ?? 0) > 0 ? (
                      <span className='text-green-600'>
                        {product.qty} in stock
                      </span>
                    ) : (
                      <span className='text-red-600'>Out of stock</span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className='w-full'
                  onClick={() => handleAddToCart(product)}
                  disabled={(product.qty ?? 0) === 0}
                >
                  <ShoppingCart className='w-4 h-4 mr-2' />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseProducts;
