"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeDemo() {
    const isDark = false;

    return (
        <div className="w-full h-full flex items-center justify-center bg-muted/5">
            <motion.div
                className="relative w-24 h-12 rounded-full bg-muted border border-border/40 p-1 flex items-center shadow-inner"
            >
                <motion.div
                    animate={{ x: isDark ? 48 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-10 h-10 rounded-full bg-background shadow-lg border border-border/20 flex items-center justify-center text-primary"
                >
                    {isDark ? <Moon size={18} /> : <Sun size={18} />}
                </motion.div>

                <div className="absolute inset-0 flex justify-around items-center pointer-events-none opacity-20">
                    <Sun size={14} />
                    <Moon size={14} />
                </div>
            </motion.div>
        </div>
    );
}
