import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import NavBar from "../NavBar";
import LanguageToggler from "../LanguageToggler";
import { useAuth } from "@/hooks/useAuth";

const MainLayout = () => {
    const location = useLocation();
    const { isLoading, isAuthenticated } = useAuth();
    useEffect(() => {
        const content = document.querySelector("main");
        if (content) {
            content.scrollTo({ top: 0, behavior: "instant" });
        } else {
            window.scrollTo({ top: 0, behavior: "instant" });
        }
    }, [location.pathname]);
    if (isLoading) return null;
    if (isAuthenticated) return <Navigate to="/app" replace />;
    return (
        <div className="bg-background text-foreground flex h-dvh flex-col">
            <div className="w-full bg-indigo-950 flex justify-end px-2 sm:px-4 py-2"> <LanguageToggler /></div>
            <NavBar />
            <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
                <Outlet />
            </main>
        </div>
    );
}
export default MainLayout