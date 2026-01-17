import AdminLayout from '@/components/admin/AdminLayout';
import CategoryManagement from '@/components/admin/CategoryManagement';

const AdminCategories = () => {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Categories</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage product categories
                    </p>
                </div>
                <CategoryManagement />
            </div>
        </AdminLayout>
    );
};

export default AdminCategories;
