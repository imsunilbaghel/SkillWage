import { useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router";
import NavBar from "../NavBar";
import LanguageToggler from "../LanguageToggler";
import { useAuth } from "@/hooks/useAuth";

const AppLayout = () => {
    const location = useLocation();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        const content = document.querySelector("main");
        if (content) {
            content.scrollTo({ top: 0, behavior: "instant" });
        } else {
            window.scrollTo({ top: 0, behavior: "instant" });
        }
    }, [location.pathname]);

    if (isLoading) return null;

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return (
        <div className="bg-background text-foreground flex h-dvh flex-col">
            <div className="w-full bg-indigo-950 flex justify-end px-2 sm:px-4 py-2 max-md:hidden"> <LanguageToggler /></div>
            <NavBar />
            <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 bg-[#F9FBFF]">
                <Outlet />
            </main>
        </div>
    );
}
export default AppLayout;
