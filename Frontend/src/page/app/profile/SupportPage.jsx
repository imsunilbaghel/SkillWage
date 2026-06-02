import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSupports, useCreateSupport } from "@/hooks/useSupport";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Image as ImageIcon, X, LifeBuoy, ArrowLeft, ExternalLink } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCreateSupportSchema } from "@/lib/schemas/support";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate, useNavigation } from "react-router";

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

export default function SupportPage() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation(["common"]);
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(getCreateSupportSchema(t)),
    defaultValues: {
      query: "",
    },
  });

  const { data, isLoading: isLoadingSupports, isFetchingNextPage, hasNextPage, fetchNextPage, isFetching } = useSupports();
  const createMutation = useCreateSupport();

  useEffect(() => {
    const handleScroll = () => {
      if (isFetchingNextPage || !hasNextPage || isLoadingSupports) return;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        fetchNextPage();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetchingNextPage, hasNextPage, isLoadingSupports, fetchNextPage]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB
      toast.error(t("support.image_too_large", "Image must be under 2MB"));
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const onSubmit = async (data) => {
    createMutation.mutate({ query: data.query, imageFile }, {
      onSuccess: () => {
        form.reset();
        clearImage();
      }
    });
  };

  const supports = data?.pages?.flatMap(page => page?.data?.supports || []) || [];

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-8 font-sans">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex w-full items-center max-w-4xl p-4 mx-auto gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-300 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">{t("support.title", "Help & Support")}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Create Support Section */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm transition-all duration-300">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-start gap-3 w-full">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200 mt-1">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-700">
                      {user?.fullName?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div className="flex-1 w-full min-w-0 space-y-3">
                  <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormControl>
                          <Textarea
                            placeholder={t("support.query_placeholder", "Describe your issue in detail (minimum 10 words)...")}
                            className="min-h-24 bg-transparent border border-slate-200 focus-visible:ring-indigo-500 rounded-xl text-base md:text-lg resize-y p-3 placeholder:text-slate-400"
                            {...field}
                          />
                        </FormControl>
                        <div className="flex justify-between items-center px-1">
                          <FormMessage className="text-xs text-red-500" />
                          <p className="text-[10px] text-slate-400 font-medium">
                            {field.value.trim().split(/\s+/).filter(w => w.length > 0).length} / 10 {t("posts.word_count_min", "words min")}
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative w-fit">
                      <img src={imagePreview} alt="Preview" className="h-40 w-auto rounded-xl border border-slate-200 object-cover" />
                      <button type="button" onClick={clearImage} className="absolute -top-2 -right-2 bg-white text-slate-600 rounded-full p-1.5 shadow-md border border-slate-200 hover:text-red-600 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="h-px w-full bg-slate-100 my-2"></div>

                  {/* Toolbar */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                    <div className="flex items-center gap-4 w-full">
                      {/* Image Upload Button */}
                      <div
                        onClick={() => imageInputRef.current?.click()}
                        className="flex items-center justify-center size-12 rounded-full border border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 cursor-pointer transition-colors shrink-0 shadow-sm"
                        title={t("support.upload_screenshot", "Upload Screenshot")}
                      >
                        <input type="file" accept="image/*" className="hidden" ref={imageInputRef} onChange={handleImageChange} />
                        <ImageIcon className="w-5 h-5 text-blue-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
                      <Button
                        type="submit"
                        disabled={createMutation.isPending || (form.watch("query") || "").trim().split(/\s+/).filter(w => w.length > 0).length < 10}
                        className="flex-1 sm:flex-none sm:w-auto rounded-full bg-indigo-700 hover:bg-indigo-800"
                      >
                        {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {t("support.submit", "Submit Ticket")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>

        {/* Supports List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">{t("support.your_tickets", "Your Tickets")}</h2>
            {isFetching && !isLoadingSupports && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
          </div>

          {isLoadingSupports ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : supports.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <LifeBuoy className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-slate-700 font-medium">{t("support.no_tickets", "No support tickets found")}</h3>
              <p className="text-sm text-slate-500 mt-1">{t("support.no_tickets_desc", "If you need help, please raise a new support ticket above.")}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {supports.map(support => (
                <div key={support._id} className={cn(
                  "bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col gap-4 max-w-3xl mx-auto w-full",
                  support.status === "resolved" && "opacity-75"
                )}>
                  {/* Content */}
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn(
                          "px-2.5 py-1 rounded-md text-xs font-semibold border",
                          support.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        )}>
                          {t(`support.status_${support.status}`, support.status)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{support.query}</p>

                    {support.statusMessage && (
                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 mt-1">
                        <p className="text-xs font-semibold text-indigo-800 mb-1">{t("support.admin_response", "Admin Response")}</p>
                        <p className="text-sm text-indigo-900 whitespace-pre-wrap">{support.statusMessage}</p>
                      </div>
                    )}

                    <span className="text-[11px] text-slate-400 font-medium">
                      {formatDateKey(support.createdAt, t, i18n.language)} {new Date(support.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Image Link for Pending Status */}
                  {support.status === "pending" && support.screenshot && (
                    <div className="w-full shrink-0 pt-2 border-t border-slate-100">
                      <a
                        href={support.screenshot}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <ImageIcon className="w-4 h-4" />
                        {t("support.view_image", "View Image")}
                        <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Infinite Scroll Loading Indicator */}
          <div className="h-10 flex items-center justify-center">
            {isFetchingNextPage ? (
              <Loader2 className="w-6 h-6 animate-spin text-indigo-700" />
            ) : hasNextPage ? (
              <span className="text-xs text-slate-400 font-medium">{t("pagination.scroll_load_more", "Scroll down to load more")}</span>
            ) : supports.length > 0 ? (
              <span className="text-xs text-slate-400 font-medium">{t("pagination.no_more_requests", "No more requests found")}</span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
