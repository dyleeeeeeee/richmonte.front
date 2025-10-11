"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cardVariants } from "@/lib/animations";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
}

/**
 * Card with smooth enter animation and hover effects
 * FAANG-level micro-interactions
 */
export default function AnimatedCard({ 
  children, 
  className = "", 
  onClick,
  delay = 0 
}: AnimatedCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className={className}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  );
}
