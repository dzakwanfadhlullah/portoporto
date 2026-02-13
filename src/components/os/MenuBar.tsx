"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { AppleIcon } from "./AppleIcon";

import { useWindowStore } from "@/stores/useWindowStore";
import { useAppRegistry } from "@/stores/useAppRegistry";
import { useSpotlightStore } from "@/stores/useSpotlightStore";
import { Z_LAYERS } from "@/hooks/useZIndex";
import type { AppId } from "@/types/app";

// ─── Menu Bar ────────────────────────────────────────────────────────────────

const NAV_ITEMS: { label: string; appId: AppId }[] = [
    { label: "Projects", appId: "projects" },
    { label: "Archive", appId: "lab" },
    { label: "About", appId: "about" },
    { label: "Contact", appId: "contact" },
];

export const MenuBar = () => {
    const openWindow = useWindowStore((s) => s.openWindow);
    const getApp = useAppRegistry((s) => s.getApp);
    const toggleSpotlight = useSpotlightStore((s) => s.toggle);

    // Live clock
    const [time, setTime] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const updateClock = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                })
            );
        };
        updateClock();
        const interval = setInterval(updateClock, 10_000);
        return () => clearInterval(interval);
    }, []);

    const handleNavClick = useCallback(
        (appId: AppId) => {
            const app = getApp(appId);
            if (app) {
                openWindow(
                    appId,
                    app.name,
                    app.defaultWindowConfig.defaultWidth,
                    app.defaultWindowConfig.defaultHeight
                );
            }
        },
        [getApp, openWindow]
    );


    return (
        <motion.header
            className="absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-6
                 bg-transparent backdrop-blur-sm border-b border-black/5"
            style={{ zIndex: Z_LAYERS.MENUBAR }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* ── Left: Brand ───────────────────────────────────────── */}
            <div className="flex items-center">
                <span className="text-[13px] font-semibold tracking-tight text-foreground/80">
                    Dzakwan
                </span>
            </div>

            {/* ── Right: Navigation & Status ──────────────────────────── */}
            <div className="flex items-center gap-6">
                <nav className="flex items-center gap-5">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.appId}
                            onClick={() => handleNavClick(item.appId)}
                            className="text-[12.5px] font-medium text-foreground/50
                         hover:text-foreground/90 transition-colors duration-200"
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="flex items-center gap-3 pl-2 border-l border-black/5">
                    {/* Spotlight */}
                    <button
                        onClick={toggleSpotlight}
                        className="text-foreground/40 hover:text-foreground/70 transition-colors"
                    >
                        <AppleIcon icon={Search} style="symbol" size={14} />
                    </button>


                    {/* Clock */}
                    {mounted && (
                        <span className="text-[12px] font-semibold text-foreground/60 tabular-nums min-w-[36px] text-right">
                            {time}
                        </span>
                    )}
                </div>
            </div>
        </motion.header>
    );
};
