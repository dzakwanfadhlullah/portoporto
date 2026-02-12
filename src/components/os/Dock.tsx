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
                className="flex items-center justify-center rounded-[12px]
                   bg-card/80 shadow-os-soft border border-border/30
                   hover:shadow-os-medium transition-shadow duration-200"
                style={{ width: size, height: size }}
            >
                <div className="text-foreground/80">{app.icon}</div>
            </motion.div>

            {/* Window indicator dot */}
            {windowState.hasOpenWindow && (
                <div className="absolute -bottom-1.5 flex gap-0.5">
                    <div
                        className={`w-1 h-1 rounded-full transition-colors duration-200 ${windowState.hasActive
                                ? "bg-accent-terracotta"
                                : windowState.hasMinimized
                                    ? "bg-muted-foreground/40"
                                    : "bg-foreground/30"
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
            className="fixed bottom-2 left-1/2 -translate-x-1/2"
            style={{ zIndex: Z_LAYERS.DOCK }}
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
            onMouseMove={(e) => mouseX.set(e.clientX)}
            onMouseLeave={() => mouseX.set(-MAGNIFICATION_DISTANCE * 2)}
        >
            {/* Glass container */}
            <div
                className="flex items-end gap-1.5 px-3 pb-1.5 pt-1.5
                   glass dark:glass-dark rounded-os-lg
                   shadow-os-medium"
            >
                {dockApps.map((app, i) => (
                    <DockIcon key={app.id} appId={app.id} mouseX={mouseX} index={i} />
                ))}
            </div>
        </motion.div>
    );
};
