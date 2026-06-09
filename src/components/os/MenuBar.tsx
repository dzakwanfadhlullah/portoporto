"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { MacWifiIcon, MacBatteryIcon, MacSearchIcon } from "./MacIcons";
import { NotificationCenter } from "./NotificationCenter";

import { useSpotlightStore } from "@/stores/useSpotlightStore";
import { useBattery } from "@/hooks/useBattery";
import { Z_LAYERS } from "@/hooks/useZIndex";
import { useWindowStore } from "@/stores/useWindowStore";
import { useAppRegistry } from "@/stores/useAppRegistry";
import type { AppId } from "@/types/app";

const formatMenuBarTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
    const time = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
    return `${date}  ${time}`;
};

// ─── Menu Bar ────────────────────────────────────────────────────────────────

export const MenuBar = () => {
    const toggleSpotlight = useSpotlightStore((s) => s.toggle);
    const { level: batteryLevel, charging } = useBattery();
    const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
    const activeWindowId = useWindowStore((s) => s.activeWindowId);
    const activeWindow = useWindowStore((s) => activeWindowId ? s.windows[activeWindowId] : null);
    const getApp = useAppRegistry((s) => s.getApp);
    const activeApp = activeWindow ? getApp(activeWindow.appId as AppId) : null;
    const appMenuName = activeApp?.name ?? "Dzakwan";

    // Live clock with date
    const [dateTime, setDateTime] = useState("");

    useEffect(() => {
        const updateClock = () => setDateTime(formatMenuBarTime());
        const timeout = window.setTimeout(updateClock, 0);
        const interval = setInterval(updateClock, 10_000);
        return () => {
            window.clearTimeout(timeout);
            clearInterval(interval);
        };
    }, []);

    return (
        <motion.header
            className="absolute top-0 left-0 right-0 h-7 flex items-center justify-between px-4
                 backdrop-blur-xl backdrop-saturate-150"
            style={{
                zIndex: Z_LAYERS.MENUBAR,
                backgroundColor: "rgba(0, 0, 0, 0.18)",
                boxShadow: "inset 0 -0.5px 0 0 rgba(255, 255, 255, 0.12)",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* ── Left: Brand ───────────────────────────────────────── */}
            <div className="flex items-center gap-4">
                <span className="text-[13px] font-semibold tracking-tight text-white/90">
                    {appMenuName}
                </span>
                <nav className="hidden items-center gap-4 text-[13px] font-medium text-white/70 lg:flex">
                    {["File", "Edit", "View", "Window", "Help"].map((item) => (
                        <button
                            key={item}
                            type="button"
                            className="transition-colors hover:text-white"
                        >
                            {item}
                        </button>
                    ))}
                </nav>
            </div>

            {/* ── Right: Status Icons ──────────────────────────────── */}
            <div className="flex items-center gap-2.5">
                <button
                    type="button"
                    onClick={() => setIsControlCenterOpen((value) => !value)}
                    className="flex items-center gap-2 rounded-md px-1.5 py-0.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                    <MacWifiIcon size={13} />

                    {batteryLevel !== null && (
                        <span className="text-[11px] font-medium tabular-nums">
                            {batteryLevel}%
                        </span>
                    )}
                    <MacBatteryIcon
                        size={12}
                        level={batteryLevel}
                        charging={charging}
                    />
                    <SlidersHorizontal size={13} strokeWidth={2.2} />
                </button>

                {/* Spotlight Search */}
                <button
                    onClick={toggleSpotlight}
                    className="text-white/80 hover:text-white transition-colors flex items-center"
                >
                    <MacSearchIcon size={13} />
                </button>

                {/* Date + Time */}
                <span className="text-[12.5px] font-medium text-white/90 tabular-nums whitespace-nowrap ml-0.5">
                    {dateTime}
                </span>
            </div>

            {isControlCenterOpen && (
                <>
                    <button
                        type="button"
                        aria-label="Close Control Center"
                        className="fixed inset-0 cursor-default"
                        style={{ zIndex: Z_LAYERS.NOTIFICATIONS - 1 }}
                        onClick={() => setIsControlCenterOpen(false)}
                    />
                    <NotificationCenter
                        batteryLevel={batteryLevel}
                        charging={charging}
                        onClose={() => setIsControlCenterOpen(false)}
                    />
                </>
            )}
        </motion.header>
    );
};
