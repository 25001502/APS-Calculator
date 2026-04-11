import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "success" | "warning" | "info" | "default";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variantStyles = {
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    info: "bg-info/10 text-info border-info/20",
    default: "bg-muted text-muted-foreground border-border",
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
