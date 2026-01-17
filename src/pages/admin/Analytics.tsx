import AdminLayout from '@/components/admin/AdminLayout';
import Analytics from '@/components/admin/Analytics';

const AdminAnalytics = () => {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Analytics</h1>
                    <p className="text-muted-foreground mt-2">
                        View daily and monthly performance analytics
                    </p>
                </div>
                <Analytics />
            </div>
        </AdminLayout>
    );
};

export default AdminAnalytics;
