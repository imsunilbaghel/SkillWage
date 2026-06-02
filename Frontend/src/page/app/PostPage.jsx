import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCreatePostSchema, getUpdateDescriptionSchema } from "@/lib/schemas/post";
import { useCustomerPosts, useCreatePost, useUpdatePostDescription, useCompletePost, useDeletePost } from "@/hooks/usePosts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MoreVertical, Edit2, CheckCircle2, Trash2, Image as ImageIcon, X, AlertTriangle, Wrench, HardHat, Zap, BrickWall, Paintbrush, Axe } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

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

const SERVICES = [
  { id: "labour", labelKey: "items.labour.title", icon: <HardHat className="size-5 fill-amber-500 stroke-1" /> },
  { id: "electrician", labelKey: "items.electrician.title", icon: <Zap className="fill-blue-400 stroke-1 size-5" /> },
  { id: "plumber", labelKey: "items.plumber.title", icon: <Wrench className="size-5 fill-gray-800 stroke-1" /> },
  { id: "mistri", labelKey: "items.mistri.title", icon: <BrickWall className="size-5 fill-orange-500 stroke-1" /> },
  { id: "painter", labelKey: "items.painter.title", icon: <Paintbrush className="size-5 fill-lime-600 stroke-1" /> },
  { id: "carpenter", labelKey: "items.carpenter.title", icon: <Axe className="size-5 stroke-1 fill-yellow-800" /> },
];

