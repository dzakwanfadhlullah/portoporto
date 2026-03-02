"use client";

import { useCallback, useMemo, useRef } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    type MotionValue,
} from "framer-motion";

import { useWindowStore } from "@/stores/useWindowStore";
import { useAppRegistry } from "@/stores/useAppRegistry";
import { Z_LAYERS } from "@/hooks/useZIndex";
import { AppleIcon } from "./AppleIcon";
import type { AppId } from "@/types/app";

// ─── Constants ───────────────────────────────────────────────────────────────

const ICON_SIZE = 48;
const MAGNIFIED_SIZE = 68;
const DOCK_GAP = 6;
const MAGNIFICATION_DISTANCE = 140;

// ─── Dock Icon ───────────────────────────────────────────────────────────────

interface DockIconProps {
    appId: AppId;
    mouseX: MotionValue<number>;
    index: number;
}

const DockIcon = ({ appId, mouseX, index }: DockIconProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const getApp = useAppRegistry((s) => s.getApp);
    const openWindow = useWindowStore((s) => s.openWindow);
    const windows = useWindowStore((s) => s.windows);

    const app = getApp(appId);

    // Check if this app has open windows
    const windowState = useMemo(() => {
        const appWindows = Object.values(windows).filter((w) => w.appId === appId);
        const hasOpenWindow = appWindows.length > 0;
        const hasMinimized = appWindows.some((w) => w.isMinimized);
        const hasActive = appWindows.some((w) => w.isFocused);
        return { hasOpenWindow, hasMinimized, hasActive };
    }, [windows, appId]);

    // Magnification based on mouse distance
    const distance = useTransform(mouseX, (val: number) => {
        const el = ref.current;
        if (!el) return MAGNIFICATION_DISTANCE + 1;
        const rect = el.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        return Math.abs(val - center);
    });

    const size = useSpring(
        useTransform(distance, [0, MAGNIFICATION_DISTANCE], [MAGNIFIED_SIZE, ICON_SIZE]),
        { stiffness: 400, damping: 25, mass: 0.5 }
    );

    const handleClick = useCallback(() => {
        if (!app) return;

        const existingWindow = Object.values(useWindowStore.getState().windows).find(
            (w) => w.appId === appId
        );

        if (existingWindow) {
            if (existingWindow.isMinimized) {
                useWindowStore.getState().unminimizeWindow(existingWindow.id);
            } else {
                useWindowStore.getState().focusWindow(existingWindow.id);
            }
        } else {
            openWindow(
                appId,
                app.name,
                app.defaultWindowConfig.defaultWidth,
                app.defaultWindowConfig.defaultHeight
            );
        }
    }, [app, appId, openWindow]);

    if (!app) return null;

    return (
        <motion.div
            ref={ref}
            className="relative flex flex-col items-center cursor-pointer group"
            onClick={handleClick}
            whileTap={{ scale: 0.85 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
            {/* Tooltip */}
            <div
                className="absolute -top-8 px-2 py-0.5 rounded-md text-[10px] font-medium
                    bg-foreground/80 text-background whitespace-nowrap
                    opacity-0 group-hover:opacity-100 transition-opacity duration-150
                    pointer-events-none"
            >
                {app.name}
            </div>

            {/* Icon */}
            <motion.div
                className="flex items-center justify-center transition-shadow duration-200"
                style={{ width: size, height: size }}
            >
                <div className="w-12 h-12 flex items-center justify-center">
                    <AppleIcon
                        {...app.iconConfig}
                        isActive={windowState.hasOpenWindow}
                        style="3d"
                    />
                </div>
            </motion.div>

            {/* Window indicator dot */}
            {windowState.hasOpenWindow && (
                <div className="absolute -bottom-1.5 flex gap-0.5">
                    <div
                        className={`w-1 h-1 rounded-full transition-colors duration-200 ${windowState.hasActive
                            ? "bg-white"
                            : windowState.hasMinimized
                                ? "bg-white/30"
                                : "bg-white/60"
                            }`}
                    />
                </div>
            )}
        </motion.div>
    );
};

// ─── Dock Component ──────────────────────────────────────────────────────────

export const Dock = () => {
    const getDockApps = useAppRegistry((s) => s.getDockApps);
    const dockApps = useMemo(() => getDockApps(), [getDockApps]);
    const mouseX = useMotionValue(-MAGNIFICATION_DISTANCE * 2);

    return (
        <motion.div
            className="absolute right-4 top-1/2 -translate-y-1/2 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto sm:top-auto sm:translate-y-0"
            style={{ zIndex: Z_LAYERS.DOCK }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
            onMouseMove={(e) => mouseX.set(e.clientX)}
            onMouseLeave={() => mouseX.set(-MAGNIFICATION_DISTANCE * 2)}
        >
            {/* Glass container */}
            <div
                className="flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-2 p-2 sm:px-3 sm:pb-2 sm:pt-2
                   bg-white/20 backdrop-blur-[40px] rounded-[24px]
                   border border-white/30 shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
            >
                {dockApps.map((app, i) => (
                    <div key={app.id} className="flex flex-col sm:flex-row items-center sm:items-end gap-2">
                        <DockIcon appId={app.id} mouseX={mouseX} index={i} />
                        {/* Natural Divider after Projects (index 1) */}
                        {app.id === "projects" && (
                            <div className="w-[24px] h-[1px] sm:w-[1px] sm:h-[36px] bg-gradient-to-r sm:bg-gradient-to-b from-white/10 via-white/30 to-white/10 my-1 sm:my-0 sm:mx-0.5 self-center rounded-full" />
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
