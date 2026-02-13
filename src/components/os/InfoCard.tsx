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
                className="bg-white/25 backdrop-blur-[40px] rounded-[32px] p-8 border border-white/40 shadow-xl transition-all duration-300"
            >
                {/* Avatar & Basic Info */}
                <div className="flex items-center gap-5">
                    <div
                        className="w-[64px] h-[64px] rounded-full bg-gradient-to-br from-[#00A3FF] to-[#0057FF] flex items-center justify-center overflow-hidden border-2 border-white/20 shadow-lg"
                    >
                        {/* High quality avatar style */}
                        <div className="w-full h-full flex items-center justify-center font-bold text-white text-2xl tracking-tighter shadow-inner">D</div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[19px] font-extrabold text-black/90 leading-tight tracking-[0.01em]">
                            Dzakwan — <span className="font-semibold text-black/40">Frontend Engineer</span>
                        </span>
                    </div>
                </div>

                {/* Tagline */}
                <p className="mt-5 text-[15px] leading-relaxed text-black/60 font-medium tracking-tight">
                    Crafting thoughtful digital experiences with clarity and purpose.
                </p>

                {/* Status Indicator */}
                <div className="mt-6 flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-[#28C840] shadow-[0_0_12px_rgba(40,200,64,0.5)] border border-white/30" />
                    <span className="text-[13px] font-bold text-black/45 tracking-wide">
                        Available for work
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
