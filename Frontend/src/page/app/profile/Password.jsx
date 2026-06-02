import { useUpdatePassword } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUpdatePasswordSchema } from "@/lib/schemas/profile";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const Password = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useUpdatePassword();
  const { t } = useTranslation(["common", "posts", "home", "auth"]);

  const form = useForm({
    resolver: zodResolver(getUpdatePasswordSchema(t)),
    mode: "onTouched",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    }, {
      onSuccess: () => {
        form.reset();
      }
    });
  };

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
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">{t("common:change_password", "Change Password")}</h1>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-6 md:rounded-3xl max-md:border-b md:border border-gray-300 space-y-5 max-w-4xl mx-auto">

          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:current_password", "Current Password")}</FormLabel>
                <FormControl>
                  <Input
                    icon={<LockKeyhole className="h-5 w-5" />}
                    type="password"
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
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:new_password", "New Password")}</FormLabel>
                <FormControl>
                  <Input
                    icon={<LockKeyhole className="h-5 w-5" />}
                    type="password"
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:confirm_new_password", "Confirm New Password")}</FormLabel>
                <FormControl>
                  <Input
                    icon={<LockKeyhole className="h-5 w-5" />}
                    type="password"
                    className="h-12 bg-slate-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base"
              disabled={isPending || !form.formState.isDirty || !form.formState.isValid}
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {t("common:update_password", "Update Password")}
            </Button>
          </div>

        </form>
      </Form>
    </div >
  );
};

export default Password;
