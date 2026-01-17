import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';

const IncomeOutcome = () => {
    const { data: orders } = useOrders();
    const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

    // Calculate financial metrics
    const calculateMetrics = () => {
        if (!orders) return { income: 0, orderCount: 0, avgOrder: 0 };

        const now = new Date();
        const filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.created_at);

            if (selectedPeriod === 'today') {
                return orderDate.toDateString() === now.toDateString();
            } else if (selectedPeriod === 'week') {
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return orderDate >= weekAgo;
            } else {
                return orderDate.getMonth() === now.getMonth() &&
                    orderDate.getFullYear() === now.getFullYear();
            }
        });

        const income = filteredOrders
            .filter(order => order.status !== 'cancelled')
            .reduce((sum, order) => sum + order.total_amount, 0);

        const orderCount = filteredOrders.length;
        const avgOrder = orderCount > 0 ? income / orderCount : 0;

        return { income, orderCount, avgOrder };
    };

    const { income, orderCount, avgOrder } = calculateMetrics();

    // Calculate expenses (simulated - you can add actual expense tracking)
    const estimatedExpenses = income * 0.3; // 30% of income as expenses
    const netProfit = income - estimatedExpenses;

    const formatCurrency = (amount: number) => {
        return `Rs. ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                <button
                    onClick={() => setSelectedPeriod('today')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedPeriod === 'today'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                >
                    Today
                </button>
                <button
                    onClick={() => setSelectedPeriod('week')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedPeriod === 'week'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                >
                    This Week
                </button>
                <button
                    onClick={() => setSelectedPeriod('month')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedPeriod === 'month'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                >
                    This Month
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                        <TrendingUp className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-success">{formatCurrency(income)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Revenue from {orderCount} orders
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Estimated Expenses</CardTitle>
                        <TrendingDown className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{formatCurrency(estimatedExpenses)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            ~30% of total income
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{formatCurrency(netProfit)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Income - Expenses
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Order</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(avgOrder)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Per order value
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {orders?.slice(0, 10).map((order) => (
                            <div key={order.id} className="flex items-center justify-between border-b pb-3">
                                <div>
                                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(order.created_at).toLocaleDateString('en-LK', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-success">{formatCurrency(order.total_amount)}</p>
                                    <p className={`text-xs ${order.status === 'delivered' ? 'text-success' :
                                            order.status === 'cancelled' ? 'text-destructive' :
                                                'text-muted-foreground'
                                        }`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default IncomeOutcome;
