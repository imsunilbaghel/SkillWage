import { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getWorkerRegistrationSchema } from "@/lib/schemas/registration";
import { useMutation } from "@tanstack/react-query";
import RegistrationSuccessModal from "./RegistrationSuccessModal";
import { getUploadSignature, uploadToCloudinary } from "@/api/cloudinary";
import { registerWorker } from "@/api/auth";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  User, Smartphone, CalendarRange, IdCard, MapPin, Hash,
  Building2, MapPinned, IndianRupee, Upload, FileCheck,
  ChevronRight, ChevronLeft, Check, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { useLocationByPincode } from "@/hooks/useLocation";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

const STEPS = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Address", icon: MapPin },
  { id: 3, title: "Documents", icon: FileCheck },
];

export default function WorkerRegistrationForm({ currentStep = 1, setCurrentStep = () => { }, hideIndicator = true }) {
  const { t } = useTranslation(["auth", "common"]);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [aadhaarPreview, setAadhaarPreview] = useState(null);
  const [subdivisions, setSubdivisions] = useState([]);
  const [imageError, setImageError] = useState("");
  const [aadhaarFileError, setAadhaarFileError] = useState("");
  const [registeredPassword, setRegisteredPassword] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const profileInputRef = useRef(null);
  const aadhaarInputRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Update canSubmit when files are selected
  useEffect(() => {
    setCanSubmit(!!profileImage && !!aadhaarFile);
  }, [profileImage, aadhaarFile]);

  const form = useForm({
    resolver: zodResolver(getWorkerRegistrationSchema(t)),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      dateOfBirth: "",
      gender: "",
      aadhaarNumber: "",
      address: "",
      pincode: "",
      subdivision: "",
      city: "",
      state: "",
      serviceCharge: "",
      occupation: "",
    },
  });

  const pincodeValue = form.watch("pincode");
  const { data: offices, isLoading: pincodeLoading, isError } = useLocationByPincode(pincodeValue);

  useEffect(() => {
    if (offices && offices.length > 0) {
      setSubdivisions(offices.map((o) => o.Name));
      form.setValue("city", offices[0].District);
      form.setValue("state", offices[0].State);
      if (offices.length === 1) {
        form.setValue("subdivision", offices[0].Name, { shouldValidate: true });
      } else {
        form.setValue("subdivision", "", { shouldValidate: false });
      }
    } else if (isError) {
      setSubdivisions([]);
      form.setValue("city", "");
      form.setValue("state", "");
      form.setValue("subdivision", "");
      toast.error(t("auth:validation.pincode_not_found"));
    } else if (pincodeValue && pincodeValue.length !== 6) {
      setSubdivisions([]);
      form.setValue("city", "");
      form.setValue("state", "");
      form.setValue("subdivision", "");
    }
  }, [offices, isError, form, pincodeValue, t]);

  // ── Aadhaar formatting ──
  const handleAadhaarChange = (value, onChange) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1-");
    onChange(formatted);
  };

  // ── File handlers ──
  const handleProfileImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 500 * 1024) {
      setImageError(t("auth:validation.profile_image_size"));
      return;
    }

    setImageError("");
    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleAadhaarFile = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 500 * 1024) {
      setAadhaarFileError(t("auth:validation.aadhaar_size"));
      return;
    }

    setAadhaarFile(file);
    setAadhaarPreview(URL.createObjectURL(file));
  };

  // ── Step validation ──
  const step1Fields = ["fullName", "phoneNumber", "dateOfBirth", "gender", "aadhaarNumber"];
  const step2Fields = ["address", "pincode", "subdivision", "serviceCharge", "occupation"];

  const canProceed = (step) => {
    const fields = step === 1 ? step1Fields : step2Fields;
    const values = form.getValues();
    const errors = form.formState.errors;
    return fields.every((f) => values[f] && !errors[f]);
  };

  const goNext = async () => {
    const fields = currentStep === 1 ? step1Fields : step2Fields;
    const valid = await form.trigger(fields);
    if (valid) setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const registerMutation = useMutation({
    mutationFn: async ({ registrationData, profileFile, aadhaarFile }) => {
      const toastId = toast.loading(t("auth:register.uploading_images"));

      try {
        // 1. Get Signature
        const sigData = await getUploadSignature();
        if (!sigData?.success) {
          throw new Error(t("auth:register.failed_signature"));
        }

        const { signature, timestamp } = sigData.data;

        // 2. Upload Files
        toast.loading(t("auth:register.uploading_profile"), { id: toastId });
        const profileImageUrl = await uploadToCloudinary(profileFile, timestamp, signature);

        toast.loading(t("auth:register.uploading_aadhaar"), { id: toastId });
        const aadhaarImageUrl = await uploadToCloudinary(aadhaarFile, timestamp, signature);

        // 3. Register Worker
        toast.loading(t("auth:register.registering_worker"), { id: toastId });

        const registerData = await registerWorker({
          ...registrationData,
          profileImage: profileImageUrl,
          aadhaarImage: aadhaarImageUrl
        });

        toast.success(t("auth:register.success_toast"), { id: toastId });
        return registerData;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || t("auth:register.error_toast");
        toast.error(errorMessage, { id: toastId });
        throw error;
      }
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      if (response.data?.generatedPassword) {
        setRegisteredPassword(response.data.generatedPassword);
      } else {
        navigate("/app");
      }
    }
  });

  const onSubmit = async (data) => {
    if (!profileImage) {
      setImageError(t("auth:register.profile_photo_required"));
      return;
    }
    if (!aadhaarFile) {
      setAadhaarFileError(t("auth:register.aadhaar_required"));
      return;
    }

    registerMutation.mutate({
      registrationData: data,
      profileFile: profileImage,
      aadhaarFile: aadhaarFile,
    });
  };

  // ── Progress ──
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="relative">
      {/* ─── Step Indicator ─── */}
      {!hideIndicator && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        relative w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold
                        transition-all duration-500 ease-out
                        ${isCompleted
                          ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-100"
                          : isActive
                            ? "bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/40 scale-110"
                            : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 animate-in zoom-in-50 duration-300" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                      {isActive && (
                        <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium transition-colors duration-300 ${isActive ? "text-primary" : isCompleted ? "text-emerald-600" : "text-gray-400"
                      }`}>
                      {step.id === 1 ? t("auth:register.personal_info_step") : step.id === 2 ? t("auth:register.address_rate_step") : t("auth:register.upload_docs_step")}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className="flex-1 h-[3px] mx-3 mt-[-20px] rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-primary transition-all duration-700 ease-out"
                        style={{ width: isCompleted ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-purple-500 to-chart-4 transition-all duration-700 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
      )}

      {/* ─── Form ─── */}
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Step 1: Personal Info */}
          <div className={`transition-all duration-500 ${currentStep === 1 ? "animate-in slide-in-from-right-5 fade-in-0 duration-400" : "hidden"}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              <h3 className="text-lg font-semibold text-primary lg:col-span-2">
                {t("auth:register.personal_info")}
              </h3>

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth:register.full_name")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("auth:register.full_name_placeholder")}
                        icon={<User className="h-5 w-5" />}
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
                    <FormLabel>{t("auth:login.phone_label")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("auth:register.phone_reg_placeholder")}
                        icon={<Smartphone className="h-5 w-5" />}
                        maxLength={10}
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

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth:login.dob_label")}</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        icon={<CalendarRange className="h-5 w-5" />}
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger size="default" className="rounded-lg text-[14px]">
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
                    <FormLabel>{t("auth:register.aadhaar_label")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("auth:register.aadhaar_placeholder")}
                        icon={<IdCard className="h-5 w-5" />}
                        maxLength={14}
                        value={field.value}
                        onChange={(e) => handleAadhaarChange(e.target.value, field.onChange)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Step 2: Address */}
          <div className={`transition-all duration-500 ${currentStep === 2 ? "animate-in slide-in-from-right-5 fade-in-0 duration-400" : "hidden"}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              <h3 className="text-lg text-primary font-semibold lg:col-span-2">
                {t("auth:register.address_service")}
              </h3>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>{t("auth:register.full_address")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("auth:register.address_placeholder")}
                        className="min-h-20 resize-none"
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
                    <FormLabel>{t("auth:register.pincode")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("auth:register.pincode_placeholder")}
                        icon={<Hash className="h-5 w-5" />}
                        maxLength={6}
                        {...field}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                          field.onChange(val);
                        }}
                      />
                    </FormControl>
                    {pincodeLoading && (
                      <div className="flex items-center gap-2 text-xs text-primary">
                        <Loader2 className="w-3 h-3 animate-spin" /> {t("auth:register.fetching_location")}
                      </div>
                    )}
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth:register.city")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("auth:register.auto_filled")}
                        icon={<Building2 className="h-5 w-5" />}
                        readOnly
                        className="bg-gray-50"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth:register.state")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("auth:register.auto_filled")}
                        icon={<MapPinned className="h-5 w-5" />}
                        readOnly
                        className="bg-gray-50"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {subdivisions.length > 0 && (
                <FormField
                  control={form.control}
                  name="subdivision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth:register.subdivision")}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger size="default" className="text-[14px] rounded-lg">
                            <SelectValue placeholder={t("auth:register.choose_subdivision")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subdivisions.map((sub) => (
                            <SelectItem key={sub} value={sub}>
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="serviceCharge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth:register.service_charge")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("auth:register.amount_placeholder")}
                        icon={<IndianRupee className="h-5 w-5" />}
                        {...field}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^\d.]/g, "");
                          field.onChange(val);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger size="default" className="rounded-lg text-[14px]">
                          <SelectValue placeholder={t("auth:register.choose_occupation", { defaultValue: "Choose occupation" })} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['labour', 'electrician', 'plumber', 'mistri', 'painter', 'carpenter'].map((occ) => (
                          <SelectItem key={occ} value={occ}>
                            {t(`services:items.${occ}.title`, { defaultValue: occ.charAt(0).toUpperCase() + occ.slice(1) })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Step 3: Documents */}
          <div className={`transition-all duration-500 ${currentStep === 3 ? "animate-in slide-in-from-right-5 fade-in-0 duration-400" : "hidden"}`}>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary">
                {t("auth:register.upload_docs")}
              </h3>

              {/* Profile Image Upload */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("auth:register.profile_photo")} <span className="text-destructive">*</span>
                </label>
                <div
                  onClick={() => profileInputRef.current?.click()}
                  className={`
                    group relative flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed cursor-pointer
                    transition-all duration-300 hover:scale-[1.01]
                    ${profilePreview
                      ? "border-primary bg-primary/5"
                      : imageError
                        ? "border-destructive bg-destructive/5"
                        : "border-gray-300 bg-gray-50/50 hover:border-primary hover:bg-primary/5"
                    }
                  `}
                >
                  <input
                    ref={profileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImage}
                  />
                  {profilePreview ? (
                    <div className="flex items-center gap-4">
                      <img
                        src={profilePreview}
                        alt="Profile"
                        className="w-20 h-20 rounded-xl object-cover border-3 border-primary shadow-lg shadow-primary/20"
                      />
                      <div>
                        <p className="text-sm font-medium text-primary">{t("auth:register.photo_uploaded")}</p>
                        <p className="text-xs text-gray-500">{profileImage?.name}</p>
                        <p className="text-xs text-primary mt-1">{t("auth:register.click_to_change")}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-gray-600">{t("auth:register.upload_profile_photo")}</p>
                      <p className="text-xs text-gray-400 mt-1">{t("auth:register.max_size_img")}</p>
                    </>
                  )}
                </div>
                {imageError && <p className="text-destructive text-xs mt-1.5">{imageError}</p>}
              </div>

              {/* Aadhaar Card Upload */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("auth:register.aadhaar_card")} <span className="text-destructive">*</span>
                </label>
                <div
                  onClick={() => aadhaarInputRef.current?.click()}
                  className={`
                    group relative flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed cursor-pointer
                    transition-all duration-300 hover:scale-[1.01]
                    ${aadhaarPreview
                      ? "border-primary bg-primary/5"
                      : aadhaarFileError
                        ? "border-destructive bg-destructive/5"
                        : "border-gray-300 bg-gray-50/50 hover:border-primary hover:bg-primary/5"
                    }
                  `}
                >
                  <input
                    ref={aadhaarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAadhaarFile}
                  />
                  {aadhaarPreview ? (
                    <div className="flex items-center gap-4">
                      <img
                        src={aadhaarPreview}
                        alt="Aadhaar"
                        className="w-24 h-16 rounded-lg object-cover border-2 border-primary shadow-lg shadow-primary/20"
                      />
                      <div>
                        <p className="text-sm font-medium text-primary">{t("auth:register.aadhaar_uploaded")}</p>
                        <p className="text-xs text-gray-500">{aadhaarFile?.name}</p>
                        <p className="text-xs text-primary mt-1">{t("auth:register.click_to_change")}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <IdCard className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-gray-600">{t("auth:register.upload_aadhaar")}</p>
                      <p className="text-xs text-gray-400 mt-1">{t("auth:register.max_size_aadhaar")}</p>
                    </>
                  )}
                </div>
                {aadhaarFileError && <p className="text-destructive text-xs mt-1.5">{aadhaarFileError}</p>}
              </div>
            </div>
          </div>

          {/* ─── Navigation Buttons ─── */}
          <div className="flex justify-between mt-8 pt-6 gap-4">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4" /> {t("auth:register.back")}
              </Button>
            )
            }
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={goNext}
                className="flex-1"
              >
                {t("auth:register.continue")} <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                disabled={!canSubmit || registerMutation.isPending}
                onClick={form.handleSubmit(onSubmit)}
                className="flex-1"
              >
                {registerMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} {t("auth:register.submit")}
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* ─── Worker Password Success Modal ─── */}
      <RegistrationSuccessModal registeredPassword={registeredPassword} />
    </div>
  );
}
