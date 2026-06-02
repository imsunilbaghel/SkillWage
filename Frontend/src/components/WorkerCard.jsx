import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Phone, CheckCircle2, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WorkerCard({ worker, onBook, isBookingPending }) {
  const { t } = useTranslation(["home", "services"]);
  const reqStatus = worker.serviceRequestStatus;
  const isRequested = !!reqStatus;

  let btnText = t("home:customer_home.book_now");
  let btnClass = "bg-indigo-700 hover:bg-indigo-800 shadow-blue-200/50 text-white";
  let btnIcon = <CalendarDays className="w-4 h-4 mr-1.5" />;

  if (reqStatus === "pending") {
    btnText = t("home:customer_home.requested");
    btnClass = "bg-yellow-500 border-yellow-500 text-white cursor-not-allowed disabled:opacity-100";
    btnIcon = <CheckCircle2 className="w-4 h-4" />;
  } else if (reqStatus === "accepted") {
    btnText = t("home:customer_home.accepted");
    btnClass = "bg-green-600 border-green-600 text-white cursor-not-allowed disabled:opacity-100";
    btnIcon = <CheckCircle2 className="w-4 h-4" />;
  }

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-300 hover:shadow-md transition-all duration-300 flex flex-col gap-4">
      <div className="flex items-start justify-start gap-4 mb-2">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-slate-100 shadow-inner shrink-0">
          {worker.profileImage ? (
            <img src={worker.profileImage} alt={worker.fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xl font-bold bg-slate-50">
              {worker.fullName.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <h3 className="font-semibold text-slate-900 text-md md:text-lg leading-tight mb-1">{worker.fullName}</h3>
          <div className="text-slate-700 font-semibold text-sm flex items-center gap-1">
            <span className="font-sans mb-0.5">₹</span> {worker.serviceCharge}<span className="text-slate-400 text-xs ml-1">/ {t("home:customer_home.service_charge")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="size-4 fill-yellow-500 text-yellow-500" />
            <span className="text-slate-700 font-bold text-md">{worker.averageRating > 0 ? worker.averageRating.toFixed(1) : "4.9"}</span>
          </div>
          {(worker.subdivision || worker.city) && (
            <div className="flex items-start gap-2 text-slate-500 text-xs font-medium">
              <MapPin className="size-4 shrink-0" />
              {worker.subdivision}{worker.subdivision && worker.city ? ", " : ""}{worker.city}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <Button
          variant="outline"
          className=""
          asChild
        >
          <a href={`tel:${worker.phoneNumber}`}>
            <Phone className="w-4 h-4 opacity-70" /> {t("home:customer_home.contact")}
          </a>
        </Button>
        <Button
          onClick={() => onBook(worker._id)}
          disabled={isBookingPending || isRequested}
          className={cn(
            "w-full rounded-xl text-xs md:text-sm transition-all",
            btnClass
          )}
        >
          {btnIcon} {btnText}
        </Button>
      </div>
    </div>
  );
}
