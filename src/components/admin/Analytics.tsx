import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { BarChart3, TrendingUp, Package, Users } from 'lucide-react';

const Analytics = () => {
    const { data: orders } = useOrders();
    const { data: products } = useProducts();

    // Daily Analytics
    const getDailyStats = () => {
        if (!orders) return [];

        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();

        return last7Days.map(date => {
            const dayOrders = orders.filter(order =>
                order.created_at.startsWith(date)
            );

            return {
                date: new Date(date).toLocaleDateString('en-LK', { month: 'short', day: 'numeric' }),
                orders: dayOrders.length,
                revenue: dayOrders.reduce((sum, order) => sum + order.total_amount, 0)
            };
        });
    };

    // Monthly Analytics
    const getMonthlyStats = () => {
        if (!orders) return [];

        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return { year: date.getFullYear(), month: date.getMonth() };
        }).reverse();

        return last6Months.map(({ year, month }) => {
            const monthOrders = orders.filter(order => {
                const orderDate = new Date(order.created_at);
                return orderDate.getFullYear() === year && orderDate.getMonth() === month;
            });

            return {
                month: new Date(year, month).toLocaleDateString('en-LK', { month: 'short' }),
                orders: monthOrders.length,
                revenue: monthOrders.reduce((sum, order) => sum + order.total_amount, 0)
            };
        });
    };

    // Top Products
    const getTopProducts = () => {
        if (!orders) return [];

        const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};

        orders.forEach(order => {
            order.order_items?.forEach(item => {
                if (!productSales[item.product_name]) {
                    productSales[item.product_name] = {
                        name: item.product_name,
                        quantity: 0,
                        revenue: 0
                    };
                }
                productSales[item.product_name].quantity += item.quantity;
                productSales[item.product_name].revenue += item.unit_price * item.quantity;
            });
        });

        return Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
    };

    const dailyStats = getDailyStats();
    const monthlyStats = getMonthlyStats();
    const topProducts = getTopProducts();

    const formatCurrency = (amount: number) => {
        return `Rs. ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;
    };

    // Calculate totals
    const totalOrders = orders?.length || 0;
    const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
    const totalProducts = products?.length || 0;
    const lowStockProducts = products?.filter(p => p.stock_quantity < 10).length || 0;

    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders}</div>
                        <p className="text-xs text-muted-foreground mt-1">All time orders</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-success">{formatCurrency(totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground mt-1">All time revenue</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProducts}</div>
                        <p className="text-xs text-muted-foreground mt-1">Active products</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
                        <Package className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{lowStockProducts}</div>
                        <p className="text-xs text-muted-foreground mt-1">Products below 10 units</p>
                    </CardContent>
                </Card>
            </div>

            {/* Daily Analytics */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Analytics (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {dailyStats.map((stat, index) => (
                            <div key={index} className="flex items-center justify-between border-b pb-3">
                                <div>
                                    <p className="font-medium">{stat.date}</p>
                                    <p className="text-sm text-muted-foreground">{stat.orders} orders</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-success">{formatCurrency(stat.revenue)}</p>
                                    <div className="w-32 bg-muted rounded-full h-2 mt-1">
                                        <div
                                            className="bg-success h-2 rounded-full transition-all"
                                            style={{ width: `${Math.min((stat.revenue / Math.max(...dailyStats.map(s => s.revenue))) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Monthly Analytics */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Analytics (Last 6 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {monthlyStats.map((stat, index) => (
                            <div key={index} className="flex items-center justify-between border-b pb-3">
                                <div>
                                    <p className="font-medium">{stat.month}</p>
                                    <p className="text-sm text-muted-foreground">{stat.orders} orders</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-primary">{formatCurrency(stat.revenue)}</p>
                                    <div className="w-32 bg-muted rounded-full h-2 mt-1">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all"
                                            style={{ width: `${Math.min((stat.revenue / Math.max(...monthlyStats.map(s => s.revenue))) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {topProducts.map((product, index) => (
                            <div key={index} className="flex items-center justify-between border-b pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium">{product.name}</p>
                                        <p className="text-sm text-muted-foreground">{product.quantity} units sold</p>
                                    </div>
                                </div>
                                <p className="font-bold text-success">{formatCurrency(product.revenue)}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Analytics;
