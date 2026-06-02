import { NavLink, useLocation } from "react-router";
import image from "/image/Skillwage.png"
import { cn } from "@/lib/utils";
import { House, HardHat, Headset, LogIn, FileUser, User as UserIcon, ListTodo, PlusCircle, LogOut } from 'lucide-react';
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";

const NavBar = () => {
    const { pathname } = useLocation();
    const { t } = useTranslation("common");
    const { user, role, isAuthenticated, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleBurgerClick = () => setIsMenuOpen(!isMenuOpen);

    let navdata = [];

    if (isAuthenticated) {
        if (role === "customer") {
            navdata = [
                { label: t("nav.home"), path: "/app", icon: House },
                { label: t("nav.requests"), path: "/app/requests", icon: ListTodo },
                { label: t("nav.post"), path: "/app/post", icon: PlusCircle }, // Placeholder for future feature
                { label: t("nav.profile"), path: "/app/profile", icon: UserIcon },
            ];
        } else if (role === "worker") {
            navdata = [
                { label: t("nav.home"), path: "/app", icon: House },
                // { label: t("nav.post"), path: "/app/post", icon: PlusCircle },
                { label: t("nav.requests"), path: "/app/requests", icon: ListTodo },
                { label: t("nav.profile"), path: "/app/profile", icon: UserIcon },
            ];
        }
    } else {
        navdata = ((pathname == "/" || pathname == "/service" || pathname == "/contactus") ? [
            { label: t("nav.home"), path: "/", icon: House },
            { label: t("nav.services"), path: "/service", icon: HardHat },
            { label: t("nav.contact"), path: "/contactus", icon: Headset },
            { label: t("nav.login"), path: "/auth/login", icon: LogIn }
        ] : [
            { label: t("nav.home"), path: "/", icon: HardHat },
            { label: t("nav.register"), path: "/auth/register", icon: FileUser }
        ]);
    }

    return (
        <>
            {/* TOP NAVBAR (Desktop) */}
            <nav className="justify-between shadow-md p-4 sticky top-0 bg-white z-50 gap-4 md:gap-0 md:flex hidden">
                <div className="flex justify-between items-center w-full">
                    <NavLink to={isAuthenticated ? "/app" : "/"} className="flex flex-row items-center gap-4 text-black font-semibold">
                        <img src={image} alt="" className="w-12 md:w-20" />
                        <div className="flex flex-col">
                            <span className="text-xl md:text-2xl">SkillWage</span>
                            <span className="text-sm md:text-md">{t("brand.tagline")}</span>
                        </div>
                    </NavLink>

                    <div className="hidden md:flex items-center gap-4 justify-center flex-wrap pt-4 md:p-0">
                        {navdata.map(({ label, icon: Icon, path }) => (
                            <NavLink to={path} key={label} end={path === "/app" || path === "/"}
                                className={({ isActive }) =>
                                    cn(
                                        "relative flex items-center gap-2 xl:px-3 px-1.5 py-2 font-medium border-2 border-indigo-700 text-indigo-700 rounded-lg transition-all",
                                        isActive
                                            ? "bg-indigo-700 text-white"
                                            : "hover:bg-indigo-700/10"
                                    )
                                }
                            >
                                <Icon className="h-5 w-5 " />
                                <span className="hidden lg:block">{label}</span>
                            </NavLink>
                        ))}
                        {isAuthenticated && (
                            <Button variant="outline" className="gap-2 border-2 text-red-600 border-red-400 hover:bg-red-50 hover:text-red-700 w-fit py-2 h-11" onClick={() => logout()}>
                                <LogOut className="w-4 h-4" /> Logout
                            </Button>
                        )}
                    </div>
                </div>
            </nav>

            {/* BOTTOM FOR PUBLIC PAGE MOBILE */}
            <nav className={cn(
                "flex justify-between items-center shadow-md p-4 sticky top-0 bg-white z-50 md:hidden",
                isAuthenticated ? "hidden" : "flex"
            )}>
                <NavLink to={isAuthenticated ? "/app" : "/"} className="flex flex-row items-center gap-3 text-black font-semibold">
                    <img src={image} alt="" className="w-10" />
                    <div className="flex flex-col">
                        <span className="text-lg">SkillWage</span>
                    </div>
                </NavLink>
            </nav>

            {/* MOBILE MENU (Unauthenticated only) */}
            {!isAuthenticated && (
                <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white/50 backdrop-blur-xs border border-gray-100 rounded-2xl z-50 max-w-md mx-auto">
                    <div className="flex items-center justify-between p-2">
                        {navdata.map(({ label, icon: Icon, path }) => (
                            <NavLink
                                to={path}
                                key={label}
                                end={path === "/app" || path === "/"}
                                className={({ isActive }) =>
                                    cn(
                                        "flex flex-col items-center justify-center py-2 px-2.5 rounded-xl gap-1 transition-all duration-200 w-full ",
                                        isActive
                                            ? "text-white bg-indigo-600 font-semibold"
                                            : "text-slate-800 hover:text-indigo-600 hover:bg-slate-50/50"
                                    )
                                }
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-[10px] font-medium">{label}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}

            {/* BOTTOM NAV BAR (Mobile Authenticated) */}
            {isAuthenticated && (
                <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white/50 backdrop-blur-xs border border-gray-200 rounded-2xl z-50 max-w-md mx-auto">
                    <div className="flex items-center justify-between p-2">
                        {navdata.map(({ label, icon: Icon, path }) => (
                            <NavLink
                                to={path}
                                key={label}
                                end={path === "/app" || path === "/"}
                                className={({ isActive }) =>
                                    cn(
                                        "flex flex-col items-center justify-center py-2 px-2.5 rounded-xl gap-1 transition-all duration-200 w-full ",
                                        isActive
                                            ? "text-white bg-indigo-700 font-semibold"
                                            : "text-slate-800 hover:text-indigo-600 hover:bg-slate-50/50"
                                    )
                                }
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-[10px] font-medium">{label}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default NavBar;