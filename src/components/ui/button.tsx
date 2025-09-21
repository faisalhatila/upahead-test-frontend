import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active shadow-soft hover:shadow-medium",
        cta: "bg-cta text-cta-foreground hover:bg-cta-hover active:bg-cta-active shadow-soft hover:shadow-medium font-semibold",
        accent: "bg-accent text-accent-foreground hover:bg-accent-hover active:bg-accent-active shadow-soft hover:shadow-medium",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 border border-gray-200",
        outline: "border border-gray-300 bg-surface text-gray-700 hover:bg-gray-50 active:bg-gray-100",
        ghost: "text-gray-600 hover:bg-gray-100 active:bg-gray-200 hover:text-gray-800",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
        fab: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active shadow-medium hover:shadow-large rounded-full hover:-translate-y-1",
        danger: "bg-error text-error-foreground hover:bg-error/90 active:bg-error/80 shadow-soft hover:shadow-medium",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        default: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
