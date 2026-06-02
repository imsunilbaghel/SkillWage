import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  icon,
  actionText,
  onActionClick,
  actionLoading,
  disabled,
  ...props
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  // Measure actual action text width for precise right padding
  const actionRef = React.useRef(null);
  const [actionWidth, setActionWidth] = React.useState(0);

  React.useEffect(() => {
    if (actionRef.current) {
      const width = actionRef.current.offsetWidth;
      setActionWidth(width);
    }
  }, [actionText, actionLoading]);

  return (
    <div className="relative focus-within:text-primary focus-within:[&_svg]:text-primary [&_svg]:[stroke-width:1.5]">
      <input
        type={inputType}
        data-slot="input"
        disabled={disabled}
        className={cn(
          "peer file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-12 w-full min-w-0 rounded-lg border bg-transparent py-3 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          icon ? "pl-12" : "pl-4", // 👈 fixed left side
          isPassword
            ? "pr-12"
            : actionText
              ? "" // dynamic padding handled below
              : "pr-4",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        style={{
          // 👇 dynamically add right padding based on actual button width
          paddingRight: actionText && !isPassword ? `${actionWidth + 26}px` : undefined,
        }}
        {...props}
      />

      {icon && (
        <div className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2 peer-aria-invalid:text-destructive peer-aria-invalid:[&_svg]:text-destructive pointer-events-none transition-colors duration-200">
          {icon}
        </div>
      )}

      {isPassword && (
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="size-5 cursor-pointer" strokeWidth={1.5} />
          ) : (
            <Eye className="size-5 cursor-pointer" strokeWidth={1.5} />
          )}
        </button>
      )}

      {actionText && onActionClick && !isPassword && (
        <button
          ref={actionRef}
          type="button"
          disabled={actionLoading}
          className="text-primary hover:text-primary/80 absolute top-1/2 right-4 -translate-y-1/2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
          onClick={onActionClick}
        >
          {actionLoading ? "Please wait..." : actionText}
        </button>
      )}
    </div>
  );
}

export { Input };
