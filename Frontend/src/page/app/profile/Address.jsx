import { useState } from "react";
import { useUpdateAddress } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Search, MapPin, MapPinned, Building2 } from "lucide-react";
import { useNavigate } from "react-router";
import { fetchPostalCodeData } from "@/api/location";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUpdateAddressSchema } from "@/lib/schemas/profile";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Textarea } from "@/components/ui/textarea";

const Address = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { mutate, isPending } = useUpdateAddress();
  const { t } = useTranslation(["common", "posts", "home", "auth"]);

  const form = useForm({
    resolver: zodResolver(getUpdateAddressSchema(t)),
    mode: "onTouched",
    defaultValues: {
      address: user?.address || "",
      pincode: user?.pincode || "",
      subdivision: user?.subdivision || "",
      city: user?.city || "",
      state: user?.state || "",
    },
  });

  const [isLookingUpPincode, setIsLookingUpPincode] = useState(false);
  const [subdivisionsList, setSubdivisionsList] = useState(user?.subdivision ? [user.subdivision] : []);

  const pincodeValue = form.watch("pincode");

  const lookupPincode = async () => {
    if (!pincodeValue || pincodeValue.length !== 6) {
      toast.error(t("common:invalid_pincode", "Please enter a valid 6-digit pincode"));
      return;
    }

    setIsLookingUpPincode(true);
    try {
      const postOffices = await fetchPostalCodeData(pincodeValue);

      // Extract subdivisions for dropdown
      const subdivisions = [...new Set(postOffices.map((po) => po.Name))];
      setSubdivisionsList(subdivisions);

      form.setValue("city", postOffices[0].District, { shouldDirty: true });
      form.setValue("state", postOffices[0].State, { shouldDirty: true });
      if (subdivisions.length === 1) {
        form.setValue("subdivision", subdivisions[0], { shouldValidate: true, shouldDirty: true });
      } else {
        form.setValue("subdivision", "", { shouldDirty: true });
      }

      toast.success(t("common:location_fetched", "Location details fetched"));
    } catch (error) {
      toast.error(t("common:pincode_lookup_failed", "Failed to lookup pincode. Service might be down."));
      setSubdivisionsList([]);
      form.setValue("city", "", { shouldDirty: true });
      form.setValue("state", "", { shouldDirty: true });
      form.setValue("subdivision", "", { shouldDirty: true });
    } finally {
      setIsLookingUpPincode(false);
    }
  };

  const onSubmit = (data) => {
    mutate(data);
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
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">{t("common:address_title", "Address Info")}</h1>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-6 md:rounded-3xl max-md:border-b md:border border-gray-300 space-y-5 max-w-4xl mx-auto">

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:full_address", "Full Address")}</FormLabel>
                <FormControl>
                  <Textarea
                    icon={<MapPin className="h-5 w-5" />}
                    placeholder={t("common:address_placeholder", "House No, Street, Landmark")}
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
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:pincode", "Pincode")}</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      icon={<MapPin className="h-5 w-5" />}
                      maxLength={6}
                      className="bg-slate-50"
                      {...field}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                        field.onChange(val);
                      }}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    onClick={lookupPincode}
                    disabled={isLookingUpPincode || !field.value || field.value.length !== 6}
                    className="h-12 px-6 bg-primary"
                  >
                    {isLookingUpPincode ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </Button>
                </div>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subdivision"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:subdivision", "Subdivision / Area")}</FormLabel>
                {subdivisionsList.length > 0 ? (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-slate-50">
                        <SelectValue placeholder={t("common:select_area", "Select Area")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subdivisionsList.map((sub, idx) => (
                        <SelectItem key={idx} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <FormControl>
                    <Input
                      placeholder={t("common:enter_subdivision", "Enter subdivision")}
                      className="h-12 bg-slate-50"
                      {...field}
                    />
                  </FormControl>
                )}
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common:city", "City/District")}</FormLabel>
                  <FormControl>
                    <Input
                      icon={<Building2 className="h-5 w-5" />}
                      readOnly
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
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common:state", "State")}</FormLabel>
                  <FormControl>
                    <Input
                      icon={<MapPinned className="h-5 w-5" />}
                      readOnly
                      className="h-12 bg-slate-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base"
              disabled={isPending || !form.formState.isDirty}
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {t("common:update_address", "Update Address")}
            </Button>
          </div>

        </form>
      </Form>
    </div>
  );
};

export default Address;
