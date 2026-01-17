import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, ShoppingCart, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';

const AdminDashboard = () => {
    const { data: orders } = useOrders();
    const { data: products } = useProducts();

    const totalOrders = orders?.length || 0;
    const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
    const totalProducts = products?.length || 0;
    const lowStockProducts = products?.filter(p => p.stock_quantity < 10).length || 0;
    const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;

    const stats = [
        {
            title: 'Total Revenue',
            value: `Rs. ${totalRevenue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`,
            icon: DollarSign,
            color: 'text-success',
            bgColor: 'bg-success/10',
        },
        {
            title: 'Total Orders',
            value: totalOrders,
            icon: ShoppingCart,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
        },
        {
            title: 'Total Products',
            value: totalProducts,
            icon: Package,
            color: 'text-accent',
            bgColor: 'bg-accent/10',
        },
        {
            title: 'Pending Orders',
            value: pendingOrders,
            icon: TrendingUp,
            color: 'text-warning',
            bgColor: 'bg-warning/10',
        },
        {
            title: 'Low Stock Alert',
            value: lowStockProducts,
            icon: AlertCircle,
            color: 'text-destructive',
            bgColor: 'bg-destructive/10',
        },
    ];

    const recentOrders = orders?.slice(0, 5) || [];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground mt-2">
                        Welcome to your admin dashboard. Here's an overview of your store.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                        <Icon className={`h-4 w-4 ${stat.color}`} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-2xl font-bold ${stat.color}`}>
                                        {stat.value}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length > 0 ? (
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between border-b pb-3">
                                        <div>
                                            <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(order.created_at).toLocaleDateString('en-LK', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-success">
                                                Rs. {order.total_amount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                                            </p>
                                            <p className={`text-xs ${order.status === 'delivered' ? 'text-success' :
                                                    order.status === 'cancelled' ? 'text-destructive' :
                                                        'text-warning'
                                                }`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-8">No orders yet</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
