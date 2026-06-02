import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useAcceptRequest, useGenerateOtp, useMyRequests, useRate, useRejectRequest, useVerifyOtp } from "@/hooks/useRequests";
import { Button } from "@/components/ui/button";
import { Loader2, Phone, Star, CheckCircle2, ShieldAlert, KeyRound, FileInput, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CompleteRequestModal from "@/components/CompleteRequestModal";

const formatDateKey = (dateString, t, lang) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (targetDate.getTime() === today.getTime()) {
    return t("requests.today", "Today");
  }
  if (targetDate.getTime() === yesterday.getTime()) {
    return t("requests.yesterday", "Yesterday");
  }

  const day = date.getDate();
  const year = date.getFullYear();
  const monthName = date.toLocaleDateString(lang || "en", { month: "short" });

  return `${day} ${monthName} ${year}`;
};

const formatTime = (dateString, lang) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString(lang || "en", { hour: "2-digit", minute: "2-digit", hour12: true });
};

export default function Requests() {
  const { t, i18n } = useTranslation(["common", "services"]);
  const { role } = useAuth();

  const { data, isLoading, isError, error, refetch, isFetchingNextPage, hasNextPage, isFetching, fetchNextPage } = useMyRequests();

  useEffect(() => {
    if (isError && error) {
      toast.error(error?.response?.data?.message || error?.message || t("requests.toast_load_requests_error"));
    }
  }, [isError, error, t]);
  useEffect(() => {
    const handleScroll = () => {
      if (isFetchingNextPage || !hasNextPage || isLoading) return;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        fetchNextPage();
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetchingNextPage, hasNextPage, isLoading, fetchNextPage])

  const acceptMutation = useAcceptRequest();
  const rejectMutation = useRejectRequest();
  const generateOtpMutation = useGenerateOtp();
  const verifyOtpMutation = useVerifyOtp();
  const rateMutation = useRate();

  const [activeCompleteRequestId, setActiveCompleteRequestId] = useState(null);
  const [ratings, setRatings] = useState({});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  const requests = data?.pages?.flatMap((page) => page?.data?.requests || []);

  const groupedRequestsArray = [];
  requests.forEach(req => {
    const dateKey = formatDateKey(req.createdAt, t, i18n.language);
    let group = groupedRequestsArray.find(g => g.dateKey === dateKey);
    if (!group) {
      group = { dateKey, requests: [] };
      groupedRequestsArray.push(group);
    }
    group.requests.push(req);
  });

  return (
    <div className="bg-slate-50 font-sans max-md:pb-24">
      <div className="space-y-6 bg-white border-b border-slate-200 max-md:shadow-sm sticky top-0 z-10">
        <div className="flex w-full items-center justify-between max-w-4xl p-4 mx-auto">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">{t("requests.title")}</h1>
          <Button
            variant="outline"
            className="w-fit flex items-center justify-center p-2 rounded-lg"
            onClick={() => refetch()}
            disabled={isFetching}
            size="sm"
          >
            <RotateCw className={cn("w-3.5 h-3.5", isFetching && "animate-spin text-indigo-600")} />
            <span className="hidden sm:inline">{t("posts.refresh", "Refresh")}</span>
          </Button>
        </div>
      </div>
      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300 mx-4 sm:max-w-4xl sm:mx-auto my-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <FileInput className="w-8 h-8 text-slate-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-600">{t("requests.no_requests")}</h2>
        </div>
      ) : (
        <div className="space-y-8 p-4 max-w-4xl mx-auto">
          {groupedRequestsArray.map(group => (
            <div key={group.dateKey} className="space-y-3">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-1">
                {group.dateKey}
              </h2>
              <div className="grid gap-3">
                {group.requests.map(req => (
                  <div key={req._id} className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-slate-300 transition-colors overflow-hidden">

                    {/* Profile Info - Minimal Row */}
                    <div className="flex items-center gap-4 flex-1 w-full min-w-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        {role === "customer" ? (
                          <img src={req.worker.profileImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <img src={req.customer.profileImage} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>

                      <div className="flex flex-col flex-1 gap-1 min-w-0">
                        <div className="flex items-center gap-2 max-sm:justify-between min-w-0">
                          <h3 className="font-semibold text-slate-900 text-base truncate">
                            {role === "customer" ? req.worker.fullName : req.customer.fullName}
                          </h3>
                          {req?.serviceType && <span className={cn(
                            "w-fit px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-indigo-50 text-indigo-700 border-indigo-200",
                          )}>
                            {t(`services:items.${req.serviceType}.title`)}
                          </span>}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-0.5 max-sm:justify-between">
                          {/* Only show phone if worker accepted, or if it's the customer looking at worker */}
                          {(role === "customer" || (role === "worker" && req.status !== "pending" && req.status !== "rejected")) && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <a href={`tel: ${role === "customer" ? req.worker.phoneNumber : req.customer.phoneNumber}`} className="text-slate-500 hover:text-indigo-600 transition-colors">{role === "customer" ? req.worker.phoneNumber : req.customer.phoneNumber}</a>
                            </div>
                          )}
                          <span className="text-slate-400">
                            {t("requests.requested_at")}: {formatTime(req.createdAt, i18n.language)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Panel - Row Wise */}
                    < div className="flex items-center gap-2 w-full sm:w-auto sm:shrink-0" >
                      {/* WORKER VIEW ACTIONS */}
                      {role === "worker" && req.status === "pending" && (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Button
                            onClick={() => acceptMutation.mutate(req._id)}
                            disabled={acceptMutation.isPending || rejectMutation.isPending}
                            className="flex-1 sm:flex-none rounded-lg text-xs h-9 px-4"
                          >
                            {t("requests.accept_request")}
                          </Button>
                          <Button
                            onClick={() => rejectMutation.mutate(req._id)}
                            disabled={acceptMutation.isPending || rejectMutation.isPending}
                            variant="outline"
                            className="flex-1 sm:flex-none text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 rounded-lg text-xs h-9 px-4 sm:w-auto"
                          >
                            {t("requests.reject")}
                          </Button>
                        </div>
                      )}

                      {role === "worker" && req.status === "accepted" && (
                        <Button
                          onClick={() => setActiveCompleteRequestId(req._id)}
                          className="w-full sm:w-auto bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 rounded-lg text-xs h-9 px-4 gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark as Complete
                        </Button>
                      )}

                      {/* CUSTOMER VIEW ACTIONS */}
                      {role === "customer" && req.status === "accepted" && (
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          {req.otp ? (
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 h-9">
                              <span className="text-xs text-slate-500 font-medium">{t("requests.your_otp")}:</span>
                              <span className="text-sm font-mono font-bold text-indigo-700">{req.otp}</span>
                            </div>
                          ) : (
                            <Button
                              onClick={() => generateOtpMutation.mutate(req._id)}
                              disabled={generateOtpMutation.isPending}
                              size="sm"
                              className="rounded-lg text-xs w-full"
                            >
                              <KeyRound className="w-3.5 h-3.5" /> {t("requests.generate_otp")}
                            </Button>
                          )}
                        </div>
                      )}

                      {role === "customer" && req.status === "completed" && !req.hasRated && (
                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                onClick={() => setRatings({ ...ratings, [req._id]: star })}
                                className="p-1 hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                              >
                                <Star className={cn(
                                  "w-5 h-5 transition-colors",
                                  (ratings[req._id] || 0) >= star ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-300"
                                )} />
                              </button>
                            ))}
                          </div>
                          <Button
                            onClick={() => rateMutation.mutate({ id: req._id, rating: ratings[req._id] })}
                            disabled={!ratings[req._id] || rateMutation.isPending}
                            size="sm"
                            className="rounded-lg text-xs"
                          >
                            {t("requests.submit_rating")}
                          </Button>
                        </div>
                      )}

                      {role === "customer" && req.status === "completed" && req.hasRated && (
                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg w-full items-center justify-center border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-xs font-medium">{t("requests.rated_stars", { rating: req.rating })}</span>
                        </div>
                      )}

                      {role === "worker" && req.status === "completed" && (
                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg w-full items-center justify-center border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-xs font-medium">{t("requests.job_completed")}</span>
                        </div>
                      )}

                      {req.status === "pending" && role === "customer" && (
                        <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg w-full items-center justify-center border border-amber-200">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-xs font-medium">{t("requests.waiting_accept")}</span>
                        </div>
                      )}

                      {req.status === "rejected" && (
                        <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-2 rounded-lg w-full items-center justify-center border border-red-200">
                          <ShieldAlert className="w-4 h-4" />
                          <span className="text-xs font-medium">{role === "worker" ? t("requests.you_rejected") : t("requests.rejected_by_worker")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
          }
          {/* Loading / End indicator */}
          <div className="h-10 flex items-center justify-center">
            {isFetchingNextPage ? (
              <Loader2 className="w-6 h-6 animate-spin text-indigo-700" />
            ) : hasNextPage ? (
              <span className="text-xs text-slate-400 font-medium">{t("pagination.scroll_load_more", "Scroll down to load more")}</span>
            ) : (
              <span className="text-xs text-slate-400 font-medium">{t("pagination.no_more_requests", "No more requests found")}</span>
            )}
          </div>
        </div >
      )}

      {/* Complete Request Modal/Drawer */}
      <CompleteRequestModal
        isOpen={!!activeCompleteRequestId}
        onClose={() => setActiveCompleteRequestId(null)}
        requestId={activeCompleteRequestId}
        verifyOtpMutation={verifyOtpMutation}
      />
    </div >
  );
}
