import { Link } from 'react-router-dom';
import { Package, ChevronRight, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const Orders = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { data: orders, isLoading } = useOrders();

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-LK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="h-16 w-16 text-muted-foreground/50 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Sign in to view your orders</h1>
          <p className="text-muted-foreground mb-8">
            Track your orders and view your order history
          </p>
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders?.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-muted-foreground/50 mx-auto mb-6" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-8">
              When you place an order, it will appear here
            </p>
            <Button asChild>
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders?.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/50 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Order ID</p>
                        <p className="font-mono text-sm">{order.id.slice(0, 8)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="text-sm">{formatDate(order.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-semibold text-primary">
                          {formatPrice(order.total_amount)}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${statusColors[order.status]} mt-2 sm:mt-0`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="p-4">
                    <div className="flex flex-wrap gap-4">
                      {order.order_items?.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 bg-muted/30 rounded-lg p-2"
                        >
                          <div>
                            <p className="font-medium text-sm">{item.product_name}</p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity} × {formatPrice(item.unit_price)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {(order.order_items?.length || 0) > 3 && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          +{(order.order_items?.length || 0) - 3} more items
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Shipping to: {order.shipping_city}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;