"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { buttonVariants, iconButtonVariants } from "@/lib/animations";

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "icon";
}

/**
 * Button with smooth spring animations
 * Feels premium and responsive
 */
export default function AnimatedButton({ 
  children, 
  className = "", 
  onClick,
  disabled = false,
  type = "button",
  variant = "default"
}: AnimatedButtonProps) {
  const variants = variant === "icon" ? iconButtonVariants : buttonVariants;

  return (
    <motion.button
      variants={variants}
      initial="rest"
      whileHover={!disabled ? "hover" : "rest"}
      whileTap={!disabled ? "tap" : "rest"}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
    >
      {children}
    </motion.button>
  );
}
