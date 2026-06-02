import { Link } from "react-router";
import { Star, ShieldCheck, Zap, Users, ArrowRight, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation("home");
  return (
    <div className="relative w-full bg-slate-50 flex flex-col max-md:pb-24">

      {/* 1. HERO BANNER SECTION */}
      {/* HERO SECTION */}
      <div className="bg-[url('/image/backgroundbanner.png')] bg-cover bg-center relative flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">

        {/* Overlay */}
        <div className="bg-slate-950/80 backdrop-blur-[2px] absolute inset-0 z-0" />

        {/* MAIN CONTENT */}
        <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-center lg:gap-12 h-full">

          {/* LEFT SECTION */}
          <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-6 py-12">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-100/50 rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-wider shadow-inner">
              <Star className="size-3.5 fill-indigo-400 text-indigo-400" />
              <span>{t("hero.badge")}</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.4]">
              {t("hero.heading_line1")} <br />
              <span className="bg-gradient-to-r from-indigo-300 via-indigo-100 to-white bg-clip-text text-transparent">
                {t("hero.heading_line2")}
              </span>
            </h1>

            {/* Accent Line */}
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-400 to-indigo-200 rounded-full" />

            {/* Description */}
            <p className="text-gray-300 text-base max-w-xl">
              {t("hero.description")}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">

              <Link to="/auth/register" className="group">
                <Button
                  variant="clear"
                  size="clear"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-400 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold rounded-2xl shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_30px_rgba(99,102,241,0.5)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t("hero.btn_register")}</span>

                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link to="/service">
                <Button
                  variant="clear"
                  size="clear"
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
                >
                  <span>{t("hero.btn_services")}</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex-1 w-full lg:w-1/2 flex items-end justify-center lg:justify-end relative self-end pt-12">

            {/* Glow */}
            <div className="absolute w-80 h-80 sm:w-[450px] sm:h-[450px] bg-gradient-to-tr from-indigo-500/20 to-indigo-300/10 rounded-full blur-3xl opacity-60 pointer-events-none" />

            {/* Badge 1 */}
            <div className="absolute top-10 left-0  sm:top-10 md:left-40 lg:top-10 lg:left-10 xl:top-25 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl text-white">

              <div className="flex items-center gap-1.5">
                <Users className="size-4 text-indigo-300" />

                <span className="text-xs font-bold text-indigo-200">
                  {t("badges.badge1_title")}
                </span>
              </div>

              <p className="text-[10px] text-gray-300 mt-1">
                {t("badges.badge1_subtitle")}
              </p>
            </div>

            {/* Badge 2 */}
            <div className="absolute top-40  left-5  sm:top-40 sm:left-30 md:left-10 lg:top-40  lg:left-0 xl:top-60 xl:left-20 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl text-white">

              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-green-400" />

                <span className="text-xs font-bold text-green-400">
                  {t("badges.badge2_title")}
                </span>
              </div>

              <p className="text-[10px] text-gray-300 mt-1 leading-relaxed">
                {t("badges.badge2_subtitle")}
              </p>
            </div>

            {/* Worker Image */}
            <div className="relative group max-w-sm sm:max-w-md lg:max-w-lg w-full flex items-end justify-end md:justify-center lg:justify-end">

              <img
                src="/image/worker2.png"
                alt="SkillWage Worker"
                className="w-[80%] lg:w-[90%] h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-[1.02] block"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. CORE VALUE FEATURES SECTION */}
      <div className="w-full py-12 md:py-16 bg-slate-50 relative overflow-hidden flex flex-col items-center px-4 sm:px-6 lg:px-8">

        {/* Background ambient light effects */}
        <div className="absolute top-[20%] left-[-10%] w-96 h-96 bg-indigo-50 rounded-full filter blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-96 h-96 bg-indigo-50/40 rounded-full filter blur-3xl opacity-50 pointer-events-none" />

        {/* Feature section header */}
        <div className="text-center max-w-3xl space-y-4 mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-300 rounded-full text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            <HardHat className="size-3.5" />
            <span>{t("features.section_badge")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {t("features.section_title")}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            {t("features.section_description")}
          </p>
        </div>

        {/* Value Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl relative z-10 px-4">

          {/* Card 1 */}
          <div className="group bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
              <Users className="size-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {t("features.card1_title")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("features.card1_description")}
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <HardHat className="size-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {t("features.card2_title")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("features.card2_description")}
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <Zap className="size-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {t("features.card3_title")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("features.card3_description")}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default HomePage;