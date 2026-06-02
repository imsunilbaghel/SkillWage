import { useAuth } from "@/hooks/useAuth";
import { useUpdateServiceCharge } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, IndianRupee } from "lucide-react";
import { useNavigate, Navigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUpdateServiceChargeSchema } from "@/lib/schemas/profile";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const ServiceCharge = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const { mutate, isPending } = useUpdateServiceCharge();
  const { t } = useTranslation(["common", "posts", "home", "auth"]);

  const form = useForm({
    resolver: zodResolver(getUpdateServiceChargeSchema(t)),
    mode: "onTouched",
    defaultValues: {
      serviceCharge: user?.serviceCharge ? String(user.serviceCharge) : "",
    },
  });

  const onSubmit = (data) => {
    mutate({ serviceCharge: data.serviceCharge });
  };
  if (role === "customer") {
    return <Navigate to="/app/profile" replace />;
  }
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
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">{t("common:service_charge", "Service Charge")}</h1>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-6 md:rounded-3xl max-md:border-b md:border border-gray-300 space-y-5 max-w-4xl mx-auto">

          <FormField
            control={form.control}
            name="serviceCharge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:daily_service_charge", "Daily Service Charge")}</FormLabel>
                <FormControl>
                  <Input
                    icon={<IndianRupee className="h-5 w-5" />}
                    type="number"
                    placeholder="e.g. 500"
                    className="h-12 bg-slate-50"
                    {...field}
                  />
                </FormControl>
                <p className="text-xs text-slate-500">{t("common:service_charge_help", "This is your estimated daily rate. Customers will see this when looking at your profile.")}</p>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base"
              disabled={isPending || !form.formState.isDirty}
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {t("common:update_service_charge", "Update Service Charge")}
            </Button>
          </div>

        </form>
      </Form>
    </div>
  );
};

export default ServiceCharge;
