"use client";

import { motion } from "framer-motion";
import { Z_LAYERS } from "@/hooks/useZIndex";

// ─── Info Card Widget ────────────────────────────────────────────────────────

export const InfoCard = () => {
    return (
        <motion.div
            className="fixed top-12 left-5 w-[260px] select-none pointer-events-auto"
            style={{ zIndex: Z_LAYERS.DESKTOP_ICONS + 5 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28, delay: 0.4 }}
        >
            <div
                className="glass dark:glass-dark rounded-os-lg p-5 space-y-3.5
                   shadow-os-soft border border-border/30"
            >
                {/* Avatar */}
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-terracotta/80 to-accent-sage/60
                       flex items-center justify-center text-white text-sm font-bold shadow-sm"
                    >
                        D
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground leading-tight">
                            Dzakwan
                        </span>
                        <span className="text-[10px] text-muted-foreground leading-tight">
                            Frontend &amp; Mobile Engineer
                        </span>
                    </div>
                </div>

                {/* Tagline */}
                <p className="text-[11px] leading-relaxed text-muted-foreground/80">
                    Crafting seamless digital experiences with precision and purpose.
                </p>

                {/* Status */}
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        Available for work
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
