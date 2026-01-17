import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar />
            <main className="lg:ml-64 p-6 pt-24 lg:pt-6">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
