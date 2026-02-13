"use client";

import { motion } from "framer-motion";
import { Z_LAYERS } from "@/hooks/useZIndex";

// ─── Info Card Widget ────────────────────────────────────────────────────────

export const InfoCard = () => {
    return (
        <motion.div
            className="absolute top-16 left-12 w-[340px] select-none pointer-events-auto"
            style={{ zIndex: Z_LAYERS.DESKTOP_ICONS + 5 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <div
                className="bg-white/30 backdrop-blur-[40px] rounded-[32px] p-8 border border-white/40 shadow-sm transition-all duration-300"
            >
                {/* Avatar & Basic Info */}
                <div className="flex items-center gap-5">
                    <div
                        className="w-[60px] h-[60px] rounded-full bg-black/10 flex items-center justify-center overflow-hidden"
                    >
                        {/* Placeholder for real avatar image later */}
                        <div className="w-full h-full bg-neutral-200 flex items-center justify-center font-bold text-neutral-500 text-xl">D</div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[17px] font-bold text-black/80 leading-tight tracking-tight">
                            Dzakwan — <span className="font-medium text-black/50">Frontend &amp; Mobile Engineer</span>
                        </span>
                    </div>
                </div>

                {/* Tagline */}
                <p className="mt-4 text-[14px] leading-relaxed text-black/50 font-medium">
                    Crafting thoughtful digital experiences with clarity and purpose.
                </p>

                {/* Status Indicator */}
                <div className="mt-5 flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840] shadow-[0_0_8px_rgba(40,200,64,0.4)]" />
                    <span className="text-[13px] font-semibold text-black/40">
                        Available for work
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
