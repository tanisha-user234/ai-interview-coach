"use client";
import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface NeonButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "accent";
    glow?: boolean;
}

export const NeonButton = ({
    children,
    variant = "primary",
    glow = true,
    className = "",
    ...props
}: NeonButtonProps) => {
    const variants = {
        primary: "from-blue-600 to-cyan-600 shadow-blue-500/20 hover:shadow-blue-500/40 border-blue-400/20",
        secondary: "from-violet-600 to-indigo-600 shadow-violet-500/20 hover:shadow-violet-500/40 border-violet-400/20",
        accent: "from-pink-600 to-rose-600 shadow-pink-500/20 hover:shadow-pink-500/40 border-pink-400/20",
    };

    const glowStyle = glow ? "shadow-lg" : "";

    return (
        <motion.button
            whileHover={{ scale: 1.02, textShadow: "0 0 8px rgba(255,255,255,0.5)" }}
            whileTap={{ scale: 0.98 }}
            className={`
        relative group overflow-hidden rounded-lg px-6 py-3 font-semibold text-white 
        bg-gradient-to-r border transition-all duration-300
        ${variants[variant]} ${glowStyle} ${className}
      `}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
        </motion.button>
    );
};
