import { useAuth } from "@/hooks/useAuth";
import { useUpdatePersonal } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, ExternalLink, User, Smartphone, Mail, Calendar, Hash } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUpdatePersonalSchema } from "@/lib/schemas/profile";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

const Personal = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const { mutate, isPending } = useUpdatePersonal();
  const { t } = useTranslation(["common", "posts", "home", "auth"]);

  const form = useForm({
    resolver: zodResolver(getUpdatePersonalSchema(t, role)),
    mode: "onTouched",
    defaultValues: {
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      email: user?.email || "",
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
      gender: user?.gender || "",
      aadhaarNumber: user?.aadhaarNumber || "",
    },
  });

  const onSubmit = (data) => {
    // Only send the fields relevant to the user role that actually changed
    const payload = {};
    if (data.fullName !== user.fullName) payload.fullName = data.fullName;
    if (data.phoneNumber !== user.phoneNumber) payload.phoneNumber = data.phoneNumber;

    if (role === "customer" && data.email !== user.email) {
      payload.email = data.email;
    }

    if (role === "worker") {
      if (data.gender !== user.gender) {
        payload.gender = data.gender;
      }
      if (!user.isVerified) {
        if (data.dateOfBirth && new Date(data.dateOfBirth).getTime() !== new Date(user.dateOfBirth).getTime()) {
          payload.dateOfBirth = data.dateOfBirth;
        }
        if (data.aadhaarNumber !== user.aadhaarNumber) {
          payload.aadhaarNumber = data.aadhaarNumber;
        }
      }
    }

    if (Object.keys(payload).length > 0) {
      mutate(payload);
    }
  };

  const isWorkerLocked = role === "worker" && user?.isVerified;

  return (
    <div className="min-h-full bg-slate-50 max-md:pb-24 pb-8 w-full">
      <div className="bg-white border-b sticky top-0 md:mb-4 z-20">
        <div className="flex items-center gap-4 p-4 md:px-0 max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-300 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">{t("common:personal_info", "Personal Information")}</h1>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-6 md:rounded-3xl max-md:border-b md:border border-gray-300 space-y-5 max-w-4xl mx-auto">

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:full_name", "Full Name")}</FormLabel>
                <FormControl>
                  <Input
                    icon={<User className="h-5 w-5" />}
                    disabled={isWorkerLocked}
                    className="h-12 bg-slate-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:phone_number", "Phone Number")}</FormLabel>
                <FormControl>
                  <Input
                    icon={<Smartphone className="h-5 w-5" />}
                    maxLength={10}
                    className="h-12 bg-slate-50"
                    {...field}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      field.onChange(val);
                    }}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {role === "customer" && (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common:email_address", "Email Address")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      icon={<Mail className="h-5 w-5" />}
                      className="h-12 bg-slate-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          )}

          {role === "worker" && (
            <>
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:dob", "Date of Birth")}</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        icon={<Calendar className="h-5 w-5" />}
                        disabled={isWorkerLocked}
                        className="h-12 bg-slate-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth:register.gender", { defaultValue: "Gender" })}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isWorkerLocked}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-slate-50 rounded-lg text-[14px]">
                          <SelectValue placeholder={t("auth:register.choose_gender", { defaultValue: "Choose gender" })} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">{t("auth:register.male", { defaultValue: "Male" })}</SelectItem>
                        <SelectItem value="female">{t("auth:register.female", { defaultValue: "Female" })}</SelectItem>
                        <SelectItem value="other">{t("auth:register.other", { defaultValue: "Other" })}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aadhaarNumber"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center mb-2">
                      <FormLabel className="mb-0">{t("common:aadhaar_number", "Aadhaar Number")}</FormLabel>
                      {isWorkerLocked && user?.aadhaarImage && (
                        <a
                          href={user.aadhaarImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          {t("common:view_aadhaar", "View Aadhaar")} <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <FormControl>
                      <Input
                        icon={<Hash className="h-5 w-5" />}
                        disabled={isWorkerLocked}
                        placeholder="XXXX XXXX XXXX"
                        maxLength={12}
                        className="h-12 bg-slate-50 font-mono tracking-widest"
                        {...field}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                          field.onChange(val);
                        }}
                      />
                    </FormControl>
                    {isWorkerLocked && (
                      <p className="text-xs text-amber-600 font-medium">{t("common:worker_locked_warning", "Name, DOB, and Aadhaar are locked for verified workers.")}</p>
                    )}
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base"
              disabled={isPending || !form.formState.isDirty}
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {t("common:save_changes", "Save Changes")}
            </Button>
          </div>

        </form>
      </Form>

    </div>
  );
};

export default Personal;
