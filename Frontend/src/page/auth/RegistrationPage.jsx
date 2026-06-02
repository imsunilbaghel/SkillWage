import { useState } from "react";
import { Wrench, UserRound, ArrowRight, ChevronLeft, HardHat, CheckCircle, Circle, Shield, Zap, Award } from "lucide-react";
import WorkerRegistrationForm from "@/components/WorkerRegistrationForm";
import CustomerRegistrationForm from "@/components/CustomerRegistrationForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const RegistrationPage = () => {
  const { t } = useTranslation(["auth", "common"]);
  const [registrationType, setRegistrationType] = useState(null); // "worker" | "customer"
  const [currentStep, setCurrentStep] = useState(1);

  // Dynamic vertical steps generator
  const getStepsForType = (type) => {
    if (type === "worker") {
      return [
        { id: 1, title: t("auth:register.personal_info_step"), label: t("auth:register.personal_info_step") },
        { id: 2, title: t("auth:register.address_rate_step"), label: t("auth:register.address_rate_step") },
        { id: 3, title: t("auth:register.upload_docs_step"), label: t("auth:register.upload_docs_step") },
      ];
    } else if (type === "customer") {
      return [
        { id: 1, title: t("auth:register.personal_info_step"), label: t("auth:register.personal_info_step") },
        { id: 2, title: t("auth:register.address_photo_step"), label: t("auth:register.address_photo_step") },
      ];
    }
    return [];
  };

  const activeSteps = getStepsForType(registrationType);
  const progressPercentage = activeSteps.length > 1
    ? ((currentStep - 1) / (activeSteps.length - 1)) * 100
    : 0;

  if (!registrationType) {
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

          {/* Right Side - Registration Selection */}
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

                  <h2 className="text-2xl font-bold text-white mb-2">{t("auth:register.title_mobile")}</h2>
                  <p className="text-white/70 text-sm">{t("auth:register.subtitle_mobile")}</p>
                </div>
              </div>

              {/* Curved bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-white rounded-t-3xl" />
            </div>

            {/* Selection Buttons Container */}
            <div className="flex lg:flex-1 items-start lg:items-center justify-center px-6 py-6 max-sm:pt-4 lg:py-0 lg:px-12 bg-white -mt-4 lg:mt-0 relative z-10">
              <div className="w-full max-w-md animate-fadeIn animation-delay-300 space-y-6">
                {/* Desktop Header */}
                <div className="hidden lg:block mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">{t("auth:register.title")}</h2>
                  <p className="text-sm text-gray-500 mt-2">{t("auth:register.subtitle")}</p>
                </div>

                <div className="space-y-4">
                  <Button
                    variant="registration"
                    size="clear"
                    onClick={() => {
                      setRegistrationType("worker");
                      setCurrentStep(1);
                    }}
                    className="group animate-slideUp animation-delay-200 w-full animate-fadeIn border border-gray-300 hover:border-indigo-900"
                  >
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shrink-0">
                      <img src="/image/workerBanner.png" alt="Worker" className="w-14 h-14 object-contain" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="font-semibold text-gray-900 text-base md:text-lg">
                        {t("auth:register.worker_reg")}
                      </h3>
                      <p className="text-gray-500 mt-0.5 text-xs leading-relaxed">
                        {t("auth:register.worker_reg_desc")}
                      </p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-2 transition-all duration-300 max-md:hidden" />
                  </Button>

                  <Button
                    variant="registration"
                    size="clear"
                    onClick={() => {
                      setRegistrationType("customer");
                      setCurrentStep(1);
                    }}
                    className="group animate-slideUp animation-delay-300 w-full animate-fadeIn border border-gray-300 hover:border-indigo-900"
                  >
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shrink-0">
                      <img src="/image/client.png" alt="Client" className="w-14 h-14 object-contain" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="font-semibold text-gray-900 text-base md:text-lg">
                        {t("auth:register.customer_reg")}
                      </h3>
                      <p className="text-gray-500 mt-0.5 text-xs leading-relaxed">
                        {t("auth:register.customer_reg_desc")}
                      </p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-2 transition-all duration-300 max-md:hidden" />
                  </Button>
                </div>

                <div className="text-center pt-6">
                  <p className="text-xs text-gray-500">
                    {t("auth:register.already_account")}{" "}
                    <Link to="/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                      {t("auth:register.login_link")}
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
      </div>
    );
  }

  return (
    <div className="w-full flex-1 lg:h-full lg:overflow-hidden bg-white flex flex-col">
      <div className="grid lg:grid-cols-[30%_70%] min-h-full lg:h-full">
        {/* Left Side - Progress / Branding (Desktop) */}
        <div className="relative hidden lg:flex flex-col bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900 animate-gradient overflow-hidden">
          {/* Decorative animated elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-blob" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-blob animation-delay-500" />
            <div className="absolute inset-0 spotlight-effect opacity-20" />
          </div>

          {/* Content with Progress */}
          <div className="relative z-10 flex flex-col h-full px-10 py-10 gap-10">
            {/* Logo */}
            <div className="flex items-center gap-3 animate-fadeIn">
              {/* Desktop Header back button */}
              <div className="hidden lg:flex justify-between items-center mb-6">
                <Button
                  variant="ghost"
                  onClick={() => setRegistrationType(null)}
                  className="text-gray-600 hover:text-indigo-700 bg-gray-50 border border-gray-150 rounded-xl cursor-pointer text-sm font-medium transition-all"
                >
                  <ChevronLeft className="w-4 h-4 mr-1.5" />
                  {t("auth:register.back_selection")}
                </Button>
              </div>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 animate-fadeIn mt-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-white to-white/90 shadow-lg">
                  {registrationType === "worker" ? (
                    <Wrench className="w-6 h-6 text-indigo-700" />
                  ) : (
                    <UserRound className="w-6 h-6 text-indigo-700" />
                  )}
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-white leading-tight">
                  {registrationType === "worker" ? t("auth:register.worker_reg") : t("auth:register.customer_reg")}
                </h1>
                <p className="text-xs text-white/70 mt-1">
                  {registrationType === "worker"
                    ? t("auth:register.worker_desc")
                    : t("auth:register.customer_desc")}
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="space-y-4 animate-fadeIn animation-delay-200 mt-6">
              <div className="flex items-center justify-between text-xs font-semibold text-white/80">
                <span>{t("auth:register.progress")}</span>
                <span className="text-white font-bold text-sm">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-white via-white to-white/80 rounded-full transition-all duration-700 ease-out shadow-sm relative overflow-hidden"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-600/40 to-transparent animate-shimmer" />
                </div>
              </div>

              {/* Step Indicators - Vertical */}
              <div className="space-y-5 pt-4">
                {activeSteps.map((step) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  return (
                    <div key={step.id} className="flex items-center gap-3">
                      <div
                        className={`relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 flex-shrink-0 ${isCompleted
                          ? 'bg-white text-indigo-700 shadow-md shadow-black/20 scale-110'
                          : isActive
                            ? 'bg-white/30 text-white border-2 border-white'
                            : 'bg-white/10 text-white/50 border border-white/10'
                          }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-indigo-700" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`text-sm font-semibold transition-colors duration-300 ${isActive || isCompleted ? 'text-white' : 'text-white/40'
                            }`}
                        >
                          {step.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Container */}
        <div className="flex flex-col flex-1 min-h-0 h-full">
          {/* Mobile Header with gradient */}
          <div className="lg:hidden relative overflow-hidden shrink-0">
            <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900 px-6 pt-8 pb-16 relative">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>

              <div className="relative z-10 animate-slideDown flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                      <HardHat className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold font-poppins text-white select-none">SkillWage</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRegistrationType(null)}
                    className="text-white hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-sm rounded-xl cursor-pointer py-1 px-3 text-xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                    {t("auth:register.back")}
                  </Button>
                </div>

                <div>
                  <h1 className="text-xl font-bold text-white mb-0.5">
                    {registrationType === "worker" ? t("auth:register.worker_reg") : t("auth:register.customer_reg")}
                  </h1>
                  <p className="text-white/75 text-xs">
                    {registrationType === "worker"
                      ? t("auth:register.worker_desc")
                      : t("auth:register.customer_desc")}
                  </p>
                </div>

                {/* Mobile Progress */}
                <div className="w-full space-y-1 mt-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-[11px] font-medium text-white/80">
                    <span>{t("auth:register.progress")}</span>
                    <span className="font-bold">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-white via-white to-white/80 rounded-full transition-all duration-700 ease-out shadow-sm relative overflow-hidden"
                      style={{ width: `${progressPercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-600/40 to-transparent animate-shimmer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Curved bottom layer */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-white rounded-t-3xl" />
          </div>

          {/* Form Scrollable Frame */}
          <div className="flex-1 lg:overflow-y-auto px-4 sm:px-8 py-6 lg:py-10 bg-white -mt-4 lg:mt-0 relative z-10 flex justify-center">
            <div className="w-full max-w-2xl flex flex-col justify-start lg:justify-center animate-fadeIn my-auto">

              {/* Form Entry Panel */}
              <div className="bg-white rounded-2xl animate-scaleIn relative overflow-hidden flex flex-col animation-delay-100 p-2 sm:p-8 min-lg:border border-gray-300">
                {registrationType === "worker" ? (
                  <WorkerRegistrationForm
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    hideIndicator={true}
                  />
                ) : (
                  <CustomerRegistrationForm
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    hideIndicator={true}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
