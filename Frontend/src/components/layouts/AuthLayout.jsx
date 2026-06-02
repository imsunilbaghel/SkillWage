import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdmin";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";

const AuthLayout = () => {
    const location = useLocation();
    const { isLoading: isAuthLoading, isAuthenticated } = useAuth();
    const { isLoading: isAdminLoading, isAuthenticated: isAdminAuthenticated } = useAdminAuth();

    useEffect(() => {
        const content = document.querySelector("main");
        if (content) {
            content.scrollTo({ top: 0, behavior: "instant" });
        } else {
            window.scrollTo({ top: 0, behavior: "instant" });
        }
    }, [location.pathname]);

    if (isAuthLoading || isAdminLoading) return null;
    if (isAdminAuthenticated) return <Navigate to="/admin" replace />;
    if (isAuthenticated) return <Navigate to="/app" replace />;
    return (
        <div className="bg-background text-foreground flex h-dvh flex-col">
            <main className="flex-1 overflow-y-auto min-h-0 flex flex-col">
                <Outlet />
            </main>
        </div>
    );
}
export default AuthLayout