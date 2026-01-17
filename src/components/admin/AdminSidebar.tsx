import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    FolderTree,
    DollarSign,
    BarChart3,
    Settings,
    Menu,
    X,
    PackageCheck
} from 'lucide-react';
import { useState } from 'react';

const AdminSidebar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/products', icon: Package, label: 'Products' },
        { path: '/admin/categories', icon: FolderTree, label: 'Categories' },
        { path: '/admin/stock', icon: PackageCheck, label: 'Stock Management' },
        { path: '/admin/finance', icon: DollarSign, label: 'Finance' },
        { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    const isActive = (path: string) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-primary text-primary-foreground rounded-lg shadow-lg"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r border-border transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 w-64`}
            >
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
                                        ? 'bg-primary text-primary-foreground font-semibold'
                                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default AdminSidebar;