export default function PostPage() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation(["common", "services"]);
  const [postImage, setPostImage] = useState(null);
  const [postPreview, setPostPreview] = useState(null);
  const imageInputRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Edit/Delete Dialog State
  const [editingPost, setEditingPost] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // Responsive: Dialog on desktop, Drawer on mobile
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const { data, isLoading: isLoadingPosts, isFetchingNextPage, hasNextPage, fetchNextPage, isFetching } = useCustomerPosts();
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePostDescription();
  const completeMutation = useCompletePost();
  const deleteMutation = useDeletePost();

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isFetchingNextPage || !hasNextPage || isLoadingPosts) return;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        fetchNextPage();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetchingNextPage, hasNextPage, isLoadingPosts, fetchNextPage]);

  const form = useForm({
    resolver: zodResolver(getCreatePostSchema(t)),
    defaultValues: {
      category: "",
      description: "",
    },
  });

  const editForm = useForm({
    resolver: zodResolver(getUpdateDescriptionSchema(t)),
    defaultValues: {
      description: "",
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) { // 1MB
      toast.error(t("posts.toast.image_too_large", "Image must be under 1MB"));
      return;
    }

    setPostImage(file);
    setPostPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setPostImage(null);
    setPostPreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const onSubmit = async (data) => {
    createMutation.mutate({ postData: data, imageFile: postImage }, {
      onSuccess: () => {
        form.reset();
        clearImage();
      }
    });
  };

  const onEditSubmit = (data) => {
    if (!editingPost) return;
    updateMutation.mutate({ id: editingPost._id, description: data.description }, {
      onSuccess: () => setEditingPost(null)
    });
  };

  const confirmDelete = () => {
    if (!postToDelete) return;
    deleteMutation.mutate(postToDelete, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setPostToDelete(null);
      }
    });
  };

  const openEditDialog = (post) => {
    setEditingPost(post);
    editForm.reset({ description: post.description });
  };

  const posts = data?.pages?.flatMap(page => page?.data?.posts || []) || [];

  // ── Edit Dialog/Drawer Content ──
  const renderEditContent = () => (
    <div className="flex flex-col w-full h-full max-h-[90dvh] overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between gap-4 p-4 md:p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-indigo-700 flex items-center justify-center flex-shrink-0">
            <Edit2 className="size-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-tight">
              {t("posts.edit_desc", "Edit Description")}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {t("posts.description_placeholder", "Update your requirement details")}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setEditingPost(null)}
          className="max-md:hidden h-8 w-8 rounded-lg hover:bg-gray-100 text-gray-400 flex-shrink-0"
        >
          <X className="size-5" />
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
        <Form {...editForm}>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
            <FormField
              control={editForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="min-h-32 bg-slate-50 resize-y"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-[10px] text-slate-500">
                    {t("posts.word_count", "Words")}: {field.value.trim().split(/\s+/).filter(w => w.length > 0).length} / 10 min
                  </p>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 md:p-5 border-t border-gray-200 bg-white w-full flex items-center gap-3 md:justify-end">
        <Button type="button" variant="outline" onClick={() => setEditingPost(null)} className="rounded-xl max-md:flex-1 w-fit">
          {t("common:cancel", "Cancel")}
        </Button>
        <Button
          type="button"
          onClick={editForm.handleSubmit(onEditSubmit)}
          disabled={updateMutation.isPending}
          className="bg-indigo-700 hover:bg-indigo-800 rounded-xl max-md:flex-1 w-fit"
        >
          {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {t("common:save", "Save")}
        </Button>
      </div>
    </div>
  );

  // ── Delete Dialog/Drawer Content ──
  const renderDeleteContent = () => (
    <div className="flex flex-col w-full h-full max-h-[90dvh] overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between gap-4 p-4 md:p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="size-10 rounded-xl bg-red-600 flex items-center justify-center">
              <Trash2 className="size-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 size-5 rounded-full bg-amber-500 flex items-center justify-center ring-2 ring-white">
              <AlertTriangle className="size-2.5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-tight">
              {t("posts.delete_confirm", "Delete Requirement")}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {t("posts.delete_warning", "This action cannot be undone")}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDeleteDialogOpen(false)}
          className="max-md:hidden h-8 w-8 rounded-lg hover:bg-gray-100 text-gray-400 flex-shrink-0"
        >
          <X className="size-5" />
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 md:p-5">
        <div className="bg-red-50/60 border border-red-100 rounded-xl p-3.5 flex items-start gap-2.5">
          <AlertTriangle className="size-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 leading-relaxed">
            {t("posts.delete_warning", "Are you sure you want to delete this requirement? This action cannot be undone.")}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 md:p-5 border-t border-gray-200 bg-white w-full flex items-center gap-3 md:justify-end">
        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-xl max-md:flex-1 w-fit">
          {t("common:cancel", "Cancel")}
        </Button>
        <Button
          variant="destructive"
          onClick={confirmDelete}
          disabled={deleteMutation.isPending}
          className="rounded-xl max-md:flex-1 w-fit"
        >
          {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {t("posts.delete", "Delete")}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-8 font-sans">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 max-md:shadow-sm">
        <div className="flex w-full items-center max-w-4xl p-4 mx-auto">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">{t("posts.my_requirements", "My Requirements")}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Create Post Section */}
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
                    name="description"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormControl>
                          <Textarea
                            placeholder={t("posts.description_placeholder", "Describe your requirement in detail (minimum 10 words)...")}
                            className="min-h-24 bg-transparent border-0 shadow-none focus-visible:ring-0 text-base md:text-lg resize-none p-0 placeholder:text-slate-400"
                            {...field}
                          />
                        </FormControl>
                        <div className="flex justify-between items-center">
                          <FormMessage className="text-xs" />
                          <p className="text-[10px] text-slate-400 font-medium">
                            {field.value.trim().split(/\s+/).filter(w => w.length > 0).length} / 10 {t("posts.word_count_min", "words min")}
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Image Preview */}
                  {postPreview && (
                    <div className="relative w-fit">
                      <img src={postPreview} alt="Preview" className="h-40 w-auto rounded-xl border border-slate-200 object-cover" />
                      <button type="button" onClick={clearImage} className="absolute -top-2 -right-2 bg-white text-slate-600 rounded-full p-1.5 shadow-md border border-slate-200 hover:text-red-600 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="h-px w-full bg-slate-100 my-2"></div>

                  {/* Toolbar */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                    <div className="flex items-center gap-4 w-full">
                      {/* Category Select */}
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem className="flex-1 sm:w-48 space-y-0">
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className={cn(
                                  "bg-slate-50 rounded-full h-10 shadow-sm text-base transition-colors",
                                  field.value
                                    ? "border-indigo-700 text-indigo-700 font-medium data-[state=closed]:border-indigo-700 data-[state=closed]:text-indigo-700 data-[state=open]:border-indigo-700 data-[state=open]:text-indigo-700 focus:border-indigo-700 focus:text-indigo-700 hover:border-indigo-700"
                                    : "border-gray-300 text-slate-600"
                                )}>
                                  <SelectValue placeholder={
                                    <div className="flex items-center gap-2 text-slate-500">
                                      <Wrench className="w-5 h-5 text-orange-500 fill-orange-500 stroke-1" />
                                      <span>{t("posts.select_category", "Select category")}</span>
                                    </div>
                                  } />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SERVICES.map((srv) => (
                                  <SelectItem key={srv.id} value={srv.id}>
                                    <div className="flex items-center gap-2">
                                      {srv.icon}
                                      <span>{t(`services:${srv.labelKey}`)}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      {/* Image Upload Button */}
                      <div
                        onClick={() => imageInputRef.current?.click()}
                        className="flex items-center justify-center size-12 rounded-full border border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 cursor-pointer transition-colors shrink-0 shadow-sm"
                        title={t("posts.add_photo", "Add Photo")}
                      >
                        <input type="file" accept="image/*" className="hidden" ref={imageInputRef} onChange={handleImageChange} />
                        <ImageIcon className="w-5 h-5 text-blue-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
                      <Button
                        type="submit"
                        disabled={
                          createMutation.isPending ||
                          !form.watch("category") ||
                          (form.watch("description") || "").trim().split(/\s+/).filter(w => w.length > 0).length < 10
                        }
                        className="flex-1 sm:flex-none sm:w-auto rounded-full"
                      >
                        {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {t("posts.post_btn", "Post")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>

        {/* Posts List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">{t("posts.your_posts", "Your Posts")}</h2>
            {isFetching && !isLoadingPosts && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
          </div>

          {isLoadingPosts ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <Edit2 className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-slate-700 font-medium">{t("posts.no_posts", "No posts yet")}</h3>
              <p className="text-sm text-slate-500 mt-1">{t("posts.no_posts_desc", "Create your first requirement above.")}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {posts.map(post => (
                <div key={post._id} className={cn(
                  "bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col gap-4 max-w-3xl mx-auto",
                  post.status === "completed" && "opacity-75 bg-slate-50"
                )}>
                  {/* Content */}
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md text-xs font-semibold">
                          {t(`services:items.${post.category}.title`)}
                        </span>
                        <span className={cn(
                          "px-2.5 py-1 rounded-md text-xs font-semibold border",
                          post.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        )}>
                          {t(`posts.status_${post.status}`, post.status)}
                        </span>
                      </div>

                      {/* 3-dot menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-slate-500">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => openEditDialog(post)} disabled={post.status === "completed"}>
                            <Edit2 className="w-4 h-4 mr-2" /> {t("posts.edit_desc", "Edit Description")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => completeMutation.mutate(post._id)} disabled={post.status === "completed"} className="text-emerald-600 focus:text-emerald-600">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" /> {t("posts.mark_complete", "Mark as Complete")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setPostToDelete(post._id); setIsDeleteDialogOpen(true); }} className="text-red-600 focus:text-red-600">
                            <Trash2 className="w-4 h-4 mr-2 text-red-600 focus:text-red-600" /> {t("posts.delete", "Delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{post.description}</p>

                    <span className="text-[11px] text-slate-400 font-medium">
                      {formatDateKey(post.createdAt, t, i18n.language)} {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Image */}
                  {post.postImage && (
                    <div className="w-full shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={post.postImage} alt="Post" className="w-full h-full object-cover" />
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
            ) : posts.length > 0 ? (
              <span className="text-xs text-slate-400 font-medium">{t("pagination.no_more_posts", "No more posts")}</span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Edit Dialog/Drawer */}
      {isMobile ? (
        <Drawer open={!!editingPost} onOpenChange={(o) => !o && setEditingPost(null)}>
          <DrawerContent
            className="p-0 border-0 overflow-hidden flex flex-col data-[vaul-drawer-direction=bottom]:max-h-[90dvh] data-[vaul-drawer-direction=bottom]:border-0 data-[vaul-drawer-direction=bottom]:rounded-t-3xl"
            barColor="bg-gray-500"
            barHeight="h-1"
          >
            <DrawerTitle className="sr-only">
              {t("posts.edit_desc", "Edit Description")}
            </DrawerTitle>
            {renderEditContent()}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={!!editingPost} onOpenChange={(o) => !o && setEditingPost(null)}>
          <DialogContent
            className="overflow-hidden max-w-[calc(100vw-2rem)] flex flex-col max-h-[90dvh] sm:max-w-md p-0 gap-0 rounded-2xl border-0"
            showCloseButton={false}
          >
            <DialogTitle className="sr-only">
              {t("posts.edit_desc", "Edit Description")}
            </DialogTitle>
            {renderEditContent()}
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog/Drawer */}
      {isMobile ? (
        <Drawer open={isDeleteDialogOpen} onOpenChange={(o) => !o && setIsDeleteDialogOpen(false)}>
          <DrawerContent
            className="p-0 border-0 overflow-hidden flex flex-col data-[vaul-drawer-direction=bottom]:max-h-[90dvh] data-[vaul-drawer-direction=bottom]:border-0 data-[vaul-drawer-direction=bottom]:rounded-t-3xl"
            barColor="bg-gray-500"
            barHeight="h-1"
          >
            <DrawerTitle className="sr-only">
              {t("posts.delete_confirm", "Delete Requirement")}
            </DrawerTitle>
            {renderDeleteContent()}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent
            className="overflow-hidden max-w-[calc(100vw-2rem)] flex flex-col max-h-[90dvh] sm:max-w-md p-0 gap-0 rounded-2xl border-0"
            showCloseButton={false}
          >
            <DialogTitle className="sr-only">
              {t("posts.delete_confirm", "Delete Requirement")}
            </DialogTitle>
            {renderDeleteContent()}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
