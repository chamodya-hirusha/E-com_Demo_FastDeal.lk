import AdminLayout from '@/components/admin/AdminLayout';
import StoreSettings from '@/components/admin/StoreSettings';

const AdminSettings = () => {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground mt-2">
                        Configure store settings and preferences
                    </p>
                </div>
                <StoreSettings />
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
