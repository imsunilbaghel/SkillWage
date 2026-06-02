import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import {
  User,
  CreditCard,
  Lock,
  ChevronRight,
  Camera,
  Trash2,
  ImagePlus,
  BadgeCheck,
  LogOut,
  Globe,
  Star,
  LifeBuoy,
  AlertCircle
} from "lucide-react";
import { useUpdateProfileImage } from "@/hooks/useProfile";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import LanguageToggler from "@/components/LanguageToggler";
import { Button } from "@/components/ui/button";

const ProfileMenu = () => {
  const { user, role, logout } = useAuth();
  const { t } = useTranslation(["common", "posts", "home"]);
  const fileInputRef = useRef(null);

  const { mutate: updateImage, isPending: isUpdatingImage } = useUpdateProfileImage();

  const [imgError, setImgError] = useState(false);

  // Reset imgError if user profile image changes
  useEffect(() => {
    setImgError(false);
  }, [user?.profileImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateImage(file);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const menuItems = [
    {
      label: t("common:personal_info", "Personal Information"),
      path: "/app/profile/personal",
      icon: User,
      visible: true,
    },
    {
      label: t("common:address_info", "Address Information"),
      path: "/app/profile/address",
      icon: CreditCard,
      visible: true,
    },
    {
      label: t("common:service_charge", "Service Charge"),
      path: "/app/profile/service-charge",
      icon: CreditCard,
      visible: role === "worker",
    },
    {
      label: t("common:change_password", "Change Password"),
      path: "/app/profile/password",
      icon: Lock,
      visible: true,
    },
    {
      label: t("common:support.menu_item", "Support"),
      path: "/app/profile/support",
      icon: LifeBuoy,
      visible: true,
    },
  ];

  return (
    <div className="min-h-full bg-slate-50/50 max-md:pb-24 w-full font-sans">
      <div className="max-w-4xl mx-auto md:px-4 md:py-8 lg:px-8 grid grid-cols-1 gap-6">

        {/* Profile Card */}
        <div className="bg-white md:rounded-3xl max-md:border-b md:border border-gray-300 overflow-hidden">
          {/* Header Background */}
          <div className="h-24 md:h-32 bg-gradient-to-br from-indigo-900 to-indigo-700 relative">
            {role === "worker" && !user?.isVerified && (
              <div className="absolute top-4 right-4 bg-white backdrop-blur-sm px-3 py-1.5 rounded-sm flex items-center gap-1.5 shadow-sm">
                <BadgeCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700 uppercase tracking-wider">{t("common:verified_worker", "Verified Worker")}</span>
              </div>
            )}
          </div>

          <div className="px-6 pb-6 -mt-12 flex flex-col items-center">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 shadow-md flex items-center justify-center overflow-hidden">
                {user?.profileImage && !imgError ? (
                  <img
                    src={user.profileImage}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span className="text-4xl md:text-5xl font-bold text-indigo-600 select-none">
                    {getInitials(user?.fullName)}
                  </span>
                )}

                {/* Upload Overlay while pending */}
                {isUpdatingImage && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Action Buttons for Avatar */}
              <div className="absolute -bottom-2 right-0 flex gap-1">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUpdatingImage}
                  size="sm"
                  className="p-4 w-10 h-10"
                >
                  <Camera className="w-3 h-3" />
                </Button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="flex flex-col gap-1 items-center justify-center">
              <h2 className="mt-4 text-xl md:text-2xl font-bold text-slate-900">{user?.fullName}</h2>
              <p className="text-sm text-slate-500 capitalize font-medium">{t(`common:${role}_account`, `${role} Account`)}</p>
              {role === "worker" && user?.averageRating && user.averageRating > 0 && (
                <div className="mt-1 flex items-center justify-center gap-2 bg-emerald-600 rounded-full px-4 py-1 text-white">
                  <Star className="w-5 h-5 text-white fill-white" />{user?.averageRating}
                </div>)}
            </div>

          </div>
        </div>

        {/* Worker Status Message */}
        {role === "worker" && user?.statusMessage && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mx-4 md:mx-0 flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 text-sm mb-1">Admin Message</h3>
              <p className="text-amber-700 text-sm whitespace-pre-wrap">{user.statusMessage}</p>
            </div>
          </div>
        )}

        {/* Menu Section */}
        <div className="bg-white rounded-3xl border border-gray-300 overflow-hidden max-md:mx-4">
          <div className="flex flex-col">
            {menuItems
              .filter((item) => item.visible)
              .map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center justify-between p-4 md:p-5 hover:bg-slate-50 transition-colors group",
                      index !== 0 && "border-t border-slate-100"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-100 transition-all">
                        <Icon className="w-5 h-5 text-indigo-700" />
                      </div>
                      <span className="font-semibold text-slate-700 text-md">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-all  duration-200 group-hover:translate-x-1" />
                  </Link>
                );
              })}
          </div>
        </div>

        {/* Mobile Settings (Language & Logout) */}
        <div className="md:hidden flex flex-col gap-6 max-md:px-4 mb-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-300 ">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Globe className="w-5 h-5 text-slate-600" />
              </div>
              <span className="font-semibold text-slate-700">{t("common:language", "Change Language")}</span>
            </div>
            <LanguageToggler />
          </div>

          <Button
            variant="destructive"
            className="w-full rounded-2xl h-14 text-base font-semibold gap-2 bg-white border border-red-500 text-red-500"
            onClick={() => logout()}
          >
            <LogOut className="w-5 h-5" />
            {t("common:logout", "Logout")}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ProfileMenu;
