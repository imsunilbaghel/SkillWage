import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-indigo-700 border-2 border-indigo-700 text-white hover:bg-indigo-800 hover:border-indigo-800",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "w-full border-1 rounded-xl border-gray-300 text-slate-600 hover:bg-gray-50 hover:text-slate-900 text-xs md:text-sm",
        // Add this to your buttonVariants
        destructiveOutline:
          "border-2 border-destructive text-destructive hover:bg-destructive hover:text-white",

        secondary: "bg-white text-primary hover:bg-white/90 shadow-sm",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        registration:
          "w-full h-auto p-6 rounded-2xl border border-primary bg-white/50 hover:bg-white/90 text-left flex items-center justify-start gap-5 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 relative overflow-hidden whitespace-normal text-gray-900 shadow-sm",
        clear: "",
      },
      size: {
        default: "h-12 px-8 py-3 has-[>svg]:px-6",
        xs: "h-6 rounded-full gap-1 px-3",
        sm: "h-9 rounded-full gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-14 rounded-full px-10 has-[>svg]:px-8",
        icon: "size-12",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        clear: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
