import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const LanguageToggler = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language === "hi" ? "hi" : "en";

  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value);
  };

  return (
    <Tabs
      value={currentLanguage}
      onValueChange={handleLanguageChange}
      className="w-fit"
    >
      <TabsList className="h-[34px] p-0.5 rounded-full border border-slate-300 flex items-center gap-0.5 shadow-inner">
        <TabsTrigger
          value="en"
          className={cn(
            "h-full px-4 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer select-none",
            "data-[state=active]:bg-indigo-700 data-[state=active]:text-white text-slate-500 hover:text-slate-800"
          )}
        >
          English
        </TabsTrigger>
        <TabsTrigger
          value="hi"
          className={cn(
            "h-full px-4 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer select-none",
            "data-[state=active]:bg-indigo-700 data-[state=active]:text-white text-slate-500 hover:text-slate-800"
          )}
        >
          हिन्दी
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default LanguageToggler;

