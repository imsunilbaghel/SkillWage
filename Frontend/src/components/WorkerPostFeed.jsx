import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useWorkerPosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Phone, MapPin, Image as ImageIcon, RotateCw, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const formatDateKey = (dateString, t, lang) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (targetDate.getTime() === today.getTime()) {
    return t("common:requests.today", "Today");
  }
  if (targetDate.getTime() === yesterday.getTime()) {
    return t("common:requests.yesterday", "Yesterday");
  }

  const day = date.getDate();
  const year = date.getFullYear();
  const monthName = date.toLocaleDateString(lang || "en", { month: "short" });

  return `${day} ${monthName} ${year}`;
};

export default function WorkerPostFeed() {
  const { t, i18n } = useTranslation(["common", "services"]);
  const { user } = useAuth();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, isFetching } = useWorkerPosts(user?.isVerified);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || isFetchingNextPage || !hasNextPage) return;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        fetchNextPage();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  const posts = data?.pages?.flatMap(page => page?.data?.posts || []) || [];

  return (
    <div className="flex flex-col bg-slate-50 pb-24 md:pb-0">
      {/* Top Header */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-3xl mx-auto px-6 py-6 pb-4 md:py-8 md:pb-4 flex items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shadow-sm border-2 border-white shrink-0 bg-white/10">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-lg">
                  {user?.fullName?.charAt(0) || "W"}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-white/80 text-[10px] md:text-xs font-medium tracking-wide uppercase">
                {t("posts.welcome_back", "Welcome Back")}
              </span>
              <span className="font-semibold text-white leading-tight md:text-lg mt-0.5">
                {user?.fullName}
              </span>

            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border-white/30 hover:bg-white/10 text-white hover:text-white rounded-lg shadow-xs transition-all flex items-center gap-1.5 shrink-0 w-fit"
          >
            <RotateCw className={cn("w-3.5 h-3.5 text-white", isFetching && "animate-spin")} />
            <span>{t("posts.refresh", "Refresh")}</span>
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 px-6 pb-4 max-w-3xl mx-auto">
          {user?.occupation && (
            <span className="inline-flex items-center gap-1.5 text-[10px] bg-white/15 text-white px-2.5 py-1 rounded-md font-medium border border-white/20 shadow-xs backdrop-blur-xs">
              <Briefcase className="size-4 text-white/90" />
              {t(`services:items.${user.occupation}.title`)}
            </span>
          )}
          {user?.pincode && (
            <span className="inline-flex items-center gap-1.5 text-[10px] bg-white/15 text-white px-2.5 py-1 rounded-md font-medium border border-white/20 shadow-xs backdrop-blur-xs">
              <MapPin className="size-4 text-white/90" />
              {user.pincode}
            </span>
          )}
        </div>
      </div>

      {/* Main Feed Content */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-4 space-y-4">
        {!user?.isVerified ? (
          <div className="bg-white border border-dashed border-indigo-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center mx-4 my-8 shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">{t("posts.verification_pending", "Account Verification Pending")}</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              {t("posts.verification_desc", "Your account is currently under review. Once verified, you will be able to see local requirements here.")}
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center mx-4 my-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{t("posts.no_feed_posts", "No local requirements found")}</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm">
              {t("posts.no_feed_desc", "There are currently no open requirements matching your occupation and pincode. Please check back later.")}
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-800 px-1 mb-2">
              {t("posts.local_requirements", "Local Requirements For You")}
            </h2>

            <div className="grid gap-5">
              {posts.map(post => (
                <div key={post._id} className="bg-white p-5 rounded-2xl border border-gray-300 flex flex-col gap-5 hover:border-gray-400 transition-colors w-full overflow-hidden">

                  {/* Main Content */}
                  <div className="flex flex-col gap-3 min-w-0">
                    {/* Header: Customer Info */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-50 shrink-0 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                        {post.customer?.profileImage ? (
                          <img src={post.customer.profileImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          post.customer?.fullName?.charAt(0) || "C"
                        )}
                      </div>
                      <div className="flex flex-row justify-between gap-2 w-full items-center min-w-0">
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                          <span className="font-semibold text-slate-900 text-sm md:text-base truncate block">
                            {post.customer?.fullName} sdfsdf sd fsdf sd f
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {formatDateKey(post.createdAt, t, i18n.language)}
                          </span>
                        </div>
                        {/* Actions & Meta */}
                        <div className="shrink-0">
                          <a href={`tel:${post.customer?.phoneNumber}`} className="no-underline">
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs border-emerald-600 hover:border-emerald-700"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{t("posts.contact_customer", "Contact Customer")}</span>
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3 h-3" />
                      <span>{post.customer?.subdivision}</span>
                    </div>
                    {/* Requirement Description */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{post.description}</p>
                    </div>
                  </div>

                  {/* Optional Image */}
                  {post.postImage && (
                    <div className="w-full rounded-xl overflow-hidden border border-slate-300 bg-white p-0">
                      <img src={post.postImage} alt="Requirement" className="w-full h-full object-cover" />
                    </div>
                  )}

                </div>
              ))}
            </div>

            <div className="h-10 flex items-center justify-center pt-4">
              {isFetchingNextPage ? (
                <Loader2 className="w-6 h-6 animate-spin text-indigo-700" />
              ) : hasNextPage ? (
                <span className="text-xs text-slate-400 font-medium">{t("pagination.scroll_load_more", "Scroll down to load more")}</span>
              ) : (
                <span className="text-xs text-slate-400 font-medium">{t("pagination.no_more_posts", "No more posts")}</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
