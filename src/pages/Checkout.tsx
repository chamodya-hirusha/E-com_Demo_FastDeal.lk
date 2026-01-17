import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Loader2, CheckCircle, CreditCard, Banknote, Landmark } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'koko'>('cod');

  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    shippingAddress: '',
    shippingCity: '',
    notes: '',
  });

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.shippingAddress || !formData.shippingCity) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!user && (!formData.guestName || !formData.guestEmail || !formData.guestPhone)) {
      toast.error('Please fill in your contact information');
      return;
    }

    try {
      if (paymentMethod === 'card') {
        toast.info('Processing card payment... (Simulated)');
        // Simulate a delay for card processing
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else if (paymentMethod === 'koko') {
        toast.info('Redirecting to Koko... (Simulated)');
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      const order = await createOrder.mutateAsync({
        items,
        shippingAddress: formData.shippingAddress,
        shippingCity: formData.shippingCity,
        notes: formData.notes,
        guestEmail: formData.guestEmail || undefined,
        guestName: formData.guestName || undefined,
        guestPhone: formData.guestPhone || undefined,
      });

      clearCart();
      setOrderId(order.id);
      setOrderSuccess(true);
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Failed to create order. Please try again.');
    }
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Add some products to your cart before checking out.
          </p>
          <Button asChild>
            <Link to="/products">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (orderSuccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-2">
              Thank you for your order. We'll process it soon.
            </p>
            {orderId && (
              <p className="text-sm text-muted-foreground mb-8">
                Order ID: <span className="font-mono">{orderId.slice(0, 8)}</span>
              </p>
            )}
            <div className="flex flex-col gap-3">
              {user && (
                <Button asChild>
                  <Link to="/orders">View My Orders</Link>
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/products">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Customer Info & Shipping */}
            <div className="lg:col-span-2 space-y-6">
              {/* Guest Info */}
              {!user && (
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guestName">Full Name *</Label>
                        <Input
                          id="guestName"
                          name="guestName"
                          value={formData.guestName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guestPhone">Phone Number *</Label>
                        <Input
                          id="guestPhone"
                          name="guestPhone"
                          type="tel"
                          value={formData.guestPhone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guestEmail">Email Address *</Label>
                      <Input
                        id="guestEmail"
                        name="guestEmail"
                        type="email"
                        value={formData.guestEmail}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{' '}
                      <Link to="/auth" className="text-primary hover:underline">
                        Sign in
                      </Link>
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingAddress">Street Address *</Label>
                    <Textarea
                      id="shippingAddress"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      placeholder="House number, street name, area"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingCity">City *</Label>
                    <Input
                      id="shippingCity"
                      name="shippingCity"
                      value={formData.shippingCity}
                      onChange={handleInputChange}
                      placeholder="e.g. Colombo"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any special instructions for delivery"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'cod'
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                        }`}
                    >
                      <Banknote className={`h-6 w-6 mb-2 ${paymentMethod === 'cod' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-sm font-semibold">Cash on Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'card'
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                        }`}
                    >
                      <CreditCard className={`h-6 w-6 mb-2 ${paymentMethod === 'card' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-sm font-semibold">Credit/Debit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('koko')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'koko'
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                        }`}
                    >
                      <Landmark className={`h-6 w-6 mb-2 ${paymentMethod === 'koko' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-sm font-semibold text-center">3 Interest-Free Installments</span>
                      <img src="/koko-logo.png" alt="Koko" className="h-5 w-auto mt-2" />
                    </button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="p-4 bg-muted/30 rounded-lg border space-y-4 animate-fade-in">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'koko' && (
                    <div className="p-4 bg-success/5 rounded-lg border border-success/20 animate-fade-in">
                      <p className="text-sm text-success font-medium">
                        You will be redirected to Koko to complete your purchase of 3 interest-free installments of {formatPrice((totalPrice + (totalPrice >= 5000 ? 0 : 350)) / 3)}.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-32">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <img
                        src={item.product.image_url || '/placeholder.svg'}
                        alt={item.product.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-2">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-success">
                        {totalPrice >= 5000 ? 'Free' : formatPrice(350)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span className="text-primary">
                        {formatPrice(
                          totalPrice + (totalPrice >= 5000 ? 0 : 350)
                        )}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-primary"
                    size="lg"
                    disabled={createOrder.isPending}
                  >
                    {createOrder.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By placing your order, you agree to our Terms of Service and
                    Privacy Policy.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;