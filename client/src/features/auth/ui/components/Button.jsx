import React from "react";
import { cn } from "../../../../lib/cn";

const variants = {
  primary:
    "bg-accent text-white hover-bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-ink underline underline-offset-2 hover:text-accent",
};

const Button = ({
  variant = "primary",
  className,
  children,
  ref,
  ...props
}) => {
  return (
    <button
      ref={ref}
      className={cn(
        "rounded-lg text-[15px] font-medium transition-colors",
        variant === "primary" && "w-full px-3.5 py-2.5",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
