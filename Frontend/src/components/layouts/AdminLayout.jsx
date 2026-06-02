import { useState, useEffect } from "react";
import { Outlet, useLocation, Navigate, Link } from "react-router";
import { useAdminAuth, useAdminLogout } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, LayoutDashboard, LogOut, MessageSquareWarning, Users, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
    const location = useLocation();
    const { isAuthenticated: isAdminAuthenticated, isLoading: isAdminLoading, admin } = useAdminAuth();
    const { isAuthenticated: isUserAuthenticated, isLoading: isUserLoading } = useAuth();
    const logoutMutation = useAdminLogout();
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isAdminLoading || isUserLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (isUserAuthenticated && !isAdminAuthenticated) {
        return <Navigate to="/app" replace />;
    }

    if (!isAdminAuthenticated) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    if (!isDesktop) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 text-center">
                <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
                    <LayoutDashboard className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Admin Panel</h1>
                    <p className="text-slate-600">Please open this page on a desktop device to view the Admin Panel.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-100 font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-slate-300 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold text-white tracking-wider">SkillWage Admin</h1>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-3">
                        <Link to="/admin/workers" className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${location.pathname === '/admin/workers' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                            <LayoutDashboard className="mr-3 flex-shrink-0 h-5 w-5" />
                            Worker Management
                        </Link>
                        <Link to="/admin/customers" className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${location.pathname === '/admin/customers' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                            <Users className="mr-3 flex-shrink-0 h-5 w-5" />
                            Customer Management
                        </Link>
                        <Link to="/admin/requests" className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${location.pathname === '/admin/requests' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                            <ClipboardList className="mr-3 flex-shrink-0 h-5 w-5" />
                            Service Requests
                        </Link>
                        <Link to="/admin/contacts" className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${location.pathname === '/admin/contacts' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                            <MessageSquareWarning className="mr-3 flex-shrink-0 h-5 w-5" />
                            Contact Messages
                        </Link>
                        <Link to="/admin/support" className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${location.pathname === '/admin/support' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                            <MessageSquareWarning className="mr-3 flex-shrink-0 h-5 w-5" />
                            All Support Queries
                        </Link>
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-3">
                            {admin?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="text-sm font-medium text-white truncate">
                            {admin?.name}
                        </div>
                    </div>
                    <Button
                        variant="destructive"
                        className="w-full flex items-center justify-center"
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                    >
                        {logoutMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <LogOut className="w-4 h-4 mr-2" />
                        )}
                        Logout
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
