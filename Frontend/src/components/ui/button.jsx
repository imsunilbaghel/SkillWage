import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button-variants";

function Button({
  className,
  variant,
  size,
  asChild = false,
  icon,
  iconPosition = "left",
  children,
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  const content = icon ? (
    <span
      className={cn(
        "inline-flex items-center gap-2",
        iconPosition === "right" && "flex-row-reverse"
      )}
    >
      <span className="inline-flex shrink-0">{icon}</span>
      {children}
    </span>
  ) : (
    children
  );

  if (asChild) {
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {content}
      </Comp>
    );
  }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {content}
    </Comp>
  );
}

export { Button };
