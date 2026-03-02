"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MacWifiIcon, MacBatteryIcon, MacSearchIcon } from "./MacIcons";

import { useSpotlightStore } from "@/stores/useSpotlightStore";
import { useBattery } from "@/hooks/useBattery";
import { Z_LAYERS } from "@/hooks/useZIndex";

// ─── Menu Bar ────────────────────────────────────────────────────────────────

export const MenuBar = () => {
    const toggleSpotlight = useSpotlightStore((s) => s.toggle);
    const { level: batteryLevel, charging } = useBattery();

    // Live clock with date
    const [dateTime, setDateTime] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const updateClock = () => {
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
            setDateTime(`${date}  ${time}`);
        };
        updateClock();
        const interval = setInterval(updateClock, 10_000);
        return () => clearInterval(interval);
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
            <div className="flex items-center">
                <span className="text-[13px] font-semibold tracking-tight text-white/90">
                    Dzakwan
                </span>
            </div>

            {/* ── Right: Status Icons ──────────────────────────────── */}
            <div className="flex items-center gap-2.5">
                {/* WiFi (static) */}
                <div className="text-white/80 flex items-center">
                    <MacWifiIcon size={13} />
                </div>

                {/* Battery (dynamic) */}
                <div className="flex items-center gap-1 text-white/80">
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
                </div>

                {/* Spotlight Search */}
                <button
                    onClick={toggleSpotlight}
                    className="text-white/80 hover:text-white transition-colors flex items-center"
                >
                    <MacSearchIcon size={13} />
                </button>

                {/* Date + Time */}
                {mounted && (
                    <span className="text-[12.5px] font-medium text-white/90 tabular-nums whitespace-nowrap ml-0.5">
                        {dateTime}
                    </span>
                )}
            </div>
        </motion.header>
    );
};
