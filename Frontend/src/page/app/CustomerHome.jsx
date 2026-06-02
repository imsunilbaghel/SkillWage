import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useWorkers } from "@/hooks/useWorkers";
import { useSendRequest } from "@/hooks/useRequests";
import WorkerCard from "@/components/WorkerCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger,
} from "@/components/ui/select";
import { MapPin, Loader2, Search, SlidersHorizontal, } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SERVICES = [
  { id: "labour", labelKey: "items.labour.title", icon: "labour.png" },
  { id: "electrician", labelKey: "items.electrician.title", icon: "electrician.png" },
  { id: "plumber", labelKey: "items.plumber.title", icon: "plumber.png" },
  { id: "mistri", labelKey: "items.mistri.title", icon: "mistri.png" },
  { id: "painter", labelKey: "items.painter.title", icon: "painter.png" },
  { id: "carpenter", labelKey: "items.carpenter.title", icon: "carpenter.png" },
];

export default function CustomerHome() {
  const { t } = useTranslation(["home", "services"]);
  const { user } = useAuth();
  const [activeService, setActiveService] = useState("labour");
  const [pincode, setPincode] = useState(user?.pincode || "");
  const [sort, setSort] = useState("rating_high");
  const shouldFetch = pincode?.length === 6;

  useEffect(() => {
    if (user?.pincode) {
      setPincode(user.pincode);
    }
  }, [user]);

  const {
    data: workersData,
    isLoading: workersLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWorkers({
    activeService,
    pincode: shouldFetch ? pincode : undefined,
    sort,
    id: user._id,
  });

  useEffect(() => {
    if (isError && error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to fetch workers");
    }
  }, [isError, error]);

  useEffect(() => {
    const handleScroll = () => {
      if (workersLoading || isFetchingNextPage || !hasNextPage) return;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [workersLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  const workers = workersData?.pages?.flatMap((page) => page?.data?.workers || []) || [];

  const requestMutation = useSendRequest();

  const handleSendRequest = (workerId) => {
    requestMutation.mutate(workerId);
  };

  const handlePincodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPincode(val);
  };

  return (
    <div className="min-h-screen bg-[#F9FBFF] font-sans max-md:pb-24 max-w-4xl md:min-w-full mx-auto flex flex-col justify-center">

      {/* Top Header */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900 relative ">
        <div className="flex w-full flex-col items-start justify-between gap-6 p-6 md:p-8 md:max-w-5xl md:mx-auto">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shadow-sm border-2 border-white">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xl">{user?.fullName?.charAt(0)}</div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-white text-sm font-medium">{t("home:customer_home.greeting")}</span>
              <span className="font-semibold text-white leading-tight md:text-lg">{user?.fullName}</span>
            </div>
          </div>
          {/* Search & Filter */}
          <div className="flex items-center gap-3 w-full">
            <div className="relative flex-1 flex flex-col gap-2">
              <p className="text-white text-xs md:text-base">{t("home:customer_home.enter_pincode")}</p>
              <Input
                value={pincode}
                onChange={handlePincodeChange}
                placeholder={t("home:customer_home.search_placeholder")}
                className="w-full bg-white border-none text-gray-700 placeholder:text-gray-400 focus-visible:ring-0 text-base font-medium"
                icon={<MapPin />}
              />
            </div>
          </div>
        </div>

      </div>

      <div className="p-4 md:p-8 md:min-w-5xl md:mx-auto">
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-3xl p-6 md:p-8 flex items-center justify-between relative overflow-hidden shadow-sm ">
          <div className="relative z-10 max-w-[65%] md:max-w-[50%]">
            <span className="text-orange-700 font-bold text-[10px] md:text-xs uppercase tracking-wider">{t("home:customer_home.promo_badge")}</span>
            <h2 className="text-[19px] md:text-2xl font-bold text-slate-800 leading-[1.2] mt-1.5 mb-5 md:mb-6">{t("home:customer_home.promo_title")}</h2>
            <Button
              onClick={() => document.getElementById("services-section")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-orange-600 border-orange-600 hover:bg-orange-700 hover:border-orange-700 text-white rounded-xl h-10 font-semibold text-sm"
            >
              {t("home:customer_home.promo_button")}
            </Button>
          </div>
          <div className="absolute right-0 md:right-4 bottom-0 text-[100px] md:text-[140px] leading-none opacity-90 drop-shadow-2xl translate-y-2">
            <img src="/image/workerBanner.png" alt="" />
          </div>
        </div>
      </div>

      {/* Most Booked Services */}
      <div id="services-section" className="p-4 md:p-8 md:max-w-5xl md:mx-auto w-full">
        <h3 className="font-semibold text-gray-900 text-lg mb-5">{t("home:customer_home.most_booked")}</h3>
        <div className="grid grid-cols-3 min-[600px]:grid-cols-4 md:grid-cols-6 gap-x-2 gap-y-5">
          {SERVICES.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveService(service.id)}
              className="flex flex-col items-center gap-2.5 group transition-all cursor-pointer"
            >
              <div className={cn(
                "w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center transition-all duration-300",
                activeService === service.id
                  ? "bg-indigo-50 scale-105 border border-indigo-700"
                  : "bg-white group-hover:scale-105 border"
              )}>
                <span className={cn("size-10 md:size-12", activeService === service.id ? "" : "")}>
                  <img src={`/image/${service.icon}`} alt="" />
                </span>
              </div>
              <span className={cn("text-xs md:text-base font-semibold tracking-wide", activeService === service.id ? "text-gray-900" : "text-gray-500")}>
                {t("services:" + service.labelKey)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Near You */}
      <div className="p-4 md:p-8 md:max-w-5xl md:mx-auto w-full">
        <div className="flex items-center justify-between mb-5 px-1">
          <h3 className="font-semibold text-gray-900 text-lg">{t("home:customer_home.popular_near")}</h3>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="data-[state=closed]:border-gray-300 " aria-label="Sort">
              <SlidersHorizontal className="w-5 h-5" /> {t("home:customer_home.sort")}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating_high">{t("home:customer_home.sort_rating_high")}</SelectItem>
              <SelectItem value="rating_low">{t("home:customer_home.sort_rating_low")}</SelectItem>
              <SelectItem value="charge_low">{t("home:customer_home.sort_price_low")}</SelectItem>
              <SelectItem value="charge_high">{t("home:customer_home.sort_price_high")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {workersLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#007AFF]" />
          </div>
        ) : workers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2  border-dashed border-gray-300">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t("home:customer_home.no_workers_title", { service: t("services:items." + activeService + ".title") })}</h3>
            <p className="text-slate-500 mt-1.5 text-center max-w-[250px] text-sm">
              {t("home:customer_home.no_workers_desc")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {workers.map((worker) => (
                <WorkerCard
                  key={worker._id}
                  worker={worker}
                  onBook={handleSendRequest}
                  isBookingPending={requestMutation.isPending}
                />
              ))}
            </div>

            {/* Loading / End indicator */}
            <div className="h-10 flex items-center justify-center">
              {isFetchingNextPage ? (
                <Loader2 className="w-6 h-6 animate-spin text-indigo-700" />
              ) : hasNextPage ? (
                <span className="text-xs text-slate-400 font-medium">{t("common:pagination.scroll_load_more", "Scroll down to load more")}</span>
              ) : (
                <span className="text-xs text-slate-400 font-medium">{t("common:pagination.no_more_workers", "No more workers found")}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
