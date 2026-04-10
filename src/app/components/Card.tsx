import { ReactNode } from "react";
import { motion } from "motion/react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = "", onClick, hover = false }: CardProps) {
  const Component = hover ? motion.div : "div";

  return (
    <Component
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : {}}
      whileTap={hover && onClick ? { scale: 0.98 } : {}}
      className={`bg-card border border-border rounded-2xl p-4 ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </Component>
  );
}
