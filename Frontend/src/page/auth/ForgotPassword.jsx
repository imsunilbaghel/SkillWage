import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { getWorkerForgotSchema, getCustomerForgotEmailSchema, getCustomerForgotResetSchema } from "@/lib/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Smartphone, LockKeyhole, CalendarRange, Shield, Zap, Award, IdCard, Mail, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { workerForgotPassword, customerForgotSendOtp, customerForgotResetPassword } from "@/api/auth";
import { toast } from "sonner";

const ForgotPassword = () => {
    const { t } = useTranslation(["auth", "common"]);
    const navigate = useNavigate();

    // Worker Form
    const workerForm = useForm({
        resolver: zodResolver(getWorkerForgotSchema(t)),
        mode: "onTouched",
        defaultValues: {
            phoneNumber: "",
            dateOfBirth: "",
            aadhaarNumber: "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    // Customer Forms
    const [customerStep, setCustomerStep] = useState(1); // 1 = Email, 2 = OTP + Reset
    const [customerEmail, setCustomerEmail] = useState("");

    const customerEmailForm = useForm({
        resolver: zodResolver(getCustomerForgotEmailSchema(t)),
        mode: "onTouched",
        defaultValues: {
            email: ""
        }
    });

    const customerResetForm = useForm({
        resolver: zodResolver(getCustomerForgotResetSchema(t)),
        mode: "onTouched",
        defaultValues: {
            otp: "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    // Mutations
    const workerResetMutation = useMutation({
        mutationFn: workerForgotPassword,
        onSuccess: (data) => {
            toast.success(data.message || t("auth:forgot.success_reset"));
            navigate("/auth/login");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || t("auth:forgot.error_reset"));
        }
    });

    const customerSendOtpMutation = useMutation({
        mutationFn: customerForgotSendOtp,
        onSuccess: (data, variables) => {
            toast.success(data.message || t("auth:forgot.success_otp_sent"));
            setCustomerEmail(variables.email);
            setCustomerStep(2);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || t("auth:forgot.error_otp_sent"));
        }
    });

    const customerResetMutation = useMutation({
        mutationFn: customerForgotResetPassword,
        onSuccess: (data) => {
            toast.success(data.message || t("auth:forgot.success_reset"));
            navigate("/auth/login");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || t("auth:forgot.error_reset"));
        }
    });

    // Handlers
    const onSubmitWorker = (data) => workerResetMutation.mutate(data);
    const onSubmitCustomerEmail = (data) => customerSendOtpMutation.mutate(data);
    const onSubmitCustomerReset = (data) => customerResetMutation.mutate({ email: customerEmail, ...data });

    return (
        <div className="min-h-[100dvh] lg:h-screen overflow-x-hidden lg:overflow-y-auto bg-white flex flex-col">
            <div className="grid lg:grid-cols-2 min-h-[100dvh] lg:h-screen flex-1">
                {/* Left Side - Image & Branding (Desktop) */}
                <div className="relative hidden lg:flex flex-col bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900 animate-gradient overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-50 h-50 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-50 h-50 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-blob" />
                        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-blob animation-delay-500" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full px-10 py-8 justify-between">
                        <Link to="/" className="flex items-center gap-3 animate-fadeIn cursor-pointer w-fit">
                            <div className="flex items-center justify-center">
                                <img src="/image/Skillwage.png" alt="SkillWage Logo" className="w-10 h-10 object-cover" />
                            </div>
                            <span className="text-2xl font-semibold text-white tracking-wide font-poppins">SkillWage</span>
                        </Link>

                        <div className="flex-1 flex items-center justify-center py-10 relative">
                            <div className="relative animate-scaleIn animation-delay-200 group">
                                <div className="absolute top-1/2 left-1/2 w-[480px] h-[480px] border border-white/10 rounded-full animate-particle" />
                                <div className="absolute top-1/2 left-1/2 w-[360px] h-[360px] border border-white/5 rounded-full animate-particle bg-white/5" style={{ animationDelay: "300ms" }} />
                                <img src="/image/login.webp" alt="Reset Password" className="relative w-80 h-80 object-cover rounded-full shadow-2xl border-4 border-white/20" />
                            </div>
                        </div>

                        <div className="space-y-6 animate-slideUp animation-delay-400">
                            <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
                                {t("auth:forgot.branding_title")} <br />
                                <span className="text-white/90 font-medium text-2xl xl:text-3xl">{t("auth:forgot.branding_subtitle")}</span>
                            </h2>
                            <div className="flex flex-wrap gap-4 pt-2">
                                <div className="flex items-center gap-2 text-white/80 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-medium">{t("auth:login.secure_100")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex flex-col min-h-full lg:min-h-0 lg:overflow-y-auto lg:py-4">
                    {/* Mobile Header with gradient */}
                    <div className="lg:hidden relative overflow-hidden shrink-0">
                        <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900 px-6 pt-8 pb-16 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                            <div className="relative z-10 animate-slideDown">
                                <Link to="/" className="inline-flex items-center gap-2 mb-6 cursor-pointer">
                                    <img src="/image/Skillwage.png" alt="Logo" className="w-10 h-10 object-cover" />
                                    <span className="text-xl font-bold font-poppins text-white select-none">SkillWage</span>
                                </Link>
                                <h2 className="text-2xl font-bold text-white mb-2">{t("auth:forgot.title")}</h2>
                                <p className="text-white/70 text-sm">{t("auth:forgot.subtitle")}</p>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-white rounded-t-3xl" />
                    </div>

                    <div className="flex lg:flex-1 items-start lg:items-center justify-center px-4 sm:px-6 py-6 max-sm:pt-4 lg:py-0 lg:px-12 bg-white -mt-4 lg:mt-0 relative z-10">
                        <div className="w-full max-w-sm animate-fadeIn animation-delay-300">
                            <div className="hidden lg:block mb-8">
                                <h2 className="text-3xl font-bold text-gray-900">{t("auth:forgot.title")}</h2>
                                <p className="text-sm text-gray-500 mt-2">{t("auth:forgot.subtitle")}</p>
                            </div>

                            <Tabs defaultValue="worker" className="w-full gap-4" onValueChange={() => setCustomerStep(1)}>
                                <TabsList className="grid grid-cols-2 w-full p-1 bg-gray-100 rounded-xl mb-6 border">
                                    <TabsTrigger value="worker" className="rounded-lg py-2.5 text-sm transition-all duration-300 data-[state=active]:bg-indigo-700 data-[state=active]:text-white">
                                        {t("auth:login.worker_tab")}
                                    </TabsTrigger>
                                    <TabsTrigger value="customer" className="rounded-lg py-2.5 text-sm transition-all duration-300 data-[state=active]:bg-indigo-700 data-[state=active]:text-white">
                                        {t("auth:login.customer_tab")}
                                    </TabsTrigger>
                                </TabsList>

                                {/* WORKER TAB */}
                                <TabsContent value="worker" className="focus-visible:outline-none">
                                    <Form {...workerForm}>
                                        <form onSubmit={workerForm.handleSubmit(onSubmitWorker)} className="grid gap-4">
                                            <FormField control={workerForm.control} name="phoneNumber" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("auth:login.phone_label")}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={t("auth:login.phone_placeholder")} icon={<Smartphone className="h-5 w-5" />} {...field} />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )} />
                                            <FormField control={workerForm.control} name="dateOfBirth" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("auth:login.dob_label")}</FormLabel>
                                                    <FormControl>
                                                        <Input type="date" icon={<CalendarRange className="h-5 w-5" />} {...field} />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )} />
                                            <FormField control={workerForm.control} name="aadhaarNumber" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("auth:register.aadhaar_label")}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={t("auth:register.aadhaar_placeholder")} icon={<IdCard className="h-5 w-5" />} {...field} />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )} />
                                            <FormField control={workerForm.control} name="newPassword" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("auth:forgot.new_password")}</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder={t("auth:login.password_placeholder")} icon={<LockKeyhole className="h-5 w-5" />} {...field} />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )} />
                                            <FormField control={workerForm.control} name="confirmPassword" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("auth:register.confirm_password_label")}</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder={t("auth:register.confirm_password_placeholder")} icon={<LockKeyhole className="h-5 w-5" />} {...field} />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )} />
                                            <Button type="submit" disabled={!workerForm.formState.isValid || workerResetMutation.isPending} className="mt-2">
                                                {workerResetMutation.isPending ? t("auth:forgot.submitting") : t("auth:forgot.reset_password_btn")}
                                            </Button>
                                        </form>
                                    </Form>
                                </TabsContent>

                                {/* CUSTOMER TAB */}
                                <TabsContent value="customer" className="focus-visible:outline-none">
                                    {customerStep === 1 ? (
                                        <Form {...customerEmailForm}>
                                            <form onSubmit={customerEmailForm.handleSubmit(onSubmitCustomerEmail)} className="grid gap-4">
                                                <FormField control={customerEmailForm.control} name="email" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("auth:register.email_label")}</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder={t("auth:register.email_placeholder")} icon={<Mail className="h-5 w-5" />} {...field} />
                                                        </FormControl>
                                                        <FormMessage className="text-xs" />
                                                    </FormItem>
                                                )} />
                                                <Button type="submit" disabled={!customerEmailForm.formState.isValid || customerSendOtpMutation.isPending} className="mt-2">
                                                    {customerSendOtpMutation.isPending ? t("auth:forgot.sending") : t("auth:forgot.send_otp_btn")}
                                                </Button>
                                            </form>
                                        </Form>
                                    ) : (
                                        <Form {...customerResetForm}>
                                            <form onSubmit={customerResetForm.handleSubmit(onSubmitCustomerReset)} className="grid gap-4">
                                                <p className="text-sm text-slate-600 mb-2">
                                                    {t("auth:forgot.otp_sent_to")} <span className="font-semibold text-slate-900">{customerEmail}</span>
                                                </p>
                                                <FormField control={customerResetForm.control} name="otp" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("auth:forgot.otp_label")}</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="123456" icon={<KeyRound className="h-5 w-5" />} {...field} />
                                                        </FormControl>
                                                        <FormMessage className="text-xs" />
                                                    </FormItem>
                                                )} />
                                                <FormField control={customerResetForm.control} name="newPassword" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("auth:forgot.new_password")}</FormLabel>
                                                        <FormControl>
                                                            <Input type="password" placeholder={t("auth:login.password_placeholder")} icon={<LockKeyhole className="h-5 w-5" />} {...field} />
                                                        </FormControl>
                                                        <FormMessage className="text-xs" />
                                                    </FormItem>
                                                )} />
                                                <FormField control={customerResetForm.control} name="confirmPassword" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("auth:register.confirm_password_label")}</FormLabel>
                                                        <FormControl>
                                                            <Input type="password" placeholder={t("auth:register.confirm_password_placeholder")} icon={<LockKeyhole className="h-5 w-5" />} {...field} />
                                                        </FormControl>
                                                        <FormMessage className="text-xs" />
                                                    </FormItem>
                                                )} />
                                                <Button type="submit" disabled={!customerResetForm.formState.isValid || customerResetMutation.isPending} className="mt-2">
                                                    {customerResetMutation.isPending ? t("auth:forgot.submitting") : t("auth:forgot.reset_password_btn")}
                                                </Button>
                                                <Button type="button" variant="ghost" onClick={() => setCustomerStep(1)} className="w-full text-sm">
                                                    {t("auth:register.back")}
                                                </Button>
                                            </form>
                                        </Form>
                                    )}
                                </TabsContent>
                            </Tabs>

                            <div className="text-center pt-6">
                                <p className="text-xs text-gray-500">
                                    {t("auth:forgot.remember_password")}{" "}
                                    <Link to="/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                                        {t("auth:register.login_link")}
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
