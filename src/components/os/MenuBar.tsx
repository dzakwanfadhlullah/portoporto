"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

import { useWindowStore } from "@/stores/useWindowStore";
import { useAppRegistry } from "@/stores/useAppRegistry";
import { useSpotlightStore } from "@/stores/useSpotlightStore";
import { Z_LAYERS } from "@/hooks/useZIndex";
import type { AppId } from "@/types/app";

// ─── Menu Bar ────────────────────────────────────────────────────────────────

const NAV_ITEMS: { label: string; appId: AppId }[] = [
    { label: "Projects", appId: "projects" },
    { label: "Lab", appId: "lab" },
    { label: "About", appId: "about" },
    { label: "Contact", appId: "contact" },
];

export const MenuBar = () => {
    const openWindow = useWindowStore((s) => s.openWindow);
    const getApp = useAppRegistry((s) => s.getApp);
    const toggleSpotlight = useSpotlightStore((s) => s.toggle);
    const { theme, setTheme } = useTheme();

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

    const toggleTheme = useCallback(() => {
        setTheme(theme === "dark" ? "light" : "dark");
    }, [theme, setTheme]);

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 h-9 flex items-center justify-between px-4
                 glass dark:glass-dark border-b border-border/40"
            style={{ zIndex: Z_LAYERS.MENUBAR }}
            initial={{ y: -36 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
        >
            {/* ── Left: Brand ───────────────────────────────────────── */}
            <div className="flex items-center gap-4">
                <span className="text-sm font-bold tracking-tight text-foreground">
                    Dzakwan
                </span>

                {/* Nav items */}
                <nav className="hidden sm:flex items-center gap-1">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.appId}
                            onClick={() => handleNavClick(item.appId)}
                            className="px-2.5 py-1 text-xs font-medium text-muted-foreground
                         hover:text-foreground hover:bg-foreground/5
                         rounded-md transition-all duration-150"
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* ── Right: Status Area ────────────────────────────────── */}
            <div className="flex items-center gap-2">
                {/* Spotlight trigger */}
                <button
                    onClick={toggleSpotlight}
                    className="p-1.5 rounded-md text-muted-foreground
                     hover:text-foreground hover:bg-foreground/5
                     transition-all duration-150"
                    aria-label="Search"
                >
                    <Search size={14} />
                </button>

                {/* Theme toggle */}
                {mounted && (
                    <button
                        onClick={toggleTheme}
                        className="p-1.5 rounded-md text-muted-foreground
                       hover:text-foreground hover:bg-foreground/5
                       transition-all duration-150"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                    </button>
                )}

                {/* Clock */}
                {mounted && (
                    <span className="text-xs font-medium text-muted-foreground tabular-nums min-w-[36px] text-right">
                        {time}
                    </span>
                )}
            </div>
        </motion.header>
    );
};
