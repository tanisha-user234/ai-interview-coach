"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagicCardProps {
    children: React.ReactNode;
    className?: string;
    gradientColor?: string;
    onClick?: () => void;
}

export const MagicCard = ({
    children,
    className = "",
    gradientColor = "#262626",
    onClick
}: MagicCardProps) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setOpacity(1);
    };

    const handleBlur = () => {
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className={`
            relative flex h-full w-full flex-col overflow-hidden rounded-2xl 
            border border-white/10 bg-slate-900/40 backdrop-blur-md 
            text-slate-200 shadow-xl transition-all duration-300
            hover:border-blue-500/50 hover:shadow-blue-500/20 group
            ${className}
        `}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(120, 119, 198, 0.2), transparent 40%)`,
                }}
            />

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex h-full flex-col p-6 md:p-8">
                {children}
            </div>
        </motion.div>
    );
};
