import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useProducts } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Package, AlertTriangle, TrendingUp, Edit, Facebook, Share2, Copy } from 'lucide-react';

const AdminStock = () => {
    const { data: products, refetch } = useProducts();
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [stockQuantity, setStockQuantity] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleUpdateStock = async () => {
        if (!editingProduct) return;

        try {
            const { error } = await supabase
                .from('products')
                .update({ stock_quantity: parseInt(stockQuantity) })
                .eq('id', editingProduct.id);

            if (error) throw error;

            toast.success('Stock updated successfully');
            setIsDialogOpen(false);
            setEditingProduct(null);
            refetch();
        } catch (error: any) {
            toast.error('Failed to update stock: ' + error.message);
        }
    };

    const openStockDialog = (product: any) => {
        setEditingProduct(product);
        setStockQuantity(product.stock_quantity.toString());
        setIsDialogOpen(true);
    };

    const getStockStatus = (quantity: number) => {
        if (quantity === 0) return { label: 'Out of Stock', color: 'text-destructive', bg: 'bg-destructive/10' };
        if (quantity < 10) return { label: 'Low Stock', color: 'text-warning', bg: 'bg-warning/10' };
        if (quantity < 50) return { label: 'Medium Stock', color: 'text-primary', bg: 'bg-primary/10' };
        return { label: 'In Stock', color: 'text-success', bg: 'bg-success/10' };
    };

    const totalProducts = products?.length || 0;
    const outOfStock = products?.filter(p => p.stock_quantity === 0).length || 0;
    const lowStock = products?.filter(p => p.stock_quantity > 0 && p.stock_quantity < 10).length || 0;
    const totalStockValue = products?.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0) || 0;

    const generateFacebookPost = (product: any) => {
        const productUrl = `${window.location.origin}/product/${product.slug}`;
        const message = `Check out ${product.name}!\n\nPrice: Rs. ${product.price.toFixed(2)}\n\n${product.description || ''}\n\nShop now: ${productUrl}`;

        // Copy to clipboard
        navigator.clipboard.writeText(message);
        toast.success('Post text copied! Product link includes image preview for Facebook.');

        // Open Facebook share dialog
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    };

    const copyProductLink = (product: any) => {
        const productUrl = `${window.location.origin}/product/${product.slug}`;
        navigator.clipboard.writeText(productUrl);
        toast.success('Product link copied! Share it on Facebook for automatic image/video preview.');
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Stock Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Monitor and manage product inventory levels
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalProducts}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">{outOfStock}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-warning" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-warning">{lowStock}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
                            <TrendingUp className="h-4 w-4 text-success" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-success">
                                Rs. {totalStockValue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stock Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Stock Levels</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Value</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products?.map((product) => {
                                        const status = getStockStatus(product.stock_quantity);
                                        const stockValue = product.price * product.stock_quantity;

                                        return (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">{product.name}</TableCell>
                                                <TableCell>{product.category?.name || 'N/A'}</TableCell>
                                                <TableCell>Rs. {product.price.toFixed(2)}</TableCell>
                                                <TableCell className="font-bold">{product.stock_quantity}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </TableCell>
                                                <TableCell>Rs. {stockValue.toFixed(2)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openStockDialog(product)}
                                                            title="Update Stock"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => generateFacebookPost(product)}
                                                            title="Share on Facebook"
                                                        >
                                                            <Facebook className="h-4 w-4 text-blue-600" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => copyProductLink(product)}
                                                            title="Copy Product Link"
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Update Stock Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Stock - {editingProduct?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock Quantity</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={stockQuantity}
                                    onChange={(e) => setStockQuantity(e.target.value)}
                                    placeholder="Enter stock quantity"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleUpdateStock} className="gradient-primary">
                                    Update Stock
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default AdminStock;
