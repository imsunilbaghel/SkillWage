import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

export default function CompleteRequestModal({ isOpen, onClose, requestId, verifyOtpMutation }) {
  const { t } = useTranslation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset OTP field when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setOtp("");
    }
  }, [isOpen]);

  const handleComplete = () => {
    verifyOtpMutation.mutate(
      { id: requestId, otp },
      {
        onSuccess: () => {
          onClose(); // Close the modal on success
        }
      }
    );
  };

  const renderContent = () => (
    <div className="flex flex-col w-full bg-white h-full max-h-[90dvh]">
      {/* Header Area */}
      <div className="p-6 text-indigo-700 text-center relative overflow-hidden flex-shrink-0">
        <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
        <h3 className="text-xl font-semibold font-poppins">{t("requests.complete")}</h3>
      </div>

      {/* Body Section */}
      <div className="flex-1 overflow-contain overflow-y-auto p-4 md:p-6 space-y-6 flex flex-col items-center">
        <div className="text-center space-y-2">
          <h4 className="text-sm font-bold text-slate-800 tracking-wide">
            ENTER OTP TO COMPLETE
          </h4>
          <p className="text-sm font-medium text-slate-500">
            {t("requests.otp_instruction_worker")}
          </p>
        </div>

        <div className="w-full max-w-[250px]">
          <Input
            placeholder={t("requests.enter_otp_placeholder")}
            maxLength={6}
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
            className="text-center text-md tracking-wider"
          />
        </div>
      </div>

      {/* Footer Action */}
      <div className="flex-shrink-0 p-4 md:p-5 border-t border-gray-200 bg-slate-50 w-full flex gap-3">
        <Button
          onClick={onClose}
          variant="outline"
          className="flex-1 rounded-xl bg-white"
          disabled={verifyOtpMutation.isPending}
        >
          {t("common:cancel", "Cancel")}
        </Button>
        <Button
          onClick={handleComplete}
          type="button"
          disabled={!otp || otp.length < 6 || verifyOtpMutation.isPending}
          className="flex-1 rounded-xl"
        >
          {verifyOtpMutation.isPending ? t("common:submitting", "Submitting...") : t("requests.complete")}
        </Button>
      </div>
    </div>
  );

  return windowWidth < 768 ? (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} repositionInputs={false}>
      <DrawerContent
        className={cn(
          "p-0 border-0 overflow-hidden flex flex-col data-[vaul-drawer-direction=bottom]:max-h-[90dvh] data-[vaul-drawer-direction=bottom]:border-0 data-[vaul-drawer-direction=bottom]:rounded-t-3xl",
        )}
        barColor="bg-gray-500"
        barHeight="h-1"
      >
        <DrawerTitle className="sr-only">Complete Request</DrawerTitle>
        {renderContent()}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="p-0 border-0 overflow-hidden rounded-3xl max-w-[calc(100vw-2rem)] sm:max-w-md shadow-2xl flex flex-col max-h-[90dvh] gap-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Complete Request</DialogTitle>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
