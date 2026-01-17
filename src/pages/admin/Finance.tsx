import AdminLayout from '@/components/admin/AdminLayout';
import IncomeOutcome from '@/components/admin/IncomeOutcome';

const AdminFinance = () => {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Finance</h1>
                    <p className="text-muted-foreground mt-2">
                        Track income, expenses, and financial metrics
                    </p>
                </div>
                <IncomeOutcome />
            </div>
        </AdminLayout>
    );
};

export default AdminFinance;
