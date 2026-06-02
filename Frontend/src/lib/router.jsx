import { createBrowserRouter } from "react-router";
import MainLayout from "@/components/layouts/MainLayout";
import Service from "@/page/Service";
import HomePage from "@/page/HomePage";
import Contactus from "@/page/Contactus";
import AuthLayout from "@/components/layouts/AuthLayout";
import Login from "@/page/auth/Login";
import RegistrationPage from "@/page/auth/RegistrationPage";
import AppHome from "@/page/app/AppHome";
import PostPage from "@/page/app/PostPage";
import Requests from "@/page/app/Requests";
import ProfileMenu from "@/page/app/profile/ProfileMenu";
import Personal from "@/page/app/profile/Personal";
import Address from "@/page/app/profile/Address";
import ServiceCharge from "@/page/app/profile/ServiceCharge";
import Password from "@/page/app/profile/Password";
import SupportPage from "@/page/app/profile/SupportPage";
import AppLayout from "@/components/layouts/AppLayout";
import AdminLayout from "@/components/layouts/AdminLayout";
import AdminLogin from "@/page/admin/AdminLogin";
import AdminSupport from "@/page/admin/AdminSupport";
import AdminWorkers from "@/page/admin/AdminWorkers";
import AdminCustomers from "@/page/admin/AdminCustomers";
import AdminRequests from "@/page/admin/AdminRequests";
import AdminContacts from "@/page/admin/AdminContacts";

import ForgotPassword from "@/page/auth/ForgotPassword";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "",
                element: <HomePage />
            },
            {
                path: "service",
                element: <Service />
            },
            {
                path: "contactus",
                element: <Contactus />
            }
        ]
    },
    {
        path: "/app",
        element: <AppLayout />,
        children: [
            {
                path: "",
                element: <AppHome />
            },
            {
                path: "requests",
                element: <Requests />
            },
            {
                path: "post",
                element: <PostPage />
            },
            {
                path: "profile",
                children: [
                    { path: "", element: <ProfileMenu /> },
                    { path: "personal", element: <Personal /> },
                    { path: "address", element: <Address /> },
                    { path: "service-charge", element: <ServiceCharge /> },
                    { path: "password", element: <Password /> },
                    { path: "support", element: <SupportPage /> }
                ]
            }
        ]
    },
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <RegistrationPage />
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            }
        ]
    },
    {
        path: "/admin/login",
        element: <AdminLogin />
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                path: "support",
                element: <AdminSupport />
            },
            {
                path: "workers",
                element: <AdminWorkers />
            },
            {
                path: "customers",
                element: <AdminCustomers />
            },
            {
                path: "requests",
                element: <AdminRequests />
            },
            {
                path: "contacts",
                element: <AdminContacts />
            }
        ]
    }
])