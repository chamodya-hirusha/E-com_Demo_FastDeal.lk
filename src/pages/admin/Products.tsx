import AdminLayout from '@/components/admin/AdminLayout';
import ProductManagement from '@/components/admin/ProductManagement';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold">Products</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage your product inventory
                        </p>
                    </div>
                    <Button asChild className="gradient-primary">
                        <Link to="/admin/products/add">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Link>
                    </Button>
                </div>
                <ProductManagement />
            </div>
        </AdminLayout>
    );
};

export default AdminProducts;
