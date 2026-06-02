import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// English
import enHome from "@/locales/en/home.json";
import enCommon from "@/locales/en/common.json";
import enAuth from "@/locales/en/auth.json";
import enServices from "@/locales/en/services.json";

// Hindi
import hiHome from "@/locales/hi/home.json";
import hiCommon from "@/locales/hi/common.json";
import hiAuth from "@/locales/hi/auth.json";
import hiServices from "@/locales/hi/services.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        home: enHome,
        common: enCommon,
        auth: enAuth,
        services: enServices,
      },
      hi: {
        home: hiHome,
        common: hiCommon,
        auth: hiAuth,
        services: hiServices,
      },
    },
    fallbackLng: "en",
    defaultNS: "common",
    ns: ["common", "home", "auth", "services"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
  });

export default i18n;
