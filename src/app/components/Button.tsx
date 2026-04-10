import { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "motion/react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "rounded-xl transition-all duration-200 flex items-center justify-center gap-2";

  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 active:scale-95",
    secondary: "bg-secondary text-secondary-foreground hover:opacity-90 active:scale-95",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground active:scale-95",
    ghost: "text-primary hover:bg-primary/10 active:scale-95",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
