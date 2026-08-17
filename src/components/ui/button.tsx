import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-[-0.005em] cursor-pointer select-none transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px active:scale-[0.985] disabled:pointer-events-none disabled:opacity-55 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[inset_0_1px_0_color-mix(in_oklab,white_35%,transparent),0_8px_18px_-10px_color-mix(in_oklab,var(--color-primary)_75%,transparent)] hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-[inset_0_1px_0_color-mix(in_oklab,white_45%,transparent),0_14px_26px_-12px_color-mix(in_oklab,var(--color-primary)_85%,transparent)]",
        premium:
          "gradient-hero text-primary-foreground shadow-[inset_0_1px_0_color-mix(in_oklab,white_45%,transparent),0_12px_26px_-12px_color-mix(in_oklab,var(--color-primary)_85%,transparent)] hover:-translate-y-0.5 hover:brightness-[1.05]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[inset_0_1px_0_color-mix(in_oklab,white_30%,transparent),0_8px_18px_-12px_color-mix(in_oklab,var(--color-destructive)_80%,transparent)] hover:-translate-y-0.5 hover:bg-destructive/92",
        outline:
          "border border-border bg-card/80 backdrop-blur-sm shadow-[inset_0_1px_0_color-mix(in_oklab,white_40%,transparent),0_4px_12px_-8px_color-mix(in_oklab,var(--color-foreground)_40%,transparent)] hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[inset_0_1px_0_color-mix(in_oklab,white_45%,transparent),0_5px_14px_-10px_color-mix(in_oklab,var(--color-foreground)_50%,transparent)] hover:-translate-y-0.5 hover:bg-secondary/85",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline rounded-md",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-11 px-7 text-[0.95rem]",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    if (asChild) {
      return (
        <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
          {children}
        </Comp>
      );
    }
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="animate-spin" /> : null}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
