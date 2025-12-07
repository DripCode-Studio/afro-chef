import React from "react";
import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  href?: string;
  variant?: "default" | "primary" | "accent" | "outline";
  className?: string;
}

export default function Tag({
  children,
  href,
  variant = "outline",
  className = "",
}: TagProps) {
  const baseStyles =
    "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 border-2 border-charcoal";

  const variants = {
    default: "bg-cream text-charcoal hover:bg-orange hover:text-white",
    primary:
      "bg-orange text-white shadow-[2px_2px_0px_0px_#0f1724] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#0f1724]",
    accent:
      "bg-teal text-white shadow-[2px_2px_0px_0px_#0f1724] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#0f1724]",
    outline: "bg-transparent text-charcoal hover:bg-charcoal hover:text-cream",
  };

  const classes = cn(baseStyles, variants[variant], className);

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return <span className={classes}>{children}</span>;
}
