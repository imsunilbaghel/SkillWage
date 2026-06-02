import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { getCustomerLoginSchema, getWorkerLoginSchema } from "@/lib/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Smartphone, LockKeyhole, CalendarRange, Shield, Zap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginWorker, loginCustomer } from "@/api/auth";
import { toast } from "sonner";

const Login = () => {
    const { t } = useTranslation(["auth", "common"]);
    const workerform = useForm({
        resolver: zodResolver(getWorkerLoginSchema(t)),
        mode: "onTouched",
        reValidateMode: "onChange",
        defaultValues: {
            phoneNumber: "",
            dateofbirth: "",
            password: ""
        }
    });
    const customerform = useForm({
        resolver: zodResolver(getCustomerLoginSchema(t)),
        mode: "onTouched",
        reValidateMode: "onChange",
        defaultValues: {
            phoneNumber: "",
            password: ""
        }
    });
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const from = location.state?.from?.pathname || "/app";

    const workerLoginMutation = useMutation({
        mutationFn: loginWorker,
        onSuccess: (data) => {
            toast.success(data.message || t("auth:login.success_worker"));
            // Immediately populate the auth cache so AppLayout guard sees the user instantly
            queryClient.setQueryData(["authUser"], {
                data: {
                    user: data.data.user,
                    role: data.data.user.role || "worker",
                }
            });
            localStorage.setItem("isAuthenticated", "true");
            navigate(from, { replace: true });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || t("auth:login.error_worker"));
        }
    });

    const customerLoginMutation = useMutation({
        mutationFn: loginCustomer,
        onSuccess: (data) => {
            toast.success(data.message || t("auth:login.success_customer"));
            // Immediately populate the auth cache so AppLayout guard sees the user instantly
            queryClient.setQueryData(["authUser"], {
                data: {
                    user: data.data.user,
                    role: data.data.user.role || "customer",
                }
            });
            localStorage.setItem("isAuthenticated", "true");
            navigate(from, { replace: true });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || t("auth:login.error_customer"));
        }
    });

    const onSubmitWorker = (data) => {
        workerLoginMutation.mutate(data);
    }
    const onSubmitCustomer = (data) => {
        customerLoginMutation.mutate(data);
    }

    return (
        <div className="min-h-[100dvh] lg:h-screen overflow-x-hidden lg:overflow-y-auto bg-white flex flex-col">
            <div className="grid lg:grid-cols-2 min-h-[100dvh] lg:h-screen flex-1">
                {/* Left Side - Image & Branding (Desktop) */}
                <div className="relative hidden lg:flex flex-col bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900 animate-gradient overflow-hidden">
                    {/* Decorative animated elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-50 h-50 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-50 h-50 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-blob" />
                        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-blob animation-delay-500" />
                        <div className="absolute inset-0 spotlight-effect opacity-20" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full px-10 py-8 justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 animate-fadeIn cursor-pointer w-fit">
                            <div className="flex items-center justify-center">
                                <img
                                    src="/image/Skillwage.png"
                                    alt="SkillWage Logo"
                                    className="w-10 h-10 object-cover"
                                />
                            </div>
                            <span className="text-2xl font-semibold text-white tracking-wide font-poppins">SkillWage</span>
                        </Link>

                        {/* Center Image */}
                        <div className="flex-1 flex items-center justify-center py-10 relative">
                            <div className="relative animate-scaleIn animation-delay-200 group">
                                <div className="absolute top-1/2 left-1/2 w-[480px] h-[480px] border border-white/10 rounded-full animate-particle" />
                                <div className="absolute top-1/2 left-1/2 w-[360px] h-[360px] border border-white/5 rounded-full animate-particle bg-white/5" style={{ animationDelay: "300ms" }} />
                                <img
                                    src="/image/login.webp"
                                    alt="SkillWage Platform"
                                    className="relative w-80 h-80 object-cover rounded-full shadow-2xl border-4 border-white/20"
                                />
                            </div>
                        </div>

                        {/* Bottom Content */}
                        <div className="space-y-6 animate-slideUp animation-delay-400">
                            <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
                                {t("auth:login.branding_title")} <br />
                                <span className="text-white/90 font-medium text-2xl xl:text-3xl">{t("auth:login.branding_subtitle")}</span>
                            </h2>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap gap-4 pt-2">
                                <div className="flex items-center gap-2 text-white/80 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-medium">{t("auth:login.secure_100")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/80 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-medium">{t("auth:login.instant_match")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/80 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                        <Award className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-medium">{t("auth:login.verified_profiles")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex flex-col min-h-full lg:min-h-0 lg:overflow-y-auto lg:py-4">
                    {/* Mobile Header with gradient */}
                    <div className="lg:hidden relative overflow-hidden shrink-0">
                        {/* Gradient Background */}
                        <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900 px-6 pt-8 pb-16 relative">
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                            <div className="relative z-10 animate-slideDown">
                                <Link to="/" className="inline-flex items-center gap-2 mb-6 cursor-pointer">
                                    <div className="flex items-center justify-center">
                                        <img
                                            src="/image/Skillwage.png"
                                            alt="SkillWage Logo"
                                            className="w-10 h-10 object-cover"
                                        />
                                    </div>
                                    <span className="text-xl font-bold font-poppins text-white select-none">SkillWage</span>
                                </Link>

                                <h2 className="text-2xl font-bold text-white mb-2">{t("auth:login.welcome_back_mobile")}</h2>
                                <p className="text-white/70 text-sm">{t("auth:login.continue_journey_mobile")}</p>
                            </div>
                        </div>

                        {/* Curved bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-white rounded-t-3xl" />
                    </div>

                    {/* Form Container */}
                    <div className="flex lg:flex-1 items-start lg:items-center justify-center px-4 sm:px-6 py-6 max-sm:pt-4 lg:py-0 lg:px-12 bg-white -mt-4 lg:mt-0 relative z-10">
                        <div className="w-full max-w-sm animate-fadeIn animation-delay-300">
                            {/* Desktop Header */}
                            <div className="hidden lg:block mb-8">
                                <h2 className="text-3xl font-bold text-gray-900">{t("auth:login.title")}</h2>
                                <p className="text-sm text-gray-500 mt-2">{t("auth:login.subtitle")}</p>
                            </div>

                            <Tabs defaultValue="worker" className="w-full gap-4">
                                <TabsList className="grid grid-cols-2 w-full p-1 bg-gray-100 rounded-xl mb-6 border">
                                    <TabsTrigger
                                        value="worker"
                                        className="rounded-lg py-2.5 text-sm transition-all duration-300 data-[state=active]:bg-indigo-700 data-[state=active]:text-white cursor-pointer"
                                    >
                                        {t("auth:login.worker_tab")}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="customer"
                                        className="rounded-lg py-2.5 text-sm transition-all duration-300 data-[state=active]:bg-indigo-700 data-[state=active]:text-white cursor-pointer"
                                    >
                                        {t("auth:login.customer_tab")}
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="worker" className="focus-visible:outline-none">
                                    <Form {...workerform}>
                                        <form onSubmit={workerform.handleSubmit(onSubmitWorker)} className="grid gap-6">
                                            <FormField
                                                control={workerform.control}
                                                name="phoneNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("auth:login.phone_label")}</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="text"
                                                                placeholder={t("auth:login.phone_placeholder")}
                                                                icon={<Smartphone className="h-5 w-5" />}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-xs" />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={workerform.control}
                                                name="dateofbirth"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("auth:login.dob_label")}</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="date"
                                                                placeholder={t("auth:login.dob_placeholder")}
                                                                icon={<CalendarRange className="h-5 w-5" />}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-xs" />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={workerform.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("auth:login.password_label")}</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="password"
                                                                placeholder={t("auth:login.password_placeholder")}
                                                                icon={<LockKeyhole className="h-5 w-5" />}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-xs" />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="flex justify-end -mt-3">
                                                <Link to="/auth/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                                                    {t("auth:login.forgot_password_link")}
                                                </Link>
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={!workerform.formState.isValid || workerLoginMutation.isPending}
                                            >
                                                {workerLoginMutation.isPending ? t("auth:login.submitting") : t("auth:login.submit")}
                                            </Button>
                                        </form>
                                    </Form>
                                </TabsContent>

                                <TabsContent value="customer" className="focus-visible:outline-none">
                                    <Form {...customerform}>
                                        <form onSubmit={customerform.handleSubmit(onSubmitCustomer)} className="grid gap-6">
                                            <FormField
                                                control={customerform.control}
                                                name="phoneNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("auth:login.phone_label")}</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="text"
                                                                placeholder={t("auth:login.phone_placeholder")}
                                                                icon={<Smartphone className="h-5 w-5" />}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-xs" />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={customerform.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("auth:login.password_label")}</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="password"
                                                                placeholder={t("auth:login.password_placeholder")}
                                                                icon={<LockKeyhole className="h-5 w-5" />}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-xs" />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="flex justify-end -mt-3">
                                                <Link to="/auth/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                                                    {t("auth:login.forgot_password_link")}
                                                </Link>
                                            </div>
                                            <Button
                                                type="submit"
                                                variant="default"
                                                disabled={!customerform.formState.isValid || customerLoginMutation.isPending}

                                            >
                                                {customerLoginMutation.isPending ? t("auth:login.submitting") : t("auth:login.submit")}
                                            </Button>
                                        </form>
                                    </Form>
                                </TabsContent>
                            </Tabs>

                            <div className="text-center pt-6">
                                <p className="text-xs text-gray-500">
                                    {t("auth:login.no_account")}{" "}
                                    <Link to="/auth/register" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                                        {t("auth:login.register_link")}
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Footer */}
                    <div className="lg:hidden px-6 pb-8 animate-fadeIn animation-delay-600">
                        <div className="max-w-sm mx-auto flex items-center justify-center gap-4 py-4 px-4 bg-gray-100 rounded-2xl">
                            <div className="flex items-center gap-1.5 text-gray-600">
                                <div className="w-7 h-7 rounded-lg bg-indigo-700/10 flex items-center justify-center">
                                    <Shield className="w-3.5 h-3.5 text-indigo-700" />
                                </div>
                                <span className="text-xs font-medium">{t("auth:login.secure")}</span>
                            </div>
                            <div className="w-px h-6 bg-gray-200" />
                            <div className="flex items-center gap-1.5 text-gray-600">
                                <div className="w-7 h-7 rounded-lg bg-indigo-700/10 flex items-center justify-center">
                                    <Zap className="w-3.5 h-3.5 text-indigo-700" />
                                </div>
                                <span className="text-xs font-medium">{t("auth:login.match")}</span>
                            </div>
                            <div className="w-px h-6 bg-gray-200" />
                            <div className="flex items-center gap-1.5 text-gray-600">
                                <div className="w-7 h-7 rounded-lg bg-indigo-700/10 flex items-center justify-center">
                                    <Award className="w-3.5 h-3.5 text-indigo-700" />
                                </div>
                                <span className="text-xs font-medium">{t("auth:login.verified")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Login;