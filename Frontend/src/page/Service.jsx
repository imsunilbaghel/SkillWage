import { HardHat, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const Service = () => {
    const { t, i18n } = useTranslation();
    const isHindi = i18n.language === "hi";

    const data = [
        { path: "labour.png", key: "labour" },
        { path: "electrician.png", key: "electrician" },
        { path: "plumber.png", key: "plumber" },
        { path: "mistri.png", key: "mistri" },
        { path: "painter.png", key: "painter" },
        { path: "carpenter.png", key: "carpenter" }
    ];

    return (
        <div className="relative w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8 max-md:pb-24">
            {/* Background floating organic blobs for a premium glassmorphic feel */}
            <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none" />
            <div className="absolute top-[40%] right-[-10%] w-[40rem] h-[40rem] bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob pointer-events-none [animation-delay:2s]" />
            <div className="absolute bottom-[-10%] left-[10%] w-[35rem] h-[35rem] bg-pink-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob2 pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-6xl flex flex-col items-center">

                {/* Hero Header Section */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50/80 border border-indigo-300 rounded-full text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6 animate-slideDown">
                    <HardHat className="size-4" />
                    <span>{t("services:badge")}</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-950 via-indigo-800 to-indigo-950 text-center leading-[1.4] mb-6 animate-slideDown [animation-delay:100ms]">
                    {t("services:title_line1")} <br />
                    <span className="bg-gradient-to-r from-indigo-600 to-indigo-600 bg-clip-text text-transparent">{t("services:title_line2")}</span>
                </h1>

                <p className="max-w-3xl text-center text-gray-600 text-base sm:text-lg leading-relaxed mb-16 animate-slideDown [animation-delay:200ms] px-4">
                    <span className="font-semibold text-indigo-600">SkillWage</span> {t("services:description")}
                </p>

                {/* Service Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4 mb-24 animate-slideUp [animation-delay:300ms]">
                    {data.map((service) => {
                        const title = t(`services:items.${service.key}.title`);
                        const description = t(`services:items.${service.key}.description`);
                        const buttonText = isHindi
                            ? `${title} ${t("services:find_button")}`
                            : `${t("services:find_button")} ${title}`;

                        return (
                            <Link
                                to="/auth/register"
                                key={service.key}
                                className="group relative bg-white/80 backdrop-blur-md rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
                            >
                                {/* Top right glow element */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/50 to-indigo-500/10 rounded-bl-[100px] transition-all duration-300 group-hover:scale-110 opacity-70" />

                                <div className="relative">
                                    {/* Illustration container */}
                                    <div className="w-24 h-24 rounded-2xl bg-indigo-50/60 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-indigo-100/80 transition-all duration-300 shadow-inner">
                                        <img
                                            src={`/image/${service.path}`}
                                            alt={title}
                                            className="w-16 h-16 object-contain"
                                        />
                                    </div>

                                    {/* Service Title */}
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3 transition-colors duration-300">
                                        {title}
                                    </h3>

                                    {/* Service Description */}
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                        {description}
                                    </p>
                                </div>

                                {/* Dynamic Action Link */}
                                <div className="flex items-center gap-2 text-sm font-semibold text-white group-hover:text-white transition-all duration-300 bg-indigo-700 px-4 py-3 rounded-xl cursor-pointer w-fit">
                                    <span>{buttonText}</span>
                                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom CTA Banner */}
                <div className="relative w-full rounded-3xl bg-gradient-to-br from-indigo-700 to-indigo-800 text-white p-8 sm:p-12 overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row items-center justify-between gap-8 animate-scaleIn max-md:mb-8">

                    <div className="absolute inset-0 spotlight-effect opacity-20 pointer-events-none" />

                    <div className="space-y-4 max-w-lg text-center md:text-left relative z-10">
                        <h2 className="text-3xl font-extrabold">{t("services:cta.title")}</h2>
                        <p className="text-indigo-200/90 text-sm sm:text-base leading-relaxed">
                            {t("services:cta.description")}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0 relative z-10">
                        <Link
                            to="/auth/register"
                            className="px-8 py-3.5 bg-white text-indigo-900 rounded-2xl font-semibold shadow-md hover:bg-indigo-50 hover:shadow-lg transition-all duration-300 text-center text-sm cursor-pointer"
                        >
                            {t("services:cta.get_started")}
                        </Link>
                        <Link
                            to="/auth/login"
                            className="px-8 py-3.5 bg-indigo-700 border hover:bg-indigo-800 text-white rounded-2xl font-semibold transition-all duration-300 text-center text-sm cursor-pointer border-white"
                        >
                            {t("services:cta.sign_in")}
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Service;