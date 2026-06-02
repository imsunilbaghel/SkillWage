import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";

export default function RegistrationSuccessModal({ registeredPassword }) {
  const { t } = useTranslation(["auth", "common"]);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCopy = useCallback(() => {
    if (!registeredPassword) return;
    navigator.clipboard.writeText(registeredPassword);
    setCopied(true);
    toast.success(t("auth:register.copied_toast"));
    setTimeout(() => setCopied(false), 2000);
  }, [registeredPassword, t]);

  if (!registeredPassword) return null;

  const renderSuccessContent = () => (
    <div className="flex flex-col w-full bg-white h-full max-h-[90dvh]">
      {/* Header Area */}
      <div className="p-6 text-indigo-700 text-center relative overflow-hidden flex-shrink-0">
        <img src="/image/check.png" alt="" className="w-20 h-20 mx-auto mb-4" />
        <h3 className="text-xl font-bold font-poppins">{t("auth:register.success_title")}</h3>
      </div>

      {/* Password Section */}
      <div className="flex-1 overflow-contain overflow-y-auto p-4 md:p-5 space-y-4">
        <div className="space-y-4">
          <p className="text-[12px] font-semibold tracking-wider uppercase text-emerald-600 text-center">
            {t("auth:register.password_label")}
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="text-4xl font-mono font-black text-slate-800 tracking-widest bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl px-6 py-3 shadow-inner select-all">
              {registeredPassword}
            </span>
            <button
              onClick={handleCopy}
              type="button"
              className="p-3.5 bg-white border border-gray-200 hover:bg-slate-50 active:scale-95 text-gray-500 hover:text-primary rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center"
              title={t("auth:register.copied_toast")}
            >
              {copied ? <Check className="w-5 h-5 text-primary animate-in zoom-in-50" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-amber-50/70 border border-amber-100/80 rounded-2xl p-4 text-left space-y-2.5">
          <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5 uppercase tracking-wide">
            {t("auth:register.important_instructions")}
          </h4>
          <ul className="text-xs text-amber-700 space-y-2 leading-relaxed font-medium">
            <li className="flex items-start gap-1.5">
              <span className="text-amber-500">•</span>
              <span>{t("auth:register.instruction_bullet_1")}</span>
            </li>
            <li className="flex items-start gap-1.5 border-t border-amber-100/50 pt-2">
              <span className="text-amber-500">•</span>
              <span>{t("auth:register.instruction_bullet_2")}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Action */}
      <div className="flex-shrink-0 p-4 md:p-5 border-t border-gray-200 bg-white w-full">
        <Button
          onClick={() => navigate("/app")}
          type="button"
          className="w-full rounded-lg bg-indigo-700"
        >
          Go to Home
        </Button>
      </div>
    </div>
  );

  return windowWidth < 768 ? (
    <Drawer open={!!registeredPassword} dismissible={false} onOpenChange={() => { }} repositionInputs={false}>
      <DrawerContent
        className={cn(
          "p-0 border-0 overflow-hidden flex flex-col data-[vaul-drawer-direction=bottom]:max-h-[90dvh] data-[vaul-drawer-direction=bottom]:border-0 data-[vaul-drawer-direction=bottom]:rounded-t-3xl",
        )}
        barColor="bg-gray-800"
        barHeight="h-0"
      >
        <DrawerTitle className="sr-only">Registration Success</DrawerTitle>
        {renderSuccessContent()}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={!!registeredPassword} onOpenChange={() => { }}>
      <DialogContent
        className="p-0 border-0 overflow-hidden rounded-2xl max-w-[calc(100vw-2rem)] sm:max-w-md shadow-2xl flex flex-col max-h-[90dvh] gap-0"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">Registration Success</DialogTitle>
        {renderSuccessContent()}
      </DialogContent>
    </Dialog>
  );
}
